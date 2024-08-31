import { Message } from "discord.js";
import { BotEvent } from "@initHandler";

const botEvent: BotEvent = (client, message:Message) => {
    if (message.content !== "Hi") return;
    message.reply("Hi. Nice to see you");
}

export default botEvent