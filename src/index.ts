import "module-alias/register";
import "dotenv/config";
import { Client, IntentsBitField } from "discord.js";
import * as initHandler from "@initHandler";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

// Starter Configuration
const configuration: initHandler.Options = {
  testGuildId: "1278396920964059227",
  devUserIds: ["544229880062279680"],
};

try {
  initHandler.init(client, configuration);
  console.log("Logging in...");
  client.login(process.env.BOT_TOKEN);
} catch (error) {
  console.error(`ERROR while initializing;\n${error}`);
}
