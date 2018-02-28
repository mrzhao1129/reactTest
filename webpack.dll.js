const webpack = require('webpack');
const path = require('path');

const ROOT_PATH = path.resolve(__dirname);
const BUILD_PATH = path.resolve(ROOT_PATH, 'build');

module.exports = {
    entry: {
        bundle: [
            'react',
            'react-dom',
            'antd',
            'axios',
            'redux',
            'react-redux',
            'redux-thunk',
            'react-router',
            'react-router-dom',
            'moment',
            'mockjs',
            'echarts',
            'core-js',
            'rc-calendar',
            'elliptic',
            'zrender',
            'bn.js',
            'rc-table',
            'rc-menu',
            'rc-select',
            'rc-tree',
            'asn1.js',
            'buffer',
            'rc-form',
            'rc-tabs',
            'hash.js',
            'browserify-aes',
            'readable-stream',
        ],
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].dll.js',
        /**
         * output.library
         * 将会定义为 window.${output.library}
         * 在这次的例子中，将会定义为`window.vendor_library`
         */
        library: '[name]_library'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, 'dist', '[name]-manifest.json'),
            name: '[name]_library',
        })
    ]
};
