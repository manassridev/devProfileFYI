const express = require("express");
const app = express();
const port = 3200;

app.use("/", (req, res) => {
  res.send("Hello from the server");
});

app.use("/test", (req, res) => {
  res.send("You are on path of test !!!");
});

app.use("/hello", (req, res) => {
  res.send("You are on path of hello !!!");
});

app.listen(port, () => {
  console.log(`Server is successfully listening at port ${port}....`);
});
