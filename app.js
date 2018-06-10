const express = require("express");
const socket = require("socket.io");
const cors = require("cors");

const {mongoose} = require("./db/mongoose");
const {Users} = require("./models/Users");
const {Message} = require("./models/Messages");

const app = express();
const server = app.listen(3000, () => {
   console.log("Started up on port 3000");
});

// Enabling CORS
app.use(cors());

// Setting statis folder
app.use(express.static("public"));

// Setting socket.io server
const io = socket(server);

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


   // Sending message
   socket.on("send-message", (data) => {
      io.sockets.emit("send-message", data);
      new Message({
         author: data.data.author,
         message: data.data.msg
      }).save().then((msg_data) => {
         console.log("Message is sent successfully");
      }, (err) => {
         console.log("Error");
      });
   });
});