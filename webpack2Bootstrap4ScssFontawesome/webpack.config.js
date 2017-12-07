const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");
const webpack = require('webpack');
const bootstrapEntryPoints = require('./webpack.bootstrap.config');
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');

const isProd = process.env.NODE_ENV === 'production'; //true or false
//const scssDev = [
//    {
//        loader: 'style-loader', // inject CSS to page
//      }, {
//        loader: 'css-loader', // translates CSS into CommonJS modules
//      }, {
//        loader: 'postcss-loader', // Run post css actions
//        options: {
//          plugins: function () { // post css plugins, can be exported to postcss.config.js
//            return [
//              require('precss'),
//              require('autoprefixer')
//            ];
//          }
//        }
//      }, {
//        loader: 'sass-loader' // compiles SASS to CSS
//      }    
//];

//const scssDev = ['raw-loader', 'sass-loader'];
const scssDev = ['style-loader','css-loader','postcss-loader','sass-loader'];
//const scssDev = ['style-loader','css-loader','sass-loader'];
const scssProd = ExtractTextPlugin.extract({
    fallback: "style-loader",
    use: ['css-loader', 'postcss-loader','sass-loader'],
    publicPath: '../'
    //publicPath: './dist/'
});
const scssConfig = isProd ? scssProd : scssDev;
const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
    entry: {
        app: './src/app.js',
        contact: './src/contact.js',
        bootstrap: bootstrapConfig
        //bootstrap: 'bootstrap-loader',
        //jquery: 'jquery'
    },
    output:{
        path: __dirname + '/dist',
        filename: '[name].bundle.js'
    },
    module:{
        rules:[
            {
                // test: /\.s?css$/
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
            //{ test: /vendor\/.+\.(jsx|js)$/,
            //    loader: 'imports?jQuery=jquery,$=jquery,this=>window'
            //}            ,
            //// Bootstrap 4
            { 
                test: /bootstrap[\/\\]dist[\/\\]js[\/\\]umd[\/\\]/,
                //test: /bootstrap\/dist\/js\/umd\//,
                loader: 'imports-loader?jQuery=jquery' 
            },            
            //{ 
            //    test: /[\/\\]node_modules[\/\\]jquery[\/\\]jquery\.js$/,
            //    //test: /bootstrap\/dist\/js\/umd\//,
            //    loader: 'imports-loader?jQuery=jquery' 
            //},              
            //{ test: require.resolve("jquery"), loader: "expose?jQuery" },
            //{ test: require.resolve("jquery"), loader: "expose?$" }            
            
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
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            Popper: ['popper.js', 'default'],
            Tether: "tether",
            "window.Tether": "tether",
            Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
            Button: "exports-loader?Button!bootstrap/js/dist/button",
            Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
            Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
            Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
            Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
            Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
            Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
            Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
            Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
            Util: "exports-loader?Util!bootstrap/js/dist/util",
          }),
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
        })          
    ]
}