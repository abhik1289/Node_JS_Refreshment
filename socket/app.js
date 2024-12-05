const server = require('http').createServer();
const io = require('socket.io')(server);
const PORT = 3000;

io.on('connection', client => {
    client.on('event', data => { /* … */ });
    client.on('disconnect', () => { /* … */ });
});
server.listen(PORT);
console.log("listening on port", PORT);
io.on('connection', (socket) => {
    console.log(socket)
})