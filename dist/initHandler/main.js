"use strict";
/*
  Connects all events and commands to the bot on initialization

  Note: In order to update a command for the bot, change its file name or description
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = init;
const pathFinder_js_1 = require("./pathFinder.js");
const slashCommands = require("./slashCommands.js");
const events = require("./events.js");
function init(client, options) {
    const result = (0, pathFinder_js_1.default)();
    const settings = options || {};
    events.init(client, result.eventPaths);
    client.on("ready", () => {
        slashCommands.init(client, result.commandPaths, settings);
    });
}
