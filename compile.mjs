import fs from 'fs';
import path from 'path';

const files = await fs.promises.readdir('./data', { withFileTypes: true });

const packageInfo = [];

const directories = files.filter(file => file.isDirectory());

for (const dir of directories) {
  const reportPath = path.join('./data', dir.name, 'packages');

  const gitInfoFilePath = path.join('./data', dir.name, 'git-info.json');
  const gitInfoDataRaw = await fs.promises.readFile(gitInfoFilePath, 'utf8');
  const gitInfoData = JSON.parse(gitInfoDataRaw);

  const subFiles = await fs.promises.readdir(reportPath, { withFileTypes: true });

  const subDirectories = subFiles.filter(subFile => subFile.isDirectory());

  const projectSummaries = await Promise.all(subDirectories.map(async (pkg) => {
    const reportFilePath = path.join(reportPath, pkg.name, 'report.json');
    const reportDataRaw = await fs.promises.readFile(reportFilePath, 'utf8');
    const reportData = JSON.parse(reportDataRaw);

    const summary = reportData.reduce((acc, item) => {
      return {
        name: pkg.name,
        statSize: acc.statSize + item.statSize,
        parsedSize: acc.parsedSize + item.parsedSize,
        gzipSize: acc.gzipSize + item.gzipSize,
      };
    }, {
      name: '',
      statSize: 0,
      parsedSize: 0,
      gzipSize: 0,
    });

    return summary;
  }));

  packageInfo.push({
    hash: gitInfoData.hash,
    commitTimestamp: gitInfoData.commitTimestamp,
    summary: projectSummaries,
  });
}

fs.promises.mkdir('generated', { recursive: true });
fs.promises.writeFile('generated/projects.json', JSON.stringify(packageInfo, null, 2));
