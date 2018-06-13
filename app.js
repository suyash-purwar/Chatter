const cors = require("cors");

// Setting up port
const port = process.env.PORT || 3000;
var express = require('express');
const app = express();
var server = require('http').Server(app);
var socket = require('socket.io');

server.listen(port);

const {mongoose} = require("./db/mongoose");
const {Users} = require("./models/Users");
const {Message} = require("./models/Messages");

// Enabling CORS
app.use(cors());

// Setting statis folder
app.use(express.static("public"));

const io = socket(server)
// Verify user
io.on("connection", (socket) => {
   socket.on("verify_user", (data) => {
      Users.find().then((users) => {
         let wantToSendUnauthorizedUserMessage = true;

         users.forEach(x => {
            if (x.user_name == data.userData.userName && x.user_password == data.userData.userPassword) {

               socket.emit("Authorised user", {
                  user_data: x
               });
               
               wantToSendUnauthorizedUserMessage = false;
            }
         });

         if (wantToSendUnauthorizedUserMessage) {
            socket.emit("Unauthorized user", {
               userData: null
            });
         }
      });
   });
});

io.on("connection", (socket) => {
   // Sending message
   socket.on("send-message", (data) => {
      io.sockets.emit("send-message", data);
      new Message({
         author: data.data.author,
         message: data.data.message
      }).save().then((msg_data) => {
         console.log("Message is sent successfully");
      }, (err) => {
         console.log("Error");
      });
   });
});


io.on("connection", (socket) => {
   socket.on("fetchMessagesFromDB", (data) => {
      Message.find().then((messages) => {
         socket.emit("getOldMessages", {messages});
      }, (err) => {
         console.log("error");
      });
   });
});

// URI => mongodb://suyash:chatter06@ds251845.mlab.com:51845/chatter