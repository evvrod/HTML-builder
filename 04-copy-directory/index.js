const fs = require('node:fs/promises');

const path = require('node:path');
const dirPathFrom = path.join(__dirname, '/files');
const dirPathTo = path.join(__dirname, '/files-copy');


createDir(dirPathTo);
findFiles(dirPathFrom, dirPathTo);

async function createDir() {
  try {
    await fs.mkdir(dirPathTo, { recursive: true });
  }
  catch (err) {
    console.log(err);
  }
}

async function findFiles(dirPathFrom, dirPathTo) {
  try {
    const files = await fs.readdir(dirPathFrom, { withFileTypes: true });
    files.forEach(async (el) => {
      let file = path.join(el.path, el.name);
      if (!el.isDirectory()) {
        copyFile(file, path.join(dirPathTo, el.name));
      }
    })
  } catch (err) {
    console.log(err);
  }
}

async function copyFile(fileFrom, fileTo) {
  try {
    await fs.copyFile(fileFrom, fileTo);
  } catch {
    console.error(err);
  }
}