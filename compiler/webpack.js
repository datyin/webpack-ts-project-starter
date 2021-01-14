const cp = require('chalk');
const fg = require('fast-glob');
const yargs = require('yargs/yargs');
const { resolve, basename } = require('path');
const { isPlainObject, get, set, defaultsDeep } = require('lodash');

let webpack_config = require('../webpack.config');

const { argv } = yargs(process.argv);
const distDir = resolve(__dirname, '..', 'dist').replace(/\\/g, '/');
const srcDir = resolve(__dirname, '..', 'src').replace(/\\/g, '/');

function generate() {
  if (!isPlainObject(webpack_config)) {
    console.log(cp`{redBright Failed} to load webpack.config!`);
    process.exit(1);
  }

  // Target must be node
  const target = get(webpack_config, 'target', 'node').toLowerCase();

  if (typeof target === 'string' && !target.startsWith('node')) {
    set(webpack_config, 'target', 'node');
  }

  const entry = get(argv, 'entry', '').toLowerCase();
  let fromMultipleEntries = false;

  fg.sync(`${srcDir}/*.webpack.js`).forEach((config) => {
    const name = basename(config, '.webpack.js').toLowerCase();

    if (entry) {
      if (entry === name) {
        const customConfig = require(config);
        webpack_config = defaultsDeep(customConfig, webpack_config);
      }
    } else {
      // if no entry is provided load all configs
      const customConfig = require(config);
      webpack_config = defaultsDeep(customConfig, webpack_config);

      fromMultipleEntries = true;
    }
  });

  // Watch mode is determinated by argv
  set(webpack_config, 'mode', argv.dev ? 'development' : 'production');
  set(webpack_config, 'watch', argv.dev ? true : false);
  set(webpack_config, 'output.filename', '[name].js');
  set(webpack_config, 'output.libraryTarget', 'commonjs2');

  // Output
  if (fromMultipleEntries) {
    set(webpack_config, 'output.path', distDir);
  }

  return webpack_config;
}

module.exports = generate;
