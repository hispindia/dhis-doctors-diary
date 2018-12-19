var path = require('path');

var webpack = require('webpack');
//const WorkboxPlugin = require('workbox-webpack-plugin');
const htmlPlugin = require("html-webpack-plugin");
const cleanPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var parentDir = path.join(__dirname, './');

module.exports = {
    node: {
        console: false,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    entry: [
        path.join(parentDir, 'index.js')
    ],
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins:[
     /*   new WorkboxPlugin.GenerateSW({
            // these options encourage the ServiceWorkers to get in there fast 
            // and not allow any straggling "old" SWs to hang around
            clientsClaim: true,
            skipWaiting: true
         
        }),
       */   
        new cleanPlugin(["dist"]),
        new CopyWebpackPlugin([
            //{from:'src/images',to:'images'} ,
            {from:"./index.html",to:'index.html'},
            {from:"./hnl.mobileConsole.1.3.js",to:'hnl.mobileConsole.1.3.js'},
            {from:"./css",to:'css',ignore: [ '#*.css' ]}

        ]), 
      
          
    ],
    output: {
        path: parentDir + '/dist',
        filename: 'bundle.js'
    }
}
