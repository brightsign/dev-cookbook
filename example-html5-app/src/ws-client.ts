import { io, Socket } from "socket.io-client";

import {
    handleWsMessage,
    initUtils,
    getMessageFromErrorResponse,
} from "./ws-utils";
import { getConfig } from "./config";
import { bsPlayer, BrightSignPlayer } from "./brightsign/player";

const config = getConfig();

const createSocket = async () => {
    const player: BrightSignPlayer = await bsPlayer();
    const deviceInfo = player.BSDeviceInfo;
    const identifier = deviceInfo.serialNumber;
    await initUtils(identifier, player);

    const socket: Socket = io(config.wsServerUrl, {
        transports: ["websocket"],
        reconnectionDelay: config.reconnectionDelay,
        reconnection: true,
        reconnectionDelayMax: config.reconnectionDelayMax,
        auth: {
            uuid: "1234",
            identifier: identifier,
            type: "player",
        },
    });

    socket.on("connect", () => {
        console.log(`Connected ${identifier}: ${socket.id}`);
    });

    socket.on("disconnect", (reason) => {
        console.log(`Disconnected: ${socket.id}, reason: ${reason}`);
    });

    socket.on("ws_message", (data) => {
        console.log(
            `Received message from WebSocket server: ${JSON.stringify(data)}`
        );
        if (config.isDesktop) {
            // direct reply the message back to the server in desktop mode
            const source = data.source;
            const destination = data.destination;
            data.source = destination;
            data.destination = source;
            if (data.type == "RestRequest") data.type = "RestResponse";
            socket.emit("ws_message", { ...data, status: "received" });
        } else {
            // talk with ldws on the player
            handleWsMessage(data, socket);
        }
    });

    socket.on("error", (err) => {
        console.log(`Error: ${getMessageFromErrorResponse(err)}`);
    });

    socket.on("connect_error", (error) => {
        if (socket.active) {
            // temporary failure, the socket will automatically try to reconnect
            console.log(
                `Socket connection has error but still active: ${getMessageFromErrorResponse(error)}`
            );
        } else {
            // the connection was denied by the server
            // in that case, `socket.connect()` must be manually called in order to reconnect
            console.log(
                `Socket connection failed: ${getMessageFromErrorResponse(error)}`
            );
        }
    });

    socket.onAny((event, ...args) => {
        console.log(`got ${event} with args ${args}`);
    });
};

export { createSocket };
