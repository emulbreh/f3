var path = require('path');
var webpack = require('webpack');
var bourbon = require('bourbon');
var neat = require('bourbon-neat');

var scssIncludePaths = [].concat(bourbon.includePaths).concat(neat.includePaths);


module.exports = {
    entry: [
        'babel-polyfill',
        './src/f3-demo/index.js'
    ],
    output: {
        publicPath: '/',
        filename: './demo/demo.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                include: path.join(__dirname, 'src'),
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015', 'stage-0'],  
                }
            },
            {
                loader: 'style!css!sass?' + JSON.stringify({
                    includePaths: scssIncludePaths
                }),
                test: /\.scss$/
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
