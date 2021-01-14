const path = require('path');
const node_modules = require('webpack-node-externals');

module.exports = {
  target: 'node12.19',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  watchOptions: {
    aggregateTimeout: 200,
    ignored: ['node_modules/**', 'compiler.js']
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  externals: [node_modules()],
  node: {
    global: false,
    __filename: false,
    __dirname: false
  }
};
