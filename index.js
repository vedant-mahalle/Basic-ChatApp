const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

const io = require("socket.io")(server)

app.use(express.static(path.join(__dirname, "public")));

let socketConnected = new Set()

io.on('connection', (socket) => {
    onConnection(socket);
})


function onConnection(socket) {
    console.log('a user connected', socket.id);
    socketConnected.add(socket.id)

    socket.emit('socket-id',{id:socket.id})
    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data)
    })
    io.emit('clients-total',socketConnected.size)
    
    
    socket.on('disconnect', () => {
        console.log('a user disconnected', socket.id);
        socketConnected.delete(socket.id)
    })

    socket.on('message', (data) => {
        console.log(data)
        socket.broadcast.emit('chat-message', data)
    })
}