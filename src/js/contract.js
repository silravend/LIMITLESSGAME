import ethAbi from './eth_abi'
import backendAbi from './backend_abi'
import web3 from './web3'

export const eth = account => {
    const address = '0xCa1699f27E47CC577ed24a7CDC54676350e08510'
    return new web3.eth.Contract(ethAbi, address, {from: account})
}

export const ethSettle = account => {
    const address = '0x432203af55606d6e6B50d09cFCD18b918cBA3D0e'
    return new web3.eth.Contract(backendAbi, address, {from: account})
}

export const tron = () => {
    const address = 'TR4pfjyXuUFy1nQPEZfYb7BD6ywhPuoBmF'
    const tronWeb = window.tronWeb
    return tronWeb.contract().at(address).catch(err => console.log(err))
}

export const tronSettle = () => {
    const address = 'TWnQSEwNLQG2JpsarWGFF1RpEXrhcmG4e7'
    const tronWeb = window.tronWeb
    return tronWeb.contract().at(address).catch(err => console.log(err))
}
