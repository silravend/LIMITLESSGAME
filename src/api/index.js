import io from './io'

// 获取油费
export const getGasPrice = () => {
    return io.get('/api/v1.0/dice/ethereum/getSuggestGasPrice')
}

// 获取下注参数
export const getParams = ({ betmask, modulo = 100, amount, address }) => {
    return io({
        method: 'get',
        url: '/api/v1.0/dice/ethereum/getPlaceBetParams',
        params: { betmask, modulo, amount, address }
    })
}

// 结算
export const settleBet = (params) => {
    return io({
        method: 'get',
        url: '/api/v1.0/dice/ethereum/settleBet',
        params
    })
}

// 获取所有投注记录
export const getRecord = () => {
    return io({
        method: 'get',
        url: '/api/v1.0/dice/ethereum/getBetsAll'
    })
}

// 获取我的投注记录
export const getMyRecord = ({ address }) => {
    return io({
        method: 'get',
        url: '/api/v1.0/dice/ethereum/getBetsMe',
        params: { address }
    })
}
