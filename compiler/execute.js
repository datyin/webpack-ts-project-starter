const chalk = require('chalk');
const yargs = require('yargs/yargs');
const { spawn } = require('child_process');
const { pathExistsSync } = require('fs-extra');
const { forEach } = require('lodash');
const { resolve, normalize } = require('path');
const { getEntry } = require('./helper');

const prefix = chalk`[{magenta Execute}]`;
const errorPrefix = chalk`[{red ERROR}]`;
const { argv } = yargs(process.argv);

let child = null;

function onInit(stats) {
  if (!stats || !stats.outputPath) {
    console.log('Failed to get stats.outputPath');
    return;
  }
  const entry = getEntry();

  let path = '';

  if (entry && pathExistsSync(`${stats.outputPath}/${entry}.js`)) {
    path = `${stats.outputPath}/${entry}.js`;
  }

  if (!path) {
    console.log(prefix, errorPrefix, 'Failed to find entry point to be executed!');
    return;
  }

  path = normalize(path);

  if (child) {
    console.log(prefix, chalk`Restarting script {greenBright.bold ${path}}`);
    child.stdin.pause();
    child.kill();
  } else {
    console.log(prefix, chalk`Starting script {greenBright.bold ${path}}`);
  }

  const arguments = [path];

  forEach(argv, (value, index) => {
    if (index !== '_' && index !== '$0') {
      arguments.push(`--${index}=${value}`);
    }
  });

  child = spawn(argv._[0], arguments, {
    cwd: resolve(__dirname, '..'),
    encoding: 'utf8'
  });

  child.stderr.on('data', (data) =>
    console.log(prefix, errorPrefix, chalk`{red ${data.toString()}}`)
  );

  child.stdout.on('data', (data) => console.log(prefix, data.toString()));
  child.on('close', (code) => console.log(prefix, `Process closed with code ${code}`));
}

module.exports = onInit;
