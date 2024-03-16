// socket--
const socketIo = require('socket.io');

const initSocket = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: "https://upachaar-prototype2-g6dulxvg1-ram-sahus-projects.vercel.app",
            methods: ["GET", "POST"],
            credentials: true 
        }
    });
    return io;
};

module.exports = initSocket;