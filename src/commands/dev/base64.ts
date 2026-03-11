import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { encodeBase64, decodeBase64 } from '../../utils/base64';

export const command: Command = {
  // 1. Wir definieren den Command und seine Unterbefehle
  data: new SlashCommandBuilder()
    .setName('base64')
    .setDescription('Dev Tool: Encode oder decode Base64 Strings')
    .addSubcommand(subcommand =>
      subcommand
        .setName('encode')
        .setDescription('Wandelt normalen Text in Base64 um')
        .addStringOption(option =>
          option.setName('text')
            .setDescription('Der Text, der encodiert werden soll')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('decode')
        .setDescription('Wandelt Base64 zurück in normalen Text')
        .addStringOption(option =>
          option.setName('text')
            .setDescription('Der Base64 String, der decodiert werden soll')
            .setRequired(true)
        )
    ) as SlashCommandBuilder, // Type Assertion für unser Interface

  // 2. Die Logik, wenn der Command in Discord ausgeführt wird
  async execute(interaction: ChatInputCommandInteraction) {
    // Wir holen uns den Unterbefehl (encode/decode) und den eingegebenen Text
    const subcommand = interaction.options.getSubcommand();
    const text = interaction.options.getString('text', true);

    try {
      if (subcommand === 'encode') {
        const result = encodeBase64(text);
        await interaction.reply({ 
          content: `**Input:** \`${text}\`\n**Base64 Encoded:** \`${result}\`` 
        });
      } else if (subcommand === 'decode') {
        const result = decodeBase64(text);
        await interaction.reply({ 
          content: `**Base64 Input:** \`${text}\`\n**Decoded:** \`${result}\`` 
        });
      }
    } catch (error) {
      // Falls jemand beim Decoden keinen echten Base64-String eingibt
      await interaction.reply({ 
        content: '❌ Fehler beim Verarbeiten. Ist der Input wirklich ein gültiger Base64-String?', 
        ephemeral: true 
      });
    }
  },
};