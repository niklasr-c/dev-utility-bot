import { Client, GatewayIntentBits, Events, Collection, REST, Routes } from 'discord.js';
import { env } from './config/env';
import fs from 'node:fs';
import path from 'node:path';
import { Command } from './types/command';
import { prisma } from './database/prisma';
import * as http from 'http';

console.log("🚀 Starte Bot...");

// Wir erweitern den normalen Client um eine Collection für unsere Commands
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const commands = new Collection<string, Command>();

// 1. Commands aus den Ordnern laden
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

const slashCommandsData: any[] = []; // Hier sammeln wir die Daten für die Discord API

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  // Wir suchen nur nach .ts (oder .js) Dateien
  const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
  
  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const { command } = require(filePath) as { command: Command };
    
    if ('data' in command && 'execute' in command) {
      commands.set(command.data.name, command);
      slashCommandsData.push(command.data.toJSON());
      console.log(`✅ Command geladen: /${command.data.name}`);
    } else {
      console.log(`[WARNUNG] Der Command in ${filePath} ist fehlerhaft.`);
    }
  }
}

// 2. Event: Bot ist online & Commands bei Discord registrieren
client.once(Events.ClientReady, async (c) => {
  console.log(`✅ Ready! Eingeloggt als ${c.user.tag}`);

  try {
    console.log(`🔄 Registriere ${slashCommandsData.length} Slash Commands...`);
    const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);
    
    // Registriert die Commands global für den Bot
    await rest.put(
      Routes.applicationCommands(c.user.id),
      { body: slashCommandsData },
    );
    console.log(`✅ Slash Commands erfolgreich registriert!`);
  } catch (error) {
    console.error(error);
  }
});

// 3. Event: Jemand führt einen Slash-Command aus
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) return;

  try {
    // 1. Command ausführen
    await command.execute(interaction);

    // 2. Pro-Move: Nach erfolgreicher Ausführung die Statistik in der Datenbank updaten!
    await prisma.commandStat.upsert({
      where: { name: interaction.commandName },
      update: { uses: { increment: 1 } },
      create: { name: interaction.commandName, uses: 1 },
    });

  } catch (error) {
    console.error(error);
    // Nur antworten, wenn der Bot nicht schon vorher im Command geantwortet hat
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: '❌ Es gab einen Fehler beim Ausführen dieses Commands!', ephemeral: true });
    }
  }
});

// --- Dummy Web-Server für Render ---
// Render verlangt einen offenen Port, sonst killt es den Bot.
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Dev-Utility-Bot is alive and running!\n');
}).listen(port, () => {
    console.log(`✅ Dummy-Server gestartet auf Port ${port}`);
});

//client.login(env.DISCORD_TOKEN);

// Den Debug-Modus einschalten (gibt jede Netzwerk-Aktion im Log aus)
client.on('debug', (info) => console.log(`[DISCORD DEBUG]: ${info}`));

// Login mit Fehler-Falle
client.login(env.DISCORD_TOKEN)
  .then(() => console.log('✅ Login-Anfrage erfolgreich an Discord gesendet!'))
  .catch(err => console.error('❌ FATALER LOGIN-FEHLER:', err));