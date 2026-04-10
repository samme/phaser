'use strict';

const webpack = require('webpack');
const exec = require('child_process').exec;

const flags = {
    "typeof CANVAS_RENDERER": JSON.stringify(false),
    "typeof WEBGL_RENDERER": JSON.stringify(false),
    "typeof WEBGL_DEBUG": JSON.stringify(false),
    "typeof EXPERIMENTAL": JSON.stringify(false),
    "typeof FEATURE_SOUND": JSON.stringify(true),
    "typeof CSS_DEBUG": JSON.stringify(false),
};

console.log(flags);

module.exports = [

    {
        mode: 'development',

        context: `${__dirname}/../src/`,

        entry: {
            phaser: './phaser.js'
        },

        devtool: 'source-map',

        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.html$/,
                    type: 'asset/source'
                },
                {
                    test: /\.svg$/,
                    type: 'asset/source'
                },
                {
                    test: /\.xml$/,
                    type: 'asset/source'
                }
            ]
        },

        output: {
            path: `${__dirname}/../build/`,
            globalObject: 'this',
            sourceMapFilename: '[file].map',
            devtoolModuleFilenameTemplate: 'webpack:///[resource-path]', // string
            devtoolFallbackModuleFilenameTemplate: 'webpack:///[resource-path]?[hash]', // string
            filename: '[name].js',
            library: {
                name: 'Phaser',
                type: 'umd',
                umdNamedDefine: true,
            }
        },

        performance: { hints: false },

        plugins: [
            new webpack.DefinePlugin(flags),
            {
                apply: (compiler) => {
                    compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
                        exec('node scripts/copy-to-examples-watch.js', (err, stdout, stderr) => {
                            if (stdout) process.stdout.write(stdout);
                            if (stderr) process.stderr.write(stderr);
                        });
                    });
                }
            }
        ],

        devtool: 'source-map'
    }
];
