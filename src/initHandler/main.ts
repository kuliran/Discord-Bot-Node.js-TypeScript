/*
  Connects all events and commands to the bot on initialization

  Note: In order to update a command for the bot, change its file name or description
*/

import { Client } from "discord.js";
import pathFinder from "./pathFinder.js";
import * as slashCommands from "./slashCommands.js";
import * as events from "./events.js";
import { Options } from "./types.js";

export { Options };
export { BotEvent } from "./events.js";
export { BotSlashCommand } from "./slashCommands.js";

export function init(client: Client, options?: Options) {
  const result = pathFinder();
  const settings = options || {};

  events.init(client, result.eventPaths);
  client.on("ready", () => {
    slashCommands.init(client, result.commandPaths, settings);
  });
}
