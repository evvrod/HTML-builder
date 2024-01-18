const fsp = require('node:fs/promises');
const fs = require('node:fs');

const path = require('node:path');
const dirPathStyles = path.join(__dirname, '/styles');
const dirPathTo = path.join(__dirname, '/project-dist');
const outputFile = path.join(dirPathTo, 'bundle.css');


createDir(dirPathTo);
findFiles(dirPathStyles);

async function createDir(dirPathTo) {
  try {
    await fsp.mkdir(dirPathTo, { recursive: true });
  }
  catch (err) {
    console.log(err);
  }
}

async function findFiles(dirPathFrom) {
  try {
    const files = await fsp.readdir(dirPathFrom, { withFileTypes: true });
    const output = fs.createWriteStream(outputFile);
    files.forEach(async (el) => {
      let file = path.join(el.path, el.name);
      if (path.extname(file) === '.css') {
        copyToFile(file, output);
      }
    })
  } catch (err) {
    console.log(err);
  }
}

async function copyToFile(file, output) {
  try {
    const input = fs.createReadStream(file, "utf-8");
    for await (const chunk of input) {
      input.pipe(output);
    }


    // input.on('open', function () {
    //   input.pipe(res);
    // });

    // console.log(input);
    // console.log(output);
    // input.pipe(output);
  } catch (err) {
    console.log(err);
  }
}



// async function readFile(filename) {
//   let records = []
//   return new Promise(resolve => {
//       fs.createReadStream(filename)
//           .on("data", (data) => {
//               records.push(data);
//           })
//           .on("end", () => {
//               resolve(records)
//           });
//   })
// }