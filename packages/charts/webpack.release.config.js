const path = require('path')
const webpack = require('webpack')
const ip = require('ip')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    entry: {
        front: [
            "./src/app/indexDev.tsx"
        ],
    },

    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, './public'),
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",



    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new UglifyJSPlugin({
            sourceMap: true
        })
    ],
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /.ts?$|.tsx?$/,
                exclude: /\.story\.tsx?$/,
                loader: [
                    "awesome-typescript-loader?configFileName=tsconfig.webpack.json"]
            },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                loader: 'image-webpack-loader'
            }
        ]
    },
    /*externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },*/
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    /*  externals: {
          "react": "React",
          "react-dom": "ReactDOM"
      },*/

    devServer: {
        contentBase: path.join(__dirname, "dev"),
        compress: true,
        port: 8081,
        hot: true,
        inline: true,
        host: ip.address(),
        headers: { 'Access-Control-Allow-Origin': '*' }
    }
}
