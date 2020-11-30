const yargs = require('yargs/yargs');
const { basename, resolve } = require('path');
const { trim } = require('lodash');
const { pathExistsSync } = require('fs-extra');

const { argv } = yargs(process.argv);
const rootDir = resolve(__dirname, '..').replace(/\\/g, '/');
const srcDir = `${rootDir}/src`;

function getEntry(configs = undefined) {
  const entry = basename(trim(argv.entry), '.js');

  if (pathExistsSync(`${srcDir}/${entry}.ts`)) {
    return entry;
  } else if (pathExistsSync(`${srcDir}/index.ts`)) {
    return `index`;
  } else if (pathExistsSync(`${srcDir}/main.ts`)) {
    return `main`;
  } else if (pathExistsSync(`${srcDir}/app.ts`)) {
    return `app`;
  } else if (configs) {
    const firstFound = Object.keys(configs);

    if (firstFound && firstFound[0] && pathExistsSync(`${srcDir}/${firstFound}.ts`)) {
      return `${firstFound}`;
    }
  }

  return '';
}

module.exports.getEntry = getEntry;
