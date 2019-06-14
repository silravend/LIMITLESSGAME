import io from './io'

//获取宝箱
export const getTreasureBox = address => io.get('/treasurebox', {params: { address }})

//开启宝箱
export const openTreasureBox = ({address, boxid}) => io.get('/openbox', {params: {address, boxid }})

//获取用户的免费次数
export const getUserFreeBets = address => io.get('/userFreeBets', {params: {address}})

//获取用户的LLT
export const getUserPt = address => io.get('/userPt', {params: {address}})