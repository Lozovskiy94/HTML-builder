const fs = require('fs').promises;
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

async function copyDir(sourceDir, targetDir) {
  try {
    await fs.mkdir(targetDir, { recursive: true });

    const sourceFiles = await fs.readdir(sourceDir);
    const targetFiles = await fs.readdir(targetDir);

    for (const file of targetFiles) {
      if (!sourceFiles.includes(file)) {
        const filePath = path.join(targetDir, file);
        await fs.unlink(filePath);
      }
    }
    for (const file of sourceFiles) {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);

      const sourceStat = await fs.stat(sourcePath);
      const targetStat = await fs.stat(targetPath).catch(() => null);

      if (sourceStat.isDirectory()) {
        await copyDir(sourcePath, targetPath);
      } else if (!targetStat || sourceStat.mtimeMs > targetStat.mtimeMs) {
        await fs.copyFile(sourcePath, targetPath);
      }
    }
    console.log('Копирование выполнено');
  } catch (err) {
    console.error('Произошла ошибка:', err);
  }
}

copyDir(sourceDir, targetDir);
