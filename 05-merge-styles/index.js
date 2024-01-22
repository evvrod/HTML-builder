const fsp = require('node:fs/promises');
const fs = require('node:fs');

const path = require('node:path');
const dirPathStyles = path.join(__dirname, '/styles');
const dirPathTo = path.join(__dirname, '/project-dist');
const outputFile = path.join(dirPathTo, 'bundle.css');

mergeFiles(dirPathStyles, dirPathTo, outputFile);

async function mergeFiles(dirFrom, dirTo, fileTo) {
  try {
    let files = await findFiles(dirFrom);
    await copyToFile(fileTo, files);
  } catch (err) {
    console.log(err);
  }
}

async function findFiles(dirFrom) {
  try {
    return await fsp.readdir(dirFrom, { withFileTypes: true });
  } catch (err) {
    console.log(err);
  }
}

async function copyToFile(fileTo, files) {
  try {
    const output = fs.createWriteStream(fileTo, "utf-8");
    files.forEach(async (el) => {
      let file = path.join(el.path, el.name);
      if (path.extname(file) === '.css' && !el.isDirectory()) {
        const input = fs.createReadStream(file, "utf-8");
        input.pipe(output);
      }
    })
  } catch (err) {
    console.log(err);
  }
}