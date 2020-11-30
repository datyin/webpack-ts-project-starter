const chalk = require('chalk');
const yargs = require('yargs/yargs');
const { clone } = require('lodash');
const { writeJsonSync } = require('fs-extra');

const { argv } = yargs(process.argv);

function onInit(stats) {
  if (argv.dev) {
    return;
  }

  const package = require(`../package.json`);
  const cleanPackage = clone(package);

  if (cleanPackage.devDependencies) {
    delete cleanPackage.devDependencies;
  }

  if (cleanPackage.scripts) {
    delete cleanPackage.scripts;
  }

  cleanPackage.dependencies = {};

  if (stats && Array.isArray(stats.modules)) {
    const externals = stats.modules
      .filter((m) => m.identifier && m.identifier.startsWith('external '))
      .map((m) => m.name.replace('external ', '').replace(/"/g, ''));

    externals.forEach((p) => {
      if (package.dependencies && package.dependencies[p]) {
        cleanPackage.dependencies[p] = package.dependencies[p];
      } else if (package.devDependencies && package.devDependencies[p]) {
        cleanPackage.dependencies[p] = package.devDependencies[p];
      }
    });
  }

  if (stats && stats.outputPath) {
    try {
      writeJsonSync(`${stats.outputPath}/package.json`, cleanPackage, {
        spaces: 2,
        encoding: 'utf8'
      });
    } catch (error) {
      console.log(chalk`{redBright Failed} to write package.json. {redBright ${error.message}}`);
    }
  } else {
    console.log(chalk`{redBright Failed} to get stats.outputPath`);
  }
}

module.exports = onInit;
