const fs = require("node:fs");
const path = require('node:path');
const fileTo = path.join(__dirname, '/text.txt');

const eol = require('os').EOL;

let output = fs.createWriteStream(fileTo, 'utf-8');

console.log('Write string');

process.stdin.on('data', (data) => {
  if (String(data).split(eol)[0] !== 'exit') {
    output.write(String(data));
  } else {
    process.exit();
  }
});

process.on("SIGINT", function () {
  console.log("\nexit");
  process.exit();
})