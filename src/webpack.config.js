// webpack.config.js
const webpack = require('webpack');

module.exports = {
    // ... your existing configuration ...
    resolve: {
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            zlib: require.resolve('browserify-zlib'),
            url: require.resolve('url/'),
        },
    },
    
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
};