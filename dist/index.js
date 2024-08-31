"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
require("dotenv/config");
const discord_js_1 = require("discord.js");
const initHandler = require("@initHandler");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.IntentsBitField.Flags.Guilds,
        discord_js_1.IntentsBitField.Flags.GuildMembers,
        discord_js_1.IntentsBitField.Flags.GuildMessages,
        discord_js_1.IntentsBitField.Flags.MessageContent,
    ],
});
// Starter Configuration
const configuration = {
    testGuildId: "1278396920964059227",
    devUserIds: ["544229880062279680"],
};
try {
    initHandler.init(client, configuration);
    console.log("Logging in...");
    client.login(process.env.BOT_TOKEN);
}
catch (error) {
    console.error(`ERROR while initializing;\n${error}`);
}
