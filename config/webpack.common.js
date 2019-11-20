const path = require('path');

module.exports = {
    entry: ['@babel/polyfill',path.join(__dirname, '../src/App.js')],
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, '..', 'public','dist'),
    },
    module: {
        rules: [

    /*   {
                enforce: 'pre',
                test: /\.(js|jsx)$/,
                exclude: {
                        and: [
                            /node_modules/,
                            /public/,
                            /target/,
                            /src/,
                            /webix/,
                        ]
                },
                loader: 'eslint-loader',
        },*/

        {
            test: /\.(js|jsx)$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [ '@babel/react', '@babel/env'],
                    plugins : [
                        '@babel/plugin-proposal-class-properties'
                    ]
                }
            },
            exclude: /node_modules/
        }

        ]
    },
    resolve: {
        extensions: [ '.js', '.jsx' ]
    }
};
