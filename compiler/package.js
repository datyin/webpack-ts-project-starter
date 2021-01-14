const chalk = require('chalk');
const yargs = require('yargs/yargs');
const { clone, isArray, forEach, get, isPlainObject } = require('lodash');
const { writeJsonSync } = require('fs-extra');

const { argv } = yargs(process.argv);

function onInit(stats) {
  if (argv.dev || !isPlainObject(stats)) {
    return;
  }

  const package = require(`../package.json`);
  const newPackage = clone(package);

  if (newPackage.devDependencies) {
    delete newPackage.devDependencies;
  }

  if (newPackage.scripts) {
    delete newPackage.scripts;
  }

  newPackage.dependencies = {};

  if (isArray(stats.modules)) {
    forEach(stats.modules, (mod) => {
      const identifier = get(mod, 'identifier', '');

      if (!identifier.startsWith('external ')) {
        return;
      }

      const name = identifier.match(/(?<=^external ")(.*?)(?=")/g);

      if (!name || !name[0]) {
        return;
      }

      if (package.dependencies && package.dependencies[name]) {
        newPackage.dependencies[name] = package.dependencies[name];
      } else if (package.devDependencies && package.devDependencies[name]) {
        newPackage.dependencies[name] = package.devDependencies[name];
      }
    });
  }

  if (stats.outputPath) {
    try {
      writeJsonSync(`${stats.outputPath}/package.json`, newPackage, {
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
