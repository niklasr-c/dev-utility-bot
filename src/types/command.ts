import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface Command {
  // Die Struktur des Commands (Name, Beschreibung, Optionen)
  data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  
  // Die Funktion, die ausgeführt wird, wenn jemand den Command nutzt
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}