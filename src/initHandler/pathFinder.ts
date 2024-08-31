/*
    Finds and returns arrays of all commands and events .ts files

    Hierarchy example:
      system
        events
          ready
            example.ts
          messageCreate
            example.ts
        commands
          test1.ts
          test2.ts
*/

const LOG_FETCH_RESULT = true;

import * as fs from "fs";
import * as path from "path";

export default (): {
  eventPaths: { [key: string]: string[] };
  commandPaths: string[];
} => {
  const systemFolderPaths = getAllFiles(
    path.join(__dirname, "..", "systems"),
    true
  );
  const eventPaths = {} as { [key: string]: string[] };
  const commandPaths: string[] = [];

  for (const systemFolderPath of systemFolderPaths) {
    // Find `events` and `commands` folders in each system folder

    const eventsPath = path.join(systemFolderPath, "events");
    if (fs.existsSync(eventsPath)) {
      const eventFolders = getAllFiles(eventsPath, true);
      for (const eventFolder of eventFolders) {
        const eventName = eventFolder.split("\\").at(-1);
        if (!eventName) continue;

        eventPaths[eventName] = [];

        const eventFiles = getAllFiles(eventFolder);
        for (const eventFile of eventFiles) {
          eventPaths[eventName].push(eventFile);
        }
      }
    }

    const commandsPath = path.join(systemFolderPath, "commands");
    if (fs.existsSync(commandsPath)) {
      const commandFiles = getAllFiles(commandsPath);
      for (const commandFile of commandFiles) {
        commandPaths.push(commandFile);
      }
    }
  }

  if (LOG_FETCH_RESULT) {
    console.log(
      `[pathFinder]: logging fetch result. You can turn this off here: ${__filename}`
    );
    console.log("events:", eventPaths);
    console.log("commands", commandPaths);
  }

  return { eventPaths, commandPaths };
};

function getAllFiles(
  directory: string,
  foldersOnly: boolean = false,
  includeDescendants: boolean = false
): string[] {
  const readFiles = fs.readdirSync(directory, { withFileTypes: true });
  let filePathNames: string[] = [];

  for (const file of readFiles) {
    const fullPathName = path.join(directory, file.name);

    if (file.isDirectory()) {
      if (foldersOnly) {
        filePathNames.push(fullPathName);
      }
      if (includeDescendants) {
        filePathNames = filePathNames.concat(
          getAllFiles(fullPathName, foldersOnly, true)
        );
      }
    } else if (file.isFile()) {
      if (!foldersOnly) {
        filePathNames.push(fullPathName);
      }
    }
  }

  return filePathNames;
}
