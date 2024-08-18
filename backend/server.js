const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
      origin: "http://localhost:3000"
  }
});
app.use(express.static('public'));
const cors = require('cors');

app.use(cors());
var users = [];
var usernames = [];
var messages = {};

io.on('connection', (socket) => {
    console.log(`${socket.id} user just connected....`);

    socket.on('newUser', (data) => {
      users.push(data);
      usernames[data.userName] = data.socketId;
      io.emit('userJoined', users);
    })

    socket.on('changedCurrentUser', (data) => {
      const from = data.from;
      const to = data.to;
      if(typeof messages[from]==='undefined') {
        messages[from] = {};
      }
      if(typeof messages[from][to]==='undefined') {
        messages[from][to]=[];
      }
      console.log(messages[from][to]);
      socket.emit('newCurrentUser', messages[from][to]);
    })

    socket.on('sendMessage', (data) => {
      const from = data.from;
      const to = data.to;
      if(typeof messages[from]==='undefined') {
        messages[from] = {};
      }
      if(typeof messages[from][to]==='undefined') {
        messages[from][to]=[];
      }

      if(typeof messages[to]==='undefined') {
        messages[to] = {};
      }
      if(typeof messages[to][from]==='undefined') {
        messages[to][from]=[];
      }
      messages[from][to].push({fromSelf: true, message:data.message})
      messages[to][from].push({fromSelf: false, message:data.message})
      socket.broadcast.to(usernames[data.to]).emit('receiveMessage', {from: data.from, message:data.message});
    })

    socket.on('disconnect', () => {
      console.log(`${socket.id} disconnected`);
      users = users.filter(user => user.socketId!==socket.id);
      io.emit('userLeft', users);
    })
})
const port = 4000;
server.listen(port , ()=>{
    console.log(`Server is running on port ${port}.......`);
})