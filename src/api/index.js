import io from './io'

// 获取油费
export const getGasPrice = () => {
    return io.get('/api/v1.0/getSuggestGasPrice')
}

// 获取随机数
export const getRandomNumber = () => {
    return io.get('/api/v1.0/getRandomNumber')
}

// 获取下注参数
export const getPlaceBetParams = ({ betmask, modulo = 100, randomNumber }) => {
    return io({
        method: 'get',
        url: '/api/v1.0/getPlaceBetParams',
        params: { betmask, modulo, randomNumber }
    })
}

// 结算
export const settleBet = ({ randomNumber, hash }) => {
    return io({
        method: 'get',
        url: '/api/v1.0/settleBet',
        params: { randomNumber, hash }
    })
}

// 退款
export const refundBet = ({ randomNumber }) => {
    return io({
        method: 'get',
        url: '/api/v1.0/settleBet',
        params: { randomNumber }
    })
}