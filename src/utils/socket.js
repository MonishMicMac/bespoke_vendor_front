import { io } from 'socket.io-client';

let socket;

export const connectSocket = (url) => {
    if (!socket && url) {
        socket = io(url);
    }
    return socket;
};

export const onSocketEvent = (event, callback) => {
    if (socket) {
        socket.on(event, callback);
    }
};

export const offSocketEvent = (event, callback) => {
    if (socket) {
        socket.off(event, callback);
    }
};

export const emitSocketEvent = (event, data) => {
    if (socket) {
        socket.emit(event, data);
    }
};
