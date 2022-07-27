const path = require('path');

module.exports = function(env, argv) {
  return {
    mode: argv.mode,
    entry: path.resolve(__dirname, './src/index.ts'),
    output: {
      path: path.resolve(__dirname, './'),
      filename: argv.mode === 'production' ? './dist/glue-node.umd.js' : './dist/glue-node.development.umd.js',
      library: {
        name: 'GlueNode',
        type: 'umd',
        export: 'default',
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
