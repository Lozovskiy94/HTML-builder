const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      if (stats.isFile()) {
        const fileSizeInBytes = stats.size;
        const fileSizeInKB = Math.round(fileSizeInBytes / 1024);
        const fileExtension = path.extname(file).slice(1);
        console.log(`${file}-${fileSizeInKB}kb`);
      }
    });
  });
});