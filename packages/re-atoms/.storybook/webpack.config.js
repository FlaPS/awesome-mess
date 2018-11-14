const path = require('path');
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

module.exports = (baseConfig, env) => {
    const config = genDefaultConfig(baseConfig, env);

    // Extend it as you need.

    // For example, add typescript loader:
 /* config.module.rules.push({
        test: /\.(ts|tsx)$/,
        include: path.resolve(__dirname, '../src'),
        loader: require.resolve('awesome-typescript-loader'),
        options: {
            configFileName: 'tsconfig.frontend.json'
        },
    });
*/
    config.resolve.extensions.push('.ts', '.tsx');
    config.module.rules.push({
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loaders: ['file-loader'],
        include: path.resolve(__dirname, '../')
    })

    return config;
};