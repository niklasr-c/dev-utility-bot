import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { Command } from '../../types/command';
import { generateColorImage } from '../../services/colorService';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('color')
    .setDescription('Dev Tool: Zeigt eine visuelle Vorschau eines HEX-Farbkodes')
    .addStringOption(option =>
      option.setName('hex')
        .setDescription('Der HEX-Code der Farbe (z.B. #FF5733 oder 00FF00)')
        .setRequired(true)
    ) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    let hexColor = interaction.options.getString('hex', true).trim();

    // 1. Validierung: Wir prüfen mit Regex, ob es wirklich ein echter HEX-Code ist
    const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/i;
    if (!hexRegex.test(hexColor)) {
      await interaction.reply({ 
        content: '❌ **Ungültiges Format!** Bitte nutze einen validen HEX-Code wie `#FF5733` oder `000000`.', 
        ephemeral: true 
      });
      return;
    }

    // Falls der User das "#" vergessen hat, hängen wir es automatisch an
    if (!hexColor.startsWith('#')) {
      hexColor = `#${hexColor}`;
    }

    // 2. Wir lassen unseren Service das Bild malen
    const imageBuffer = generateColorImage(hexColor);

    // 3. Den Buffer in eine echte Discord-Datei (Attachment) umwandeln
    const attachment = new AttachmentBuilder(imageBuffer, { name: 'color-preview.png' });

    // 4. Ein schickes Embed bauen und das Bild als Image setzen
    const embed = new EmbedBuilder()
      .setColor(hexColor as any) // Pro-Move: Das Embed leuchtet in exakt der gesuchten Farbe!
      .setTitle(`🎨 Farb-Vorschau: ${hexColor.toUpperCase()}`)
      .setImage('attachment://color-preview.png') // So verknüpft man das Attachment mit dem Embed
      .setFooter({ text: 'Generiert mit @napi-rs/canvas' });

    // 5. Abschicken!
    await interaction.reply({ embeds: [embed], files: [attachment] });
  },
};