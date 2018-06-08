const express = require("express");
const socket = require("socket.io");

const app = express();
const server = app.listen(3000, () => {
   console.log("Started up on port 3000");
});

app.use(express.static("public"));

const io = socket(server);
io.on("connection", (socket) => {
   console.log("Sockets are working");
})