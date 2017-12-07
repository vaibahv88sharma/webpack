const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");
const webpack = require('webpack');
const bootstrapEntryPoints = require('./webpack.bootstrap.config');
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');

const isProd = process.env.NODE_ENV === 'production'; //true or false
const scssDev = ['style-loader','css-loader','sass-loader'];
const scssProd = ExtractTextPlugin.extract({
    fallback: "style-loader",
    use: ['css-loader', 'sass-loader'],
    //publicPath: './dist/'
    publicPath: '../'
});
const scssConfig = isProd ? scssProd : scssDev;
const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
    entry: {
        app: './src/app.js',
        contact: './src/contact.js',
        bootstrap: bootstrapConfig
    },
    output:{
        path: __dirname + '/dist',
        filename: '[name].bundle.js'
    },
    module:{
        rules:[
            {
                test: /\.scss$/,
                use: scssConfig
            },
            {
                //test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/i,
                test: /\.(png|jpe?g|gif|ico)$/i,
                use: [
                    'file-loader?name=images/[name].[hash:6].[ext]',
                    'image-webpack-loader'
                ]           
/*                 loader: 'file-loader',
                options:{
                    name:'images/[name].[hash:6].[ext]',
                    //outputPath:'images/',
                    //publicPath:'images/'
                }, */
            },
            { test: /\.(woff2?|svg)$/, loader: 'url-loader?limit=10000&name=fonts/[name].[hash:6].[ext]' },
            { test: /\.(ttf|eot)$/, loader: 'file-loader?name=fonts/[name].[hash:6].[ext]' },  
            // Bootstrap 3
            { 
                //test: /bootstrap-sass\/assets\/javascripts\//, 
                test: /bootstrap-sass(\\|\/)assets(\\|\/)javascripts(\\|\/)/,    // for windows            
                loader: 'imports-loader?jQuery=jquery' 
            }
        ]
    },
    devServer:{
        contentBase: path.join(__dirname, "dist"),        
        compress: true,
        port: 8080,
        hot: true,
        stats: "errors-only"//,
        //open: true
    },    
    plugins: [
        new HtmlWebpackPlugin({ 
            title: 'Custom template',
            //minify:{
            //    collapseWhitespace: true
            //},
            //filename: './../index.html',   // Change Location of output html file
            hash: true,
            excludeChunks: ['contact'],
            template: './src/index.html'
        }),
        new HtmlWebpackPlugin({ 
            title: 'Another template',
            hash: true,
            filename: './contact.html',   // Change Location of output html file
            chunks: ['contact'],
            template: './src/contact.html'
        }),        
        new ExtractTextPlugin({
            filename: './css/[name].css',
            disable: !isProd, // DISABLE IT WHEN USING HOT-MODULE-REPLACEMENT (HMR) AS HMR DOES NOT WORK WITH IT
            allChunks: true            
        }),     
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'SRC/*.html')),
        })        
    ]
}