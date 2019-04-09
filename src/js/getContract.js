import ethAbi from './eth_abi'
import Web3 from 'web3'

const address = '0xa73E7df87b0174f6d4a233be4f369267a57c17d0'
const web3 = new Web3(Web3.givenProvider)
let contract

export default (account) => {
    if (!contract) {
        contract = new web3.eth.Contract(ethAbi, address, {from: account})
    }
    return contract
}