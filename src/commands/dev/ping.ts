import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/command';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Antwortet mit Pong und zeigt die Latenz!'),
    
  async execute(interaction) {
    // Wenn der Command ausgeführt wird, antworten wir:
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    
    // Kleines Extra: Wir berechnen die echte Latenz!
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`🏓 Pong! Latenz: ${latency}ms`);
  },
};