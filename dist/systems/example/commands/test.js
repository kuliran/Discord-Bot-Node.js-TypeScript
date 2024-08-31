"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    run: (client, interaction) => {
        console.log(`${interaction.user.username} said test`);
        interaction.reply({
            content: "nice",
            ephemeral: true,
        });
    },
    data: new discord_js_1.SlashCommandBuilder()
        .setName("test")
        .setDescription("Test.."),
    validations: {
        devOnly: true,
    },
};
