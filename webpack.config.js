const path = require('path')

module.exports = {
  // externals: [nodeExternals()],
  mode: "development",   
  entry: {
    background: "./src/background/background.js",
    tab: "./src/background/tab.js",
    popup: "./src/popup/app.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          presets: ['@babel/preset-env']
        },
        exclude: "/node_modules/"
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }
    ]
  }
}