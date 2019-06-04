/**
 * 游戏中用到的公用方法
 */
import NP from 'number-precision'


/**
 * 根据投注金额提前计算出ETH奖金，提高开奖速度
 * {number} amount 投注的金额
 * {number} num 投注的值
 */
export const calcEthReward = (amount, num) => {
    const jackpotFee = amount >= 0.1 ? 0.001 : 0
    const bankerFee = Math.max(amount * 0.01, 0.0003)
    
    return NP.divide(NP.minus(amount, jackpotFee, bankerFee) * 100 , num)
}

/**
 * 根据投注金额提前计算出TRON奖金，提高开奖速度
 * {number} amount 投注的金额
 * {number} num 投注的值
 */

export const calcTronReward = (amount, num) => {
    const jackpotFee = amount >= 10 ? 0.1 : 0
    const bankerFee = Math.max(amount * 0.01, 0.03)
    
    return NP.divide(NP.minus(amount, jackpotFee, bankerFee) * 100 , num)
}

/**
 * 根据投注金额提前计算出EOS奖金，提高开奖速度
 * {number} amount 投注的金额
 * {number} num 投注的值
 */

export const calcEosReward = (amount, num) => {
    const jackpotFee = amount >= 1 ? 0.01 : 0
    const bankerFee = Math.max(amount * 0.01, 0.03)
    
    return NP.divide(NP.minus(amount, jackpotFee, bankerFee) * 100 , num)
}

/**
 * 计算赔率
 * {number} bet 投注的数字
 * {number} min 游戏设定的最小值
 * {number} max 游戏设定的最大值
 * 
 */
export const calcLossPer = ({ min = 1, max = 97, bet = 1}) => {
    const step1 = NP.plus(min, max)
    const step2 = NP.divide(step1, bet)
    return step2.toFixed(2)
}