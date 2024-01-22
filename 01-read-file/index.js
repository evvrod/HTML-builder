const fs = require("node:fs");
const path = require('node:path');
const fileFrom = path.join(__dirname, '/text.txt');


fromFileToConsole(fileFrom);

function fromFileToConsole(fileFrom) {
  try {
    let readerStream = fs.createReadStream(fileFrom, "utf-8");
    readerStream.pipe(process.stdout);
  } catch (err) {
    console.log(err);
  }
}

// let data = '';
// let readerStream = fs.createReadStream(fileFrom, "utf-8");

// readerStream.on('data', function (chunk) {
//   data += chunk;
// });

// readerStream.on('end', function () {
//   console.log(data);
// });