const path = require('path');

module.exports = function(env, argv) {
  return {
    mode: argv.mode,
    entry: path.resolve(__dirname, './src/index.ts'),
    output: {
      path: path.resolve(__dirname, './'),
      filename: argv.mode === 'production' ? './dist/one-node.umd.js' : './dist/one-node.development.umd.js',
      library: {
        name: 'OneNode',
        type: 'umd',
      },
    },
    externals: {},
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
      ],
    },
    target: 'web',
  };
};
