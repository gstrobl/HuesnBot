const path = require('path');
const nodeExternals = require('webpack-node-externals');

const config = () => {
  return {
    target: 'node',
    externals: [nodeExternals()],
    resolve: {
      extensions: ['.js', '.json', '.mjs'],
      modules: [path.resolve(__dirname, `./src`), 'node_modules'],
    },
    entry: './src',
    output: {
      path: path.resolve('./dist'),
      filename: 'server.js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
      ],
    },
  };
};

module.exports = config;
