const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const filename = 'output.txt';

console.log('Введите текст:');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Прощайте!');
    rl.close();
  } else {
    fs.appendFile(filename, input + '\n', (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Текст успешно добавлен в файл', filename);
      }
    });
  }
});

rl.on('close', () => {
  console.log('Прощайте');
});