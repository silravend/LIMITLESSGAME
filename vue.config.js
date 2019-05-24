const path = require('path')

module.exports = {
    publicPath: process.env.NODE_ENV === 'development' ? '/' : 'https://limitless.ink/',
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'development') {
            config.devtool = 'source-map'
            // mutate config for production...
        }
        // config.resolve.alias = {
        //     '~': path.resolve(__dirname, 'src/')
        // }
    },
    productionSourceMap: false,
    filenameHashing: false,
    pages: {
        dice_eth: {
            // page 的入口
            entry: 'src/dice_eth.js',
            // 模板来源
            template: 'public/dice_ethereum.html',
            // 在 dist/eth.html 的输出
            filename: 'dice_ethereum.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'eth',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'dice_eth']
        },
        dice_tron: {
            // page 的入口
            entry: 'src/dice_tron.js',
            // 模板来源
            template: 'public/dice_tron.html',
            // 在 dist/tron.html 的输出
            filename: 'dice_tron.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'tron',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'dice_tron']
        },

        dice_eos: {
            // page 的入口
            entry: 'src/dice_eos.js',
            // 模板来源
            template: 'public/dice_eos.html',
            // 在 dist/eos.html 的输出
            filename: 'dice_eos.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'eos',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'dice_eos']
        },

        horse_eth: {
            // page 的入口
            entry: 'src/horse_eth.js',
            // 模板来源
            template: 'public/horseracing_ethereum.html',
            // 在 dist/horse_ethereum.html 的输出
            filename: 'horseracing_ethereum.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'eth',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'horse_eth']
        },

        horse_tron: {
            // page 的入口
            entry: 'src/horse_tron.js',
            // 模板来源
            template: 'public/horseracing_tron.html',
            // 在 dist/tron.html 的输出
            filename: 'horseracing_tron.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'tron',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'horse_tron']
        },
        
    },
    devServer: {
        historyApiFallback: {
            rewrites: [
                { from: /\/dice_eth/, to: '/dice_ethereum.html' },
                { from: /\/dice_tron/, to: '/dice_tron.html' },
                { from: /\/dice_eos/, to: '/dice_eos.html' },
                { from: /\/horse_eth/, to: '/horseracing_ethereum.html' },
                { from: /\/horse_tron/, to: '/horseracing_tron.html' },
                { from: /\/coin_eth/, to: '/coin_ethereum.html' },
                { from: /\/coin_tron/, to: '/coin_tron.html' }
            ]
        }
    }
}