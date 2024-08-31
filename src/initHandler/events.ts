import { Client } from "discord.js";

export type BotEvent = (client: Client, arg: any) => void;

export function init(client: Client, eventPaths: { [key: string]: string[] }) {
  for (const eventName in eventPaths) {
    for (const eventFile of eventPaths[eventName]) {
      client.on(eventName, (arg) => {
        import(eventFile)
          .then((event) => {
            event.default(client, arg);
          })
          .catch((error) => {
            console.log(
              `ERROR: on ${eventName} event;\npath: ${eventFile};\n(${error})`
            );
          });
      });
    }
  }
}
