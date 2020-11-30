const webpack = require('webpack');
const execute = require('./compiler/execute');
const webpack_config = require('./compiler/webpack.js');
const package_config = require('./compiler/package.js');

webpack(webpack_config(), (err, stats) => {
  if (err) {
    console.error(err);
    return;
  }

  const statsInfo = stats.toJson();

  console.log(
    stats.toString({
      chunks: false,
      colors: true
    })
  );

  package_config();
  execute(statsInfo);
});
