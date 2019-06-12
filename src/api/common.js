import io from './io'

//获取宝箱
export const getTreasureBox = address => io.get('/treasurebox', {params: { address }})

//开启宝箱
export const openTreasureBox = ({address, boxid}) => io.get('/openbox', {params: {address, boxid }})