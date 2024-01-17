const path = require('node:path');
const dirPath = path.join(__dirname, '/text.txt');

var fs = require("node:fs");
var data = '';

var readerStream = fs.createReadStream(dirPath); 
readerStream.setEncoding('UTF8');

readerStream.on('data', function (chunk) {
  data += chunk;
});

readerStream.on('end', function () {
  console.log(data);
});