import {
  Client,
  SlashCommandBuilder,
  PermissionResolvable,
  ChatInputCommandInteraction,
  CacheType,
} from "discord.js";
import { Options } from "./types";

export type BotSlashCommand = {
  run: (client: Client, arg: ChatInputCommandInteraction) => void;
  data: SlashCommandBuilder;

  deleted?: boolean;
  validations?: {
    devOnly?: boolean; // Only allowed to be ran by dev users (specified in Options obj)
    testOnly?: boolean; // Only allowed to be ran on the testGuild (provided in Options obj)
    botPermissions?: PermissionResolvable[];
    userPermissions?: PermissionResolvable[];
    guildOnly?: boolean;
    directOnly?: boolean;
    custom?: (client: Client) => void;
  };
};

export async function init(
  client: Client,
  commandPaths: string[],
  settings: Options
) {
  // Fetching application commands to update cache and work with it
  let appCommands;
  if (settings.testGuildId) {
    const guild = await client.guilds
      .fetch(settings.testGuildId)
      .then((value) => value);
    appCommands = guild.commands;

    await appCommands.fetch();
  } else {
    appCommands = client.application?.commands;
    if (!appCommands) {
      console.error(`client is not an application`);
      return;
    }

    await appCommands.fetch();
  }

  // Registering changes
  const slashCommands: { [key: string]: BotSlashCommand } = {};
  for (const commandPath of commandPaths) {
    const name = commandPath.split("\\").at(-1)?.split(".").at(0);
    if (!name) continue;

    const commandModule: BotSlashCommand = require(commandPath).default;
    const existingCommand = appCommands.cache.find((cmd) => cmd.name == name);

    if (existingCommand) {
      if (commandModule.deleted) {
        await appCommands.delete(existingCommand.id);
        console.log(`❌ DELETED '${name}' slash command`);
        continue;
      }
      if (existingCommand.description !== commandModule.data.description) {
        await appCommands.edit(existingCommand.id, commandModule.data);
        console.log(`✅ UPDATED '${name}' slash command`);
      }
    } else {
      if (commandModule.deleted) continue;

      await appCommands.create(commandModule.data, settings.testGuildId);
      console.log(`✅ CREATED '${name}' slash command`);
    }

    slashCommands[name] = commandModule;
  }

  // Listening to chat input commands
  client.on("interactionCreate", (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const commandModule = slashCommands[interaction.commandName];
    if (!commandModule) return;
    if (!canBeRan(interaction, commandModule, settings)) return;

    try {
      commandModule.run(client, interaction);
    } catch (error) {
      console.error(
        `ERROR while running ${interaction.commandName};\n${error}`
      );
    }
  });
}

function canBeRan(
  interaction: ChatInputCommandInteraction<CacheType>,
  commandModule: BotSlashCommand,
  settings: Options
): boolean {
  if (!commandModule.validations) return true;

  if (commandModule.validations.devOnly) {
    if (!settings.devUserIds?.includes(interaction.user.id)) {
      interaction.reply({
        content: "Only developers can run this command.",
        ephemeral: true,
      });
      return false;
    }
  }
  if (commandModule.validations.testOnly) {
    if (interaction.guildId !== settings.testGuildId) {
      interaction.reply({
        content: "This command cannot be ran here.",
        ephemeral: true,
      });
      return false;
    }
  }
  if (commandModule.validations.guildOnly) {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "This command can only be ran in server.",
        ephemeral: true,
      });
      return false;
    }
  }
  if (commandModule.validations.directOnly) {
    if (interaction.inGuild()) {
      interaction.reply({
        content: "This command can only be ran in direct messages.",
        ephemeral: true,
      });
      return false;
    }
  }
  if (commandModule.validations.botPermissions?.length) {
    const lackPermissions = [];
    for (const permission of commandModule.validations.botPermissions) {
      if (!interaction.appPermissions?.has(permission)) {
        lackPermissions.push(permission);
      }
    }

    if (lackPermissions.length) {
      let text = `I do not have enough permissions`;
      if (
        interaction.guildId === settings.testGuildId ||
        interaction.memberPermissions?.has("Administrator")
      ) {
        // Listing the permissions the bot lacks to testers or admins
        text += " (";
        for (let i = 0; i < lackPermissions.length; i++) {
          if (i !== 0) {
            text += ", ";
          }
          text += `${lackPermissions[i]}`;
        }
        text += ")";
      }

      interaction.reply({
        content: text,
        ephemeral: true,
      });
      return false;
    }
  }
  if (commandModule.validations.userPermissions?.length) {
    for (const permission of commandModule.validations.userPermissions) {
      if (!interaction.memberPermissions?.has(permission)) {
        interaction.reply({
          content: `You do not have enough permissions (${permission}).`,
          ephemeral: true,
        });
        return false;
      }
    }
  }

  return true;
}
