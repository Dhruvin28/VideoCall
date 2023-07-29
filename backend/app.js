////const app = require('express')();
////const server = require('http').Server(app);
////const io = require('socket.io')(server, {
////    cors: {
////        origin: "*",
////        methods: ["GET", "POST"]
////    }, path: "/socket"
////});

////io.on('connection', socket => {
////    socket.on('join-room', (roomId, userId) => {
////        socket.join(roomId);
////        socket.broadcast.to(roomId).emit('user-connected', userId);
////        socket.on('disconnect', () => {
////            socket.broadcast.to(roomId).emit('user-disconnected', userId);
////        })
////        socket.on('chat', (content) => {
////            socket.broadcast.to(roomId).emit('new-message', content);
////        })
////    })

////});
////const port = 1437;
////server.listen(port, () => console.log('listening on port' + port));


////////////////////////////////


const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();

// Read SSL/TLS certificates
const privateKey = fs.readFileSync('path/to/private.key.pem', 'utf8');
const certificate = fs.readFileSync('path/to/certificate.crt.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const server = https.createServer(credentials, app);
const io = require('socket.io')(server
    //, {
    //cors: {
    //    origin: "*",
    //    methods: ["GET", "POST"]
    //}
    //, path: "/socket"
});

io.on('connection', socket => {
    //console.log("socket" + JSON.stringify(socket));
    socket.on('join-room', (roomId, userId) => {
        //console.log("roomId" + JSON.stringify(roomId));
        //console.log("userId" + JSON.stringify(userId));
        socket.join(roomId);
        //console.log("userId" + JSON.stringify(userId));
        socket.broadcast.to(roomId).emit('user-connected', userId);
        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId);
        })
        socket.on('chat', (content) => {
            socket.broadcast.to(roomId).emit('new-message', content);
        })
    })
});

const PORT = 1437; // Port 443 for HTTPS
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});
