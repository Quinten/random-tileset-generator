const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, '../pub'),
        publicPath: '',
        filename: 'project.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: [/\.vert$/, /\.frag$/],
                use: 'raw-loader'
            },
            {
                test: /\.(gif|png|jpe?g|svg|xml)$/i,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['pub'], {
            root: path.resolve(__dirname, '../')
        }),
        new CopyPlugin([
            { from: 'src/assets', to: 'assets' },
        ]),
        new webpack.DefinePlugin({
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true)
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
};
