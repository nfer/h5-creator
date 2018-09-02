module.exports = {
  mode: 'production',
  entry: {
    edit: './client/js/edit.js',
  },
  output: {
    path: `${__dirname}/output/client/js/`,
    filename: '[name].js',
    sourceMapFilename: 'debugging/[file].map',
  },
  externals: {
    jquery: 'jQuery',
    $: 'jQuery',
  },
  devtool: 'source-map',
};
