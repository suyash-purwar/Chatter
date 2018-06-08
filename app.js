const express = require("express");
const path = require("path");

const app = express();
const server = app.listen(3000, () => {
   console.log("Started up on port 3000");
});

app.use(express.static("public"));