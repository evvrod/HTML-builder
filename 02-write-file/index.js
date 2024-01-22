const fs = require("node:fs");
const path = require('node:path');
const fileTo = path.join(__dirname, '/text.txt');

const eol = require('os').EOL;

let output = fs.createWriteStream(fileTo, 'utf-8');

console.log('Please, enter text');

process.stdin.on('data', (data) => {
  if (String(data).split(eol)[0].trim() !== 'exit') {
    output.write(String(data));
  } else {
    process.stdout.write("\nGoodbye");
    process.exit();
  }
});

process.on("SIGINT", function () {
  process.stdout.write("\nGoodbye");
  process.exit();
})