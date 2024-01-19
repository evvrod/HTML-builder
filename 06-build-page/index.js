const fsp = require('node:fs/promises');
const fs = require('node:fs');

const path = require('node:path');
const dirPathStyles = path.join(__dirname, '/styles');

const dirPathTo = path.join(__dirname, '/project-dist');
const outputFileHtml = path.join(dirPathTo, 'index.html');
const outputFileCss = path.join(dirPathTo, 'style.css');

const dirAssets = path.join(__dirname, '/assets');
const dirCss = path.join(__dirname, '/styles');
const dirHtml = path.join(__dirname, '/components');

buildPages(dirPathStyles, dirPathTo, dirAssets, outputFileHtml, outputFileCss);

async function buildPages(dirFrom, dirTo, dirAssets, fileHtml, fileCss) {
  await createDir(dirTo);
  await mergeFiles(dirCss, fileCss);

  // await copyFile(path.join(__dirname, 'template.html'), fileHtml);

  await changeBlockInFiles(dirHtml, fileHtml);

  copyDir(dirAssets, path.join(dirTo, 'assets'));
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

async function mergeFiles(dirFrom, fileTo) {
  let files = await findFiles(dirFrom);
  await copyToFile(fileTo, files);

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
}

async function copyDir(dirFrom, dirTo) {
  try {
    await createDir(dirTo);
    let files = await findFiles(dirFrom);

    files.forEach(async (el) => {
      let file = path.join(el.path, el.name);
      if (!el.isDirectory()) {
        copyFile(file, path.join(dirTo, el.name));
      } else {
        copyDir(path.join(el.path, el.name), path.join(dirTo, el.name));
      }
    })
  }
  catch (err) {
    console.log(err);
  }
}

async function copyFile(outputFile, inputFile) {
  try {
    await fsp.copyFile(outputFile, inputFile);
  } catch {
    console.error(err);
  }
}

async function findFiles(dirFrom) {
  try {
    return await fsp.readdir(dirFrom, { withFileTypes: true });
  } catch (err) {
    console.log(err);
  }
}

async function changeBlockInFiles(dirFrom, fileTo) {
  let files = await findFiles(dirFrom);
  await copyBlock(fileTo, files);
}

async function copyBlock(fileTo, files) {
  try {
    const input = fs.createReadStream(path.join(__dirname, 'template.html'), "utf-8");
    const output = fs.createWriteStream(fileTo, "utf-8");
    // for await (const chunk of input) {
    //   console.log('>>> '+ chunk);
    //   console.log('ffff')
    // }
    // input.forEach(async (el) => {
    //   console.log(el);
    //   console.log('fffff')
    // })

    const readInterface = readline.createInterface({
      input: fs.createReadStream('/path/to/file'),
      output: process.stdout,
      console: false
    });

    readInterface.on('line', function (line) {
      console.log(line);
    });


  } catch (err) {
    console.log(err);
  }
}
