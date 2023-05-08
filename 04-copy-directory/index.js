const fs = require('fs').promises;
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

async function copyDir(sourceDir, targetDir) {
  await fs.mkdir(targetDir, { recursive: true });

  const files = await fs.readdir(sourceDir);

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    const stat = await fs.lstat(sourcePath);

    if (stat.isDirectory()) {
      await copyDir(sourcePath, targetPath);
    } else {
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}

copyDir(sourceDir, targetDir)
  .then(() => console.log('Копирование выполнено'))
  .catch((err) => console.error(err));
