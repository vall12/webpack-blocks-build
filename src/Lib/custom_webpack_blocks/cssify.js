const MiniCssExtractPlugin = require('mini-css-extract-plugin');


function cssify(pluginOptions = {}, loaderOptions = {}) {

    pluginOptions = Object.assign({
        filename: "css/[name].css",
        chunkFilename: 'css/[name].css',
        ignoreOrder:false,
    }, pluginOptions);

    loaderOptions = Object.assign({
        publicPath: '../',
        hmr: process.env.NODE_ENV === 'development',
    }, loaderOptions);

    return function (context, {addLoader, addPlugin}) {
        return function (prevConfig) {
            prevConfig = Object.assign({}, prevConfig, {plugins: prevConfig.plugins.concat([new MiniCssExtractPlugin(pluginOptions)])});
            return addLoader(Object.assign(
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: loaderOptions
                        },
                        'css-loader',
                    ]
                },
                context.match
            ))(prevConfig);
        }
    }
}

module.exports = cssify;