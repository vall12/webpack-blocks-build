const path = require("path");
const glob = require('glob');
const {print} = require('q-i');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const AfterBuildPlugin = require('./src/Lib/AfterBuildPlugin');


// const webpack = require('webpack');
const {
    createConfig,
    match,
    when,
    addPlugins,
    setEnv,
    entryPoint,
    env,
    setOutput,
    setDevTool,
    setMode
} = require('@webpack-blocks/webpack');
const {css, file, url} = require('@webpack-blocks/assets');
const uglify = require('@webpack-blocks/uglify');
const babel = require('@webpack-blocks/babel');
const devServer = require('@webpack-blocks/dev-server')
const html = require('./src/Lib/custom_webpack_blocks/html');
const phpServer = require('./src/Lib/custom_webpack_blocks/phpServer');
const sassify = require('./src/Lib/custom_webpack_blocks/sassify');
const splitChunks = require('./src/Lib/custom_webpack_blocks/splitChunks');
const jsTerserMinify = require('./src/Lib/custom_webpack_blocks/jsTerserMinify');
const cacheLoader = require('./src/Lib/custom_webpack_blocks/cacheLoader');

const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const wp = require('./src/constants/env_const');
const php = require('./src/constants/php_const');


const config = createConfig([
    setMode(process.env.NODE_ENV || 'development'),
    setEnv({
        NODE_ENV: process.env.NODE_ENV || "production"  //defines some constants
    }),
    entryPoint({
        home: './src/index.js',
    }),
    setOutput('./dist/[name].js'),

    /** HTML/PHP  */
    html({
        filename: "index.html",
        template: path.resolve(process.cwd(), 'src/index.html'),
    }),

    /** CSS/SCSS autoprefixer cssnano if production environment  */
    match([/\.(sa|sc|c)ss$/, '!*node_modules*'], [
        sassify({}, {}, {}, {
            plugins: [
                autoprefixer({overrideBrowserslist: ['defaults', '> 1%', 'last 4 versions']}),
                env("production", [cssnano()]),
            ],
        }),
        cacheLoader(),
    ]),

    /** FONTS */  // will copy font files to build directory and link to them
    match(['*/fonts/*.svg', '*/fonts/*.eot', '*/fonts/*.ttf', '*/fonts/*.woff', '*/fonts/*.woff2'], [
        file({name: '[name][hash].[ext]', outputPath: 'fonts'}),
    ]),

    /** EXTRACTS FONTS STYLES  FROM MAIN STYLES IN SEPARATE CHUNK */
    splitChunks({
        fonts: {
            test: /fonts.*\/.*\.(sa|sc|c)ss$/,
            name: 'fonts',
            chunks: 'initial',
            enforce: true,
        },
    }),

    /** JS */
    match(['*.js', '!*node_modules*'], [
        babel(/* options */),
        jsTerserMinify( /* options */),
        cacheLoader(),
    ]),

    /** IMAGES INJECTS UP TO LIMIT OR COPIES */ // will load images up to 10KB as data URL
    match(['*.gif', '*.jpg', '*.jpeg', '*.png', '*.svg', '*.webp', '!*/fonts/*'], [
        url({limit: 10000, fallback: 'file-loader', name: 'img/[name][hash].[ext]'})
    ]),

    /** PHP SERVER */
    when(php.IS_PHP, [phpServer()]),

    addPlugins(
        [
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ['**/*'],
                cleanAfterEveryBuildPatterns: [],
            }),
            new CopyPlugin([
                // {from: 'src/app/router.php', to: "index.php"},
            ]),
        ]
    ),
    env('development', [
        setDevTool('source-map'),
        devServer({
            overlay: true,
            contentBase: wp.DEST_DIR,
            writeToDisk: true,
        })
    ]),


]);

if (php.IS_PHP) {
    config.devServer.index = ""; // specify to enable root proxying with falsy value
    config.devServer.proxy = {
        context: () => true,
        target: `http://${php.PHP_HOST}:${php.PHP_PORT}`,
        secure: false,
        changeOrigin: true,
    };
}

module.exports = config;