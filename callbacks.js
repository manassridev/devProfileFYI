const fs = require("node:fs");
// // timeout_vs_immediate.js

Promise.resolve("Promise resolved").then(console.log);
setTimeout(() => {
  console.log("timeout");
}, 0);

fs.readFile("./file.txt", "utf8", (err, data) => {
  console.log(`File Data read in async: ${data}`);
});

process.nextTick(() => console.log("nextTick"));
setImmediate(() => {
  console.log("immediate");
});

// timeout_vs_immediate.js
// const fs = require("node:fs");
// /**
//  * fs.readFile function starts from poll phase, and when it
//  * enters the poll phase it will see that file operations takes sometime and it will move ahead to check phase
//  * and encounters setImmediate() and created a callback queue for that and executes it first, then it will move
//  * ahead to timer phase and executes the seTimeout
//  */
// fs.readFile(__filename, () => {
//   setTimeout(() => {
//     console.log("timeout");
//   }, 0);
//   setImmediate(() => {
//     console.log("immediate");
//   });
// });
