import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/command';
import { testRegex } from '../../utils/regex';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('regex')
    .setDescription('Dev Tool: Teste einen regulären Ausdruck (Regex) gegen einen Text')
    .addStringOption(option =>
      option.setName('pattern')
        .setDescription('Das Regex Pattern (z.B. \\d+ für Zahlen)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Der Text, der durchsucht werden soll')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('flags')
        .setDescription('Optionale Flags (Standard ist "g" für global)')
        .setRequired(false)
    ) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    const pattern = interaction.options.getString('pattern', true);
    const text = interaction.options.getString('text', true);
    // Wenn der User keine Flags angibt, nehmen wir 'g'
    const flags = interaction.options.getString('flags') ?? 'g';

    const result = testRegex(pattern, text, flags);

    if (!result.isValid) {
      await interaction.reply({ 
        content: `❌ **Ungültiges Regex Pattern!**\nFehler: \`${result.error}\``, 
        ephemeral: true 
      });
      return;
    }

    if (result.matches.length === 0) {
      await interaction.reply({ 
        content: `🔍 **Keine Treffer gefunden.**\nPattern: \`/${pattern}/${flags}\`\nText: \`${text}\`` 
      });
      return;
    }

    // Wir machen eine hübsche Liste aus den Treffern
    const matchesList = result.matches.map((m, i) => `${i + 1}. \`${m}\``).join('\n');
    
    await interaction.reply({ 
      content: `✅ **${result.matches.length} Treffer gefunden!**\nPattern: \`/${pattern}/${flags}\`\n\n**Matches:**\n${matchesList}` 
    });
  },
};