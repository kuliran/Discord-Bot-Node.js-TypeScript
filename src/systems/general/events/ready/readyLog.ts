import { BotEvent } from "@initHandler";

const botEvent: BotEvent = (client) => {
    console.log(`${client.user?.username} is online.`);
}

export default botEvent