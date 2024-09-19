// CJS modules: Executed in synchronous fashion
const https = require("https");
const fs = require("fs");

console.log("<<<<<PROGRAM BEGINS>>>>>");

var a = 1000000;
var b = 2000000;
const c = multiply(a, b);
console.log(c);

https.get("https://dummyjson.com/products", (res) => {
  console.log("Data Fetched Successfully");
});

// Async function: Offloads to libuv.
fs.readFile("./file.txt", "utf8", (err, data) => {
  console.log(`File Data read in async: ${data}`);
});

// readFileSync blocks the main thread (blocking I/O function);
console.log(`File Data read in Sync: ${fs.readFileSync("./file.txt", "utf8")}`);

// Async function: Offloads to libuv.
setTimeout(() => {
  console.log("Execute Immediately 1");
}, 0);

function multiply(a, b) {
  return a * b;
}

// Async function: Offloads to libuv.
setTimeout(() => {
  console.log("Executed after 2 sec");
  console.log("<<<<<PROGRAM ENDS>>>>>");
}, 2000);
