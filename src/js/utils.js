
/**
 * 一些工具方法
 */

/**
 * 裁剪数字
 * @param {number} number 要裁剪的数字
 * @param {number} digit 保留的小数位
 */
export const sliceNumber = (number, digit = 4) => {
    const n = parseFloat(number)
    if (isNaN(n)) {
        return 
    }

    const base = Math.pow(10, digit)
    return Math.floor(n * base) / base
}

/**
 * 将字符串中间折叠为省略号，例如处理用户的address
 * @param {string} string 传入的字符串
 * @param {number} start 开头保留的字符位数
 * @param {number} end 结尾保留的字符位数
 */
export const foldString = (string, start = 3, end = 4) => {
    return `${string.slice(0,3)}...${string.slice(-end)}`
}