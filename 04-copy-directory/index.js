const fsp = require('node:fs/promises');

const path = require('node:path');
const dirPathFrom = path.join(__dirname, '/files');
const dirPathTo = path.join(__dirname, '/files-copy');

copyDir(dirPathFrom, dirPathTo);

async function copyDir(dirFrom, dirTo) {
  try {
    await createDir(dirTo);
    let files = await findFiles(dirFrom);
    await copyFile(files, dirTo);
  }
  catch (err) {
    console.log(err);
  }
}

async function createDir(dirTo) {
  try {
    try {
      await fsp.access(dirTo);
      await fsp.rm(dirTo, { recursive: true, });
      await fsp.mkdir(dirTo, { recursive: true, });
    } catch {
      await fsp.mkdir(dirTo, { recursive: true, });
    }
  }
  catch (err) {
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

async function copyFile(files, dirTo) {
  try {
    files.forEach(async (el) => {
      let file = path.join(el.path, el.name);
      if (!el.isDirectory()) {
        await fsp.copyFile(file, path.join(dirTo, el.name));
      }
    })
  } catch {
    console.error(err);
  }
}