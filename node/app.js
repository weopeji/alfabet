var express             = require('express');
var app                 = express();
var http                = require('http');
var server              = http.createServer(app);
var { Server }          = require("socket.io");
var config              = require('./config.json');
var io                  = new Server(server, {
    cors: {
        origin: "http://localhost",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => 
{
    console.log('a user connected');
});

server.listen(config.server_port, () => 
{
    console.log('listening on *:3000');
});