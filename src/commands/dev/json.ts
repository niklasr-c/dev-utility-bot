import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { isValidJson, formatJson } from '../../utils/json';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('json')
    .setDescription('Dev Tool: JSON validieren oder formatieren')
    .addSubcommand(subcommand =>
      subcommand
        .setName('validate')
        .setDescription('Prüft, ob ein String gültiges JSON ist')
        .addStringOption(option =>
          option.setName('input')
            .setDescription('Der zu prüfende JSON-String')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('format')
        .setDescription('Formatiert einen JSON-String (Pretty Print)')
        .addStringOption(option =>
          option.setName('input')
            .setDescription('Der zu formatierende JSON-String')
            .setRequired(true)
        )
    ) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const input = interaction.options.getString('input', true);

    if (subcommand === 'validate') {
      const isValid = isValidJson(input);
      if (isValid) {
        await interaction.reply({ content: '✅ **Gültiges JSON!** Die Syntax ist korrekt.', ephemeral: true });
      } else {
        await interaction.reply({ content: '❌ **Ungültiges JSON!** Da ist ein Syntaxfehler drin.', ephemeral: true });
      }
    } 
    
    else if (subcommand === 'format') {
      try {
        const formatted = formatJson(input);
        // Wir packen die Ausgabe in einen Discord Code-Block für Syntax-Highlighting
        await interaction.reply({ content: `**Formatiertes JSON:**\n\`\`\`json\n${formatted}\n\`\`\`` });
      } catch (error) {
        await interaction.reply({ content: '❌ **Fehler:** Kann nicht formatiert werden, da das JSON ungültig ist.', ephemeral: true });
      }
    }
  },
};