import io from './io'

// 获取油费
export const getGasPrice = () => {
    return io.get('/api/v1.0/dice/tron/getSuggestGasPrice')
}

// 获取下注参数
export const getBetParams = ({ betmask, modulo = 100, amount, address }) => {
    return io({
        method: 'get',
        url: '/api/v1.0/dice/tron/getPlaceBetParams',
        params: { betmask, modulo, amount, address }
    })
}

// 结算
export const settleBet = (params) => {
    return io({
        method: 'get',
        url: '/api/v1.0/dice/tron/settleBet',
        params
    })
}

// 获取所有投注记录
export const getRecord = () => {
    return io({
        method: 'get',
        url: '/api/v1.0/dice/tron/getBetsAll'
    })
}

// 获取我的投注记录
export const getMyRecord = ({ address }) => {
    return io({
        method: 'get',
        url: '/api/v1.0/dice/tron/getBetsMe',
        params: { address }
    })
}

// 获取下注系数
export const getAmountParams = () => {
    return io.get('/api/v1.0/dice/tron/getSuggestBetAmount')
}

//获取高额投注记录
export const getHighRoller = () => {
    return io.get('/api/v1.0/dice/tron/getBetsHighRoller')
}


//添加免费的用户
export const addGambler = ({address, amount = 100000}) => io.get('/api/v1.0/dice/tron/addgambler', {params:{address, amount}})

//免费投注的结算
export const settleBetFree = params => io.get('/api/v1.0/dice/tron/settleBetFree', { params })

export const getInfo = ({randomNumber, blockNumber}) =>  io.get('/api/v1.0/dice/tron/getInfo', { params: {randomNumber, blockNumber}})
