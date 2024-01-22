const fsp = require('node:fs/promises');
const fs = require('node:fs');
const readline = require('node:readline');
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
  try {
    await createDir(dirTo);
    await mergeFiles(dirCss, fileCss);
    await changeBlockInFiles(dirHtml, fileHtml);
    copyDir(dirAssets, path.join(dirTo, 'assets'));
  } catch (err) {
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
  } catch (err) {
    console.log(err);
  }
}

async function copyFile(outputFile, inputFile) {
  try {
    await fsp.copyFile(outputFile, inputFile);
  } catch (err) {
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
  try {
    let files = await findFiles(dirFrom);
    await copyBlock(fileTo, files);
  } catch (err) {
    console.log(err);
  }
}

async function copyBlock(fileTo, files) {
  try {
    const input = fs.createReadStream(path.join(__dirname, 'template.html'), "utf-8");
    const output = fs.createWriteStream(fileTo, "utf-8");

    const readInterface = readline.createInterface({ input: input, });
    for await (const line of readInterface) {
      if (line.includes('{{')) {
        let str = '';
        let i = 0;
        let indentation = (/^\s*/).exec(line)[0].length;
        while (i < line.length) {
          if (line[i] === '{' && line[i + 1] === '{') {
            i += 2;
            let comp = line[i];
            while (line[i] !== '}' && line[i + 1] !== '}') {
              i += 1;
              comp += line[i];
            }
            let isCompExist = true;
            for (let j = 0; j < files.length; j += 1) {
              if (files[j].name === `${comp}.html`) {
                if (str.trim().length > 0) {
                  output.write(str + '\n');
                }
                await copyFileInFile(path.join(files[j].path, files[j].name), output, indentation);
                str = '';
                isCompExist = false;
                break;
              }
            }
            if (isCompExist) {
              output.write(' '.repeat(indentation) + `{{${comp}}}\n`);
            }
            i += 2;
          } else {
            str += line[i];
          }
          i += 1;
        }
        if (str.trim().length > 0) { output.write(' '.repeat(indentation) + str + '\n'); }
      }
      else {
        output.write(`${line}\n`);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function copyFileInFile(fileFrom, output, indentation) {
  try {
    const input = fs.createReadStream(fileFrom);
    const readInterface = readline.createInterface({ input: input, });
    for await (const line of readInterface) {
      output.write(' '.repeat(indentation) + line + '\n');
    }
  } catch (err) {
    console.error(err);
  }
}