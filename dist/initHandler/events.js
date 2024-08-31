"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = init;
function init(client, eventPaths) {
    for (const eventName in eventPaths) {
        for (const eventFile of eventPaths[eventName]) {
            client.on(eventName, (arg) => {
                Promise.resolve(`${eventFile}`).then(s => require(s)).then((event) => {
                    event.default(client, arg);
                })
                    .catch((error) => {
                    console.log(`ERROR: on ${eventName} event;\npath: ${eventFile};\n(${error})`);
                });
            });
        }
    }
}
