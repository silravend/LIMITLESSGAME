
export const sliceNumber = (number, digit = 4) => {
    const n = parseFloat(number)
    if (isNaN(n)) {
        return 
    }

    const base = Math.pow(10, digit)
    return Math.floor(n * base) / base
}