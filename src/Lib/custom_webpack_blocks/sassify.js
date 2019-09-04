const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const {env} = require('@webpack-blocks/webpack');

/**
 *
 * @param {{}} miniCssPluginOptions
 * @param {{}} miniCssLoaderOptions
 * @param {{}} cssLoaderOptions
 * @param {{}} postCssOptions
 * @param {{}} sassOptions
 * @returns {function(*, {addLoader: *, addPlugin: *}): function(*=): *}
 */
function sassify(miniCssPluginOptions = {}, miniCssLoaderOptions = {}, cssLoaderOptions = {}, postCssOptions = {}, sassOptions = {}) {

    miniCssPluginOptions = Object.assign({
        filename: "css/[name].css",
        chunkFilename: 'css/[name].css',
        ignoreOrder: false,
    }, miniCssPluginOptions);

    miniCssLoaderOptions = Object.assign({
        publicPath: '../',
        hmr: process.env.NODE_ENV === 'development',
    }, miniCssLoaderOptions);

    postCssOptions = Object.assign({
        plugins: [
            autoprefixer({overrideBrowserslist: ['defaults', '> 1%', 'last 4 versions']}),
            env("production", [cssnano()]),
        ],
        /* Other PostCSS options */
    }, postCssOptions);


    return function (context, {addLoader}) {
        return function (prevConfig) {
            prevConfig = Object.assign({}, prevConfig, {plugins: prevConfig.plugins.concat([new MiniCssExtractPlugin(miniCssPluginOptions)])});
            return addLoader(Object.assign(
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: miniCssLoaderOptions
                        },
                        {
                            loader: 'css-loader',
                            options: cssLoaderOptions,
                        },
                        {
                            loader: 'postcss-loader',
                            options: postCssOptions,
                        },
                        {
                            loader: 'sass-loader',
                            options: sassOptions,
                        }
                    ]
                },
                context.match
            ))(prevConfig);
        }
    }
}

module.exports = sassify;