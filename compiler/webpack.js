const chalk = require('chalk');
const yargs = require('yargs/yargs');
const node_modules = require('webpack-node-externals');
const { sync } = require('fast-glob');
const { resolve, basename } = require('path');
const { forEach } = require('lodash');
const { getEntry } = require('./helper');

const { argv } = yargs(process.argv);
const rootDir = resolve(__dirname, '..').replace(/\\/g, '/');

const webpack = require(`${rootDir}/webpack.config.js`);
const configs = {};

function loadConfigs() {
  sync(`${rootDir}/src/*.webpack.js`).forEach((entry) => {
    try {
      const name = basename(entry, '.webpack.js');
      configs[name] = require(entry);
    } catch (error) {
      console.log(chalk`{redBright Failed} to load '{greenBright ${entry}}'`);
    }
  });
}

function onInit() {
  loadConfigs();

  if (!webpack.target || !webpack.target.startsWith('node')) {
    const nodeVersion = process.version.match(/^v(\d+\.\d+)/)[1];
    webpack.target = `node${nodeVersion}`;
  }

  webpack.mode = argv.dev ? 'development' : 'production';
  webpack.externals = [node_modules()];
  webpack.node = {
    global: false,
    __filename: false,
    __dirname: false
  };

  if (argv.dev) {
    const entry = getEntry(configs);

    if (entry && configs[entry] && configs[entry].entry) {
      webpack.entry = configs[entry].entry;
    }
  } else {
    const entries = {};

    forEach(configs, (config) => {
      if (config.entry) {
        forEach(config.entry, (entryPath, entry) => {
          entries[entry] = entryPath;
        });
      }
    });

    webpack.entry = entries;
  }

  console.log(chalk`Compiler target: {greenBright ${webpack.target}}`);
  return webpack;
}

module.exports = onInit;
