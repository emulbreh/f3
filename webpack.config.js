var path = require('path');
var webpack = require('webpack');
var bourbon = require('bourbon');
var neat = require('bourbon-neat');

var scssIncludePaths = [].concat(bourbon.includePaths).concat(neat.includePaths);


module.exports = {
    entry: {
        demo: [
            'babel-polyfill',
            './src/f3-demo/index.js'
        ]
    },
    output: {
        publicPath: '/',
        filename: './demo/[name].js'
    },
    devtool: 'source-map',
    devServer: {
        host: 'localhost',
        port: 8333,
        historyApiFallback: true,
        contentBase: 'demo'
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                include: path.join(__dirname, 'src'),
                query: {
                    plugins: [
                        'transform-runtime',
                        'transform-strict-mode'
                    ],
                    presets: [
                        'es2015',
                        'stage-0'
                    ],
                }
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass?' + JSON.stringify({
                    includePaths: scssIncludePaths
                })
            }
        ]
    },
    resolve: {
        root: [
            path.resolve('src')
        ]
    },
    debug: true
};
