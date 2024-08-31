import { BotSlashCommand } from "@initHandler";
import { SlashCommandBuilder } from "discord.js";

export default {
  run: (client, interaction) => {
    console.log(`${interaction.user.username} said test`);

    interaction.reply({
      content: "nice",
      ephemeral: true,
    });
  },
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test.."),

  validations: {
    devOnly: true,
  },
} as BotSlashCommand;
