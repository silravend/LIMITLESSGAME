import ethAbi from './eth_abi'
import web3 from './web3'

// const address = '0xa73E7df87b0174f6d4a233be4f369267a57c17d0'
const address = '0xCa1699f27E47CC577ed24a7CDC54676350e08510'
let contract

export default (account) => {
    if (!contract) {
        contract = new web3.eth.Contract(ethAbi, address, {from: account, gas: 5000000})
    }
    return contract
}