const TerserPlugin = require('terser-webpack-plugin');

/**
 * @see https://webpack.js.org/plugins/terser-webpack-plugin/
 * @param terserOptions
 * @returns {function(*, *): function(*): ({optimization}|*)}
 */
function jsTerserMinify(terserOptions = {}) {
    terserOptions = Object.assign({cache:true, parallel:4}, terserOptions);

    return function (context, utils) {
        return function (prevConfig) {
            prevConfig.optimization = prevConfig.optimization || {};
            prevConfig.optimization.minimizer = prevConfig.optimization.minimizer || [];
            prevConfig.optimization.minimizer.push(new TerserPlugin(terserOptions));
            return prevConfig;
        }
    }
}

module.exports = jsTerserMinify;

