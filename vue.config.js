const path = require('path')


module.exports = {
    publicPath: './',
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'development') {
            config.devtool = 'source-map'
            // mutate config for production...
        }
        // config.resolve.alias = {
        //     '~': path.resolve(__dirname, 'src/')
        // }
    },
   
}