const express = require("express");
const app = express();

app.use(express.static("./build"));

app.listen(3002, () => {
  console.log("listening 3002");
});