import { globby } from 'globby';
import fs from 'fs/promises';
import path from 'path';
import { mkdir, copyFile } from 'fs/promises';

async function copyFiles(source, destination) {
  const files = await globby(source);
  for (const file of files) {
    const dest = file.replace('deriv-app', 'dist');
    await mkdir(path.dirname(dest), { recursive: true });
    await copyFile(file, dest);
  }
}

async function compile() {
  try {
    await fs.rm('./dist', { recursive: true, force: true });
    await mkdir('./dist', { recursive: true });
    await copyFile('./deriv-app/analyze.html', './dist/index.html');
    await copyFiles('./deriv-app/packages/*/stats.json', './dist/packages/*/stats.json')
    await copyFiles('./deriv-app/packages/*/report.json', './dist/packages/*/report.json')
    await copyFiles('./deriv-app/packages/*/analyzed.html', './dist/packages/*/analyzed.html')
  } catch (error) {
    console.error('Error during compilation:', error);
  }
}

compile();
