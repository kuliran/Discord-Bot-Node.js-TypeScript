"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botEvent = (client, message) => {
    if (message.content !== "Hi")
        return;
    message.reply("Hi. Nice to see you");
};
exports.default = botEvent;
