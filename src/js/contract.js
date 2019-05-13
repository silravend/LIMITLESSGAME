import ethAbi from './eth_abi'
import backendAbi from './backend_abi'
import web3 from './web3'
import {eth as ethAddr, ethSettle as ethSettleAddr, tron as tronAddr, tronSettle as tronSettleAddr } from './address_config'

export const eth = account => {
    return new web3.eth.Contract(ethAbi, ethAddr, {from: account})
}

export const ethSettle = account => {
    return new web3.eth.Contract(backendAbi, ethSettleAddr, {from: account})
}

export const tron = () => {
    const tronWeb = window.tronWeb
    return tronWeb.contract().at(tronAddr).catch(err => console.log(err))
}

export const tronSettle = () => {
    const tronWeb = window.tronWeb
    return tronWeb.contract().at(tronSettleAddr).catch(err => console.log(err))
}
