const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './main.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  mode: 'production',
    plugins: [
    new Dotenv({ path: './.env.prod' })
  ]
};