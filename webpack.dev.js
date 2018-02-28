var path = require('path');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

var ROOT_PATH = path.resolve(__dirname);
// var BUILD_PATH = path.resolve(ROOT_PATH, 'build');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');
var APP_PATH = path.resolve(ROOT_PATH, 'app');
// var COMPS_PATH = path.resolve(ROOT_PATH, 'components');

module.exports = {
  entry: {
    app: [
      'react-hot-loader/patch', 'webpack-dev-server/client?http://localhost:8080', 'webpack/hot/only-dev-server', path.resolve(APP_PATH, 'app.js')
    ],
  },
  output: {
    path: BUILD_PATH,
    publicPath: '/',
    // filename: 'bundle.[hash].js',
    filename: '[name].js',
    //chunkFilename: '[name].[chunkhash:6].child.js',
  },
  node: {
    fs: 'empty'
  },
  devtool: 'eval-source-map',
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    headers: {
      "X-Real-IP": '192.168.3.53'
    },
    proxy: [{
      context: ["/visp", "/Interface", "/fileupload"],
      target: "http://172.21.167.1:8089",
      // target: "http://120.25.160.222:8081",
    }, {
      context: ["/test"],
      target: "http://127.0.0.1:3000",
    }, {
      context: ["/Ota2/api/v1/devinfo"],
      target: "http://172.21.167.1:8089",
    }, {
      context: ["/Ota2/api/v2/devinfo", '/Ota2'],
      target: "http://127.0.0.1:3000",
    }],
    // proxy: {
    //   "/visp": {
    //     target: "http://172.21.167.1:8089",
    //     // target: "http://192.168.3.222:8080",
    //     // pathRewrite: {"^/*" : ""}
    //   },
    //   "/Interface": {
    //     target: "http://172.21.167.1:8089",
    //     // target: "http://192.168.3.218:8091",
    //   },
    //   "/Ota2": {
    //     // target: "http://120.24.153.202:8080",
    //     // target: "http://192.168.3.220:8080",
    //     target: "http://172.21.167.1:8089",
    //   },
    //   "/fileupload": {
    //     // target: "http://120.77.62.245:10000",
    //     target: "http://172.21.167.1:8089",
    //   },
    // }
  },
  resolve: {
    modules: [
      APP_PATH,
      'node_modules'
    ],
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [{
        test: /\.jsx?$/,
        use: ['babel-loader'],
        include: APP_PATH
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // { test: /\.(png|svg|jpg|gif)$/, use: ['url-loader'] }
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlwebpackPlugin({
      template: './app/index.html'
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: 'dist/bundle.dll.js',
      append: false
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      /**
       * 在这里引入 manifest 文件
       */
      manifest: require('./dist/bundle-manifest.json')
    })
  ]
}