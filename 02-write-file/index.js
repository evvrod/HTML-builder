const path = require('node:path');
const dirPath = path.join(__dirname, '/text.txt');

let fs = require("node:fs");
const eol = require('os').EOL;

process.stdin.setEncoding('utf-8');

let writableStream = fs.createWriteStream(dirPath);

console.log('Write string');
process.stdin.on('data', (data) => {
  if (String(data).split(eol)[0] !== 'exit') {
    writableStream.write(String(data));
  } else {
    // writableStream.end(String(data).split(eol)[0]);
    writableStream.exit();
    process.exit();
  }
});

process.on("SIGINT", function () {
  console.log("\nexit");
  process.exit();
})