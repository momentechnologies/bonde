const LoadableWebpackPlugin = require('@loadable/webpack-plugin');
const path = require('path');
const webpack = require('webpack');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//     .BundleAnalyzerPlugin;

module.exports = {
    plugins: ['scss', 'eslint'],
    modifyWebpackConfig(opts) {
        const config = opts.webpackConfig;

        config.plugins.unshift(
            new webpack.IgnorePlugin({
                resourceRegExp: /^\.\/locale$/,
                contextRegExp: /moment$/,
            })
        );

        if (opts.env.target === 'web' && opts.env.dev) {
            config.devServer.quiet = false;
            config.devServer.public = 'frontend.local.kaalrota.no:443';
            config.devServer.proxy = {
                context: () => true,
                target: 'http://localhost:3000',
            };
        }

        // add loadable webpack plugin only
        // when we are building the client bundle
        if (opts.env.target === 'web') {
            const filename = path.resolve(__dirname, 'build');

            // saving stats file to build folder
            // without this, stats files will go into
            // build/public folder
            config.plugins.push(
                new LoadableWebpackPlugin({
                    outputAsset: false,
                    writeToDisk: { filename },
                })
            );
            // config.plugins.push(new BundleAnalyzerPlugin());
        }

        return config;
    },
};
