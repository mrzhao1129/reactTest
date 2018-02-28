var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
// var BUILD_PATH = path.resolve(ROOT_PATH, 'build');
var BUILD_PATH = path.resolve('F:/nginx-1.12.0/html/my-react');
// var BUILD_PATH = path.resolve('172.21.167.1/C:/nginx-1.12.0/html/my-react');
var APP_PATH = path.resolve(ROOT_PATH, 'app');
// var COMPS_PATH = path.resolve(ROOT_PATH, 'components');
var STATIC_PATH = path.resolve(ROOT_PATH, 'static');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var InlineManifestWebpackPlugin = require("inline-manifest-webpack-plugin");

module.exports = {
  entry: {
    app: [
      // 'react-hot-loader/patch',
      // ,'babel-polyfill',
      // 'webpack-dev-server/client?http://localhost:8080',
      // 'webpack/hot/only-dev-server',
      path.resolve(APP_PATH, 'app.js')
    ],
    // commons: ['react', 'react-dom', 'react-router', 'antd', 'moment'],
  },
  output: {
    path: BUILD_PATH,
    publicPath: '/',
    // filename: 'bundle.[hash].js',
    filename: '[name].[chunkhash:6].js',
    chunkFilename: '[name].[chunkhash:6].child.js',
  },
  devtool: 'source-map',
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
      // { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', 'less-loader']
        })
      },
      // { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader']
        })
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        // use: ['url-loader']
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      // filename: 'vendor.js',
      minChunks: function (module) {
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: "manifest",
    //     filename: "webpackManifest.js",
    // }),
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NamedModulesPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: true,
        // drop_console: true
      }
    }),
    new BundleAnalyzerPlugin(),
    new HtmlwebpackPlugin({
      template: './app/index.html'
    }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash:6].css',
      allChunks: true
    }),
    // new InlineManifestWebpackPlugin,
  ]
}

var BUILD_STATIC_PATH = path.resolve(BUILD_PATH, 'static');
fs.readdir(STATIC_PATH, (err, files) => {
  if (err) throw err;
  fs.existsSync(BUILD_STATIC_PATH) 
    ? ''
    : fs.mkdirSync(BUILD_STATIC_PATH);
  for(var file of files) {
    // console.log(fs.statSync(path.resolve(STATIC_PATH, file)).isDirectory());
    fs.copyFileSync(path.resolve(STATIC_PATH, file), path.resolve(BUILD_STATIC_PATH, file))
  }
});