var path = require('path');
var webpack = require('webpack');
var bourbon = require('bourbon');
var neat = require('bourbon-neat');
var process = require('process');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var scssIncludePaths = [].concat(bourbon.includePaths).concat(neat.includePaths);
scssIncludePaths.push(path.join(__dirname, 'node_modules/uikit/dist/scss'));

var minify = true;
var projectName = 'f3-demo';
var buildDir = 'demo';

module.exports = {
    entry: {
        demo: [
            './src/f3-demo/index.js'
        ]
    },
    output: {
        publicPath: '/',
        path: buildDir,
        filename: `${projectName}${minify ? '.min' : ''}.js`
    },
    devtool: 'source-map',
    devServer: {
        host: 'localhost',
        port: 8333,
        historyApiFallback: true,
        contentBase: 'demo'
    },
    plugins: [
        new ExtractTextPlugin(`${projectName}.css`),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                toplevel: false,
                props: false,
                keep_fnames: true
            },
            compress: {
                warnings: false,
                unused: true,
                dead_code: true
            }
        })
    ],
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
                loader: ExtractTextPlugin.extract('style', 'css!sass?' + JSON.stringify({
                    includePaths: scssIncludePaths
                }))
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'file?name=fonts/[name].[ext]'
            },
            {
                test: /\.(svg|png)$/,
                loader: 'file?name=[name].[ext]'
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
