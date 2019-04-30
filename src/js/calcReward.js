import NP from 'number-precision'

export default {
    /**
     * 根据投注金额提前计算出ETH奖金，提高开奖速度
     * {amount} 投注的金额
     * {num} 投注的值
     */
    eth (amount, num) {
        const jackpotFee = amount >= 0.1 ? 0.001 : 0
        const bankerFee = Math.max(amount * 0.01, 0.0003)
        
        return NP.divide(NP.minus(amount, jackpotFee, bankerFee) * 100 , num)
    },

    /**
     * 根据投注金额提前计算出TRON奖金，提高开奖速度
     * {amount} 投注的金额
     * {num} 投注的值
     */
    tron (amount, num) {
        const jackpotFee = amount >= 100 ? 1 : 0
        const bankerFee = Math.max(amount * 0.01, 0.03)
        
        return NP.divide(NP.minus(amount, jackpotFee, bankerFee) * 100 , num)
    }
}