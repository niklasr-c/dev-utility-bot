import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/command';
import { fetchRepoInfo } from '../../services/githubService';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription('GitHub Integrationen')
    .addSubcommand(subcommand =>
      subcommand
        .setName('repo')
        .setDescription('Ruft Informationen zu einem öffentlichen GitHub Repository ab')
        .addStringOption(option =>
          option.setName('owner')
            .setDescription('Der Besitzer des Repos (z.B. facebook)')
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName('name')
            .setDescription('Der Name des Repos (z.B. react)')
            .setRequired(true)
        )
    ) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    // Pro-Move: Wir sagen Discord "Ich lade..." damit der Request nicht nach 3 Sekunden in einen Timeout läuft
    await interaction.deferReply();

    const owner = interaction.options.getString('owner', true);
    const repoName = interaction.options.getString('name', true);

    try {
      // Wir rufen unseren Service auf
      const repoData = await fetchRepoInfo(owner, repoName);

      // Falls die GitHub API 404 zurückgibt (Repo existiert nicht)
      if (!repoData) {
        await interaction.editReply(`❌ Das Repository **${owner}/${repoName}** wurde auf GitHub nicht gefunden.`);
        return;
      }

      // Datum europäisch formatieren (z.B. 11.03.2026)
      const updatedDate = new Date(repoData.updatedAt).toLocaleDateString('de-DE');

      // Das wunderschöne Discord Embed bauen
      const embed = new EmbedBuilder()
        .setColor('#2b3137') // Offizielles GitHub Dunkelgrau
        .setTitle(`📚 ${repoData.fullName}`)
        .setURL(repoData.url) // Macht den Titel klickbar
        .setThumbnail(repoData.ownerAvatar) // Profilbild des Repo-Besitzers oben rechts
        .setDescription(repoData.description || '*Keine Beschreibung verfügbar.*')
        .addFields(
          { name: '⭐ Stars', value: repoData.stars.toLocaleString('de-DE'), inline: true },
          { name: '💻 Sprache', value: repoData.language || 'Unbekannt', inline: true },
          { name: '🕒 Letztes Update', value: updatedDate, inline: true }
        )
        .setFooter({ text: 'Daten bereitgestellt von der GitHub API' });

      // Embed abschicken (wir editieren die deferReply von oben)
      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      // Falls GitHub komplett down ist oder das Rate Limit zuschlägt
      await interaction.editReply('❌ Es gab einen Fehler bei der Kommunikation mit der GitHub API.');
    }
  },
};