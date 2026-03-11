import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/command';
import { prisma } from '../../database/prisma';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Zeigt die Bot-Statistiken und meistgenutzten Commands an'),

  async execute(interaction: ChatInputCommandInteraction) {
    // Wir holen die Top 5 Commands aus der Datenbank, sortiert nach Nutzung (absteigend)
    const topCommands = await prisma.commandStat.findMany({
      orderBy: { uses: 'desc' },
      take: 5,
    });

    // Wir bauen das Ergebnis als schönen Text zusammen
    const statsText = topCommands.length > 0 
      ? topCommands.map((cmd, index) => `**${index + 1}.** \`/${cmd.name}\` - ${cmd.uses}x genutzt`).join('\n')
      : 'Noch keine Commands genutzt!';

    // Ein schickes Embed für die Ausgabe
    const embed = new EmbedBuilder()
      .setColor('#5865F2') // Discord Blurple
      .setTitle('📊 Bot Statistiken')
      .addFields(
        { name: '🏆 Top Commands', value: statsText }
      )
      .setFooter({ text: 'Datenbank: SQLite + Prisma' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};