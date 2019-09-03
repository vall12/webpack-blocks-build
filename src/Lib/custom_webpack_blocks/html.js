const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const wp = require('./../../constants/php_const');

function html(options = {}) {
    return (context, {addPlugin}) => {
        options = Object.assign({
            filename: "index.html",
            template: path.resolve(process.cwd(),  'src/index.html')
        }, options);
        options.minify = Object.assign({
            removeComments: wp.IS_PRODUCTION,
            quoteCharacter: "\"",
            removeAttributeQuotes: true,
            removeEmptyAttributes: false,
            decodeEntities: false,
            sortAttributes: true,
            sortClassName: true,
            collapseWhitespace: wp.IS_PRODUCTION,
        }, options.minify || {});

        return addPlugin(new HtmlWebpackPlugin(options));
    }
}

module.exports = html;