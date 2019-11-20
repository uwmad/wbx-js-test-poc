const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: true
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    }
                ],
            }
        ]
    },
    devServer: {
        //contentBase: '../src/main/resources/static',
        contentBase: path.join(__dirname, '..', 'public'),
        historyApiFallback: true,
        publicPath: '/dist/',
        hot: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8080/autoplanner-api'
            }
        }
    }
});
