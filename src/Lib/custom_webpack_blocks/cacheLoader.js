const path = require('path');

function cacheloader(cacheLoaderOptions = {}) {
    cacheLoaderOptions = Object.assign({
        cacheDirectory: path.resolve(process.cwd(), 'node_modules/.cache/cache-loader'),
    }, cacheLoaderOptions);


    return (context, {addLoader}) =>
        addLoader(
            Object.assign(
                {
                    use: [{
                        loader: 'cache-loader',
                        options: {
                            cacheDirectory: path.resolve(
                                __dirname,
                                'node_modules/.cache/cache-loader'
                            ),
                        },
                    },]
                },
                context.match
            )
        )
}

module.exports = cacheloader;