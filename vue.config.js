const path = require('path')

module.exports = {
    publicPath: '/',
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'development') {
            config.devtool = 'source-map'
            // mutate config for production...
        }
        // config.resolve.alias = {
        //     '~': path.resolve(__dirname, 'src/')
        // }
    },

    pages: {
        eth: {
            // page 的入口
            entry: 'src/eth.js',
            // 模板来源
            template: 'public/dice_ethereum.html',
            // 在 dist/eth.html 的输出
            filename: 'dice_ethereum.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'eth',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'eth']
        },
        tron: {
            // page 的入口
            entry: 'src/tron.js',
            // 模板来源
            template: 'public/dice_tron.html',
            // 在 dist/tron.html 的输出
            filename: 'dice_tron.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'tron',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'tron']
        }
    },
    devServer: {
        historyApiFallback: {
            rewrites: [
                { from: /\/eth/, to: '/dice_ethereum.html' },
                { from: /\/tron/, to: '/dice_tron.html' },
            ]
        }
    }
   
}