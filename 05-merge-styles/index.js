const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(distDir, 'bundle.css');

async function mergeStyles() {
  try {
    const files = await fs.promises.readdir(stylesDir);
    await fs.promises.mkdir(distDir, { recursive: true });
    await fs.promises.writeFile(outputFile, '');

    for (const file of files) {
      const filePath = path.join(stylesDir, file);
      const fileStats = await fs.promises.stat(filePath);

      if (fileStats.isFile() && path.extname(file) === '.css') {
        const fileContent = await fs.promises.readFile(filePath, 'utf-8');
        await fs.promises.appendFile(outputFile, fileContent, 'utf-8');
      }
    }

    console.log('Сборка стилей выполнена.');
  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
}

mergeStyles();