const fs = require('node:fs/promises');

const path = require('node:path');
const dirPath = path.join(__dirname, '/secret-folder');

const { stat } = require('node:fs');

findFiles(dirPath);

async function getSize(pathFile) {
  try {
    const stats = await fs.stat(pathFile);
    return stats.size;
  } catch (err) {
    console.log(err);
  }
}

async function findFiles(pathDir) {
  try {
    const files = await fs.readdir(pathDir, { withFileTypes: true });
    files.forEach(async (el) => {
      let file = path.join(el.path, el.name);
      if (!el.isDirectory()) {
        let size = await getSize(file);
        process.stdout.write(`${el.name} - ${path.extname(file).slice(1)} - ${size}\n`);
        // console.log(`${el.name.slice(0,el.name.length-4)} - ${path.extname(file).slice(1)} - ${size}`)
      }
    })
  } catch (err) {
    console.log(err);
  }
}

