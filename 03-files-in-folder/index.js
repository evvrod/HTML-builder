const fsp = require('node:fs/promises');

const path = require('node:path');
const dirPath = path.join(__dirname, '/secret-folder');

writeInfoFile(dirPath);

async function getSize(pathFile) {
  try {
    const stats = await fsp.stat(pathFile);
    return stats.size;
  } catch (err) {
    console.log(err);
  }
}

async function writeInfoFile(dirFrom) {
  try {
    const files = await findFiles(dirFrom);
    files.forEach(async (el) => {
      let file = path.join(el.path, el.name);
      if (!el.isDirectory()) {
        let size = await getSize(file) ;
        process.stdout.write(`${el.name.replace(path.extname(file), '')} - ${path.extname(file).replace('.', '')} - ${size}\n`);
      }
    })
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

