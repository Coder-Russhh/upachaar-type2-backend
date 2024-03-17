// socket--
const socketIo = require('socket.io');

const initSocket = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true 
        }
    });
    return io;
};

module.exports = initSocket;