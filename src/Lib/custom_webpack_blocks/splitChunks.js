function splitChunks(cacheGroupOptions = {}) {

    return function (context, utils) {
        return function (prevConfig) {
            prevConfig.optimization = prevConfig.optimization || {};
            prevConfig.optimization.splitChunks = prevConfig.optimization.splitChunks || {};
            prevConfig.optimization.splitChunks.cacheGroups = prevConfig.optimization.splitChunks.cacheGroups || {};
            prevConfig.optimization.splitChunks.cacheGroups = Object.assign(prevConfig.optimization.splitChunks.cacheGroups, cacheGroupOptions);

            return prevConfig;
        }
    }
}

module.exports = splitChunks;
