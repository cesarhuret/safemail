const webpack = require('webpack');

module.exports = function override(config, env) {
    //do stuff with the webpack config...

    config.resolve.fallback = {
        fs: false,
        path: false,
        constants: false,
        browser: false,
        ...config.resolve.fallback
    }

    config.resolve.alias = {
        assert: 'assert',
        // buffer: 'buffer',
        // os: 'os-browserify/browser',
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        // process: 'process/browser.js',
        http: 'stream-http',
        https: 'https-browserify',
        // util: 'util',
        zlib: 'browserify-zlib',
        ...config.resolve.alias
    }

    // config.experiments = {
    //     asyncWebAssembly: true,
    //     ...config.experiments
    // }

    // config.plugins = [
    //     new webpack.ProvidePlugin({
    //         process: "process/browser.js",
    //         Buffer: ['buffer', 'Buffer']
    //     }),
    //     ...config.plugins
    // ]

    return config;
}