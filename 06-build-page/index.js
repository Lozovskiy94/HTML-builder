const fs = require('fs').promises;
const path = require('path');
const sourceDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const distDir = path.join(__dirname, 'project-dist');

async function replaceTemplateTags(template, componentData) {
let result = template;
for (const [tag, content] of componentData.entries()) {
result = result.replace(tag, content);
}
return result;
}

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

async function buildPage() {
try {
const distExists = await fs.stat(distDir).catch(() => false);

if (!distExists) {
  await fs.mkdir(distDir);
}

const assetsExists = await fs.stat(path.join(distDir, 'assets')).catch(() => false);

if (!assetsExists) {
  await fs.mkdir(path.join(distDir, 'assets'));
}

const templatePath = path.join(__dirname, 'template.html');
const template = await fs.readFile(templatePath, 'utf-8');
const files = await fs.readdir(sourceDir);
const componentData = new Map();

for (const file of files) {
  const filePath = path.join(sourceDir, file);
  const stats = await fs.stat(filePath);

  if (stats.isFile() && path.extname(file) === '.html') {
    const componentName = path.basename(file, '.html');
    const componentContent = await fs.readFile(filePath, 'utf-8');
    componentData.set(`{{${componentName}}}`, componentContent);
  }
}

const indexContent = await replaceTemplateTags(template, componentData);
await fs.writeFile(path.join(distDir, 'index.html'), indexContent);
const styles = await fs.readdir(stylesDir);
let styleContent = '';

for (const style of styles) {
  const stylePath = path.join(stylesDir, style);
  const stats = await fs.stat(stylePath);

  if (stats.isFile() && path.extname(style) === '.css') {
    const styleContentPart = await fs.readFile(stylePath, 'utf-8');
    styleContent += styleContentPart;
  }
}

await fs.writeFile(path.join(distDir, 'style.css'), styleContent);
await copyDir(assetsDir, path.join(distDir, 'assets'));

console.log('Страница построена успешно');
} catch (err) {
console.error('Произошла ошибка:', err);
}
}

buildPage();