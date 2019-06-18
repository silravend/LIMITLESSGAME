import web3 from '@/js/web3'
import { sliceNumber } from '@/js/utils'
import { eth as ethAddr, ethSettle as ethSettleAddr, ethFree as ethFreeAddr } from '@/js/address_config'
import ethAbi from './eth_abi'
import backendAbi from './backend_abi'
import freeAbi from './free_abi.js'
/**
 * Eth 的各种服务,包含合约
 */

class EthService {
    ethereum = null
    account = ''
    contract = null
    settleContract = null
    freeAmount = 0.001

    /**
     * 
     * @param {addrString} addr 合约地址 
     */
    constructor ({ addr = ethAddr } = {}) {
        this.addr = addr
    }
    
    // 检查是否安装
    checkInstalled () {
        this.ethereum = window.ethereum
        return !!this.ethereum
    }

    // 检查是否为主网
    checkMainNet () {
        return this.ethereum.networkVersion == 1
    }

    // 检查是否有地址
    checkAddress () {
        return !!this.ethereum.selectedAddress
    }

    // 初始化合约
    initContract () {
        this.contract = new web3.eth.Contract(ethAbi, ethAddr, {from: this.account})
        this.settleContract = new web3.eth.Contract(backendAbi, ethSettleAddr, {from: this.account})
        this.freeContract = new web3.eth.Contract(freeAbi, ethFreeAddr, {from: this.account})
    }

    // 获取账户
    async getAccount () {
        const accounts = await window.ethereum.enable()
        this.account = accounts[0]

        return this.account
    }

    // 获取余额
    async getBalance () {
        const balance = await web3.eth.getBalance(this.account)
        return sliceNumber(web3.utils.fromWei(balance, "ether"))
    }
    
    // 获取奖池
    async getJackpot () {
        const res = await web3.eth.getBalance(this.addr)
        return sliceNumber(web3.utils.fromWei(res))
    }
    
    // 获取投注结果
    async getResult (id, blockHash) {
        if (this.settleContract === null) {
            this.initContract()
        }
        const result = await this.settleContract.methods.getInfo(id, blockHash).call()
        const sha3Mod100 = parseInt(result[1].toString()) || 100

        return sha3Mod100
    }

    async freeBet (params, gas) {
        if (this.freeContract === null) {
            this.initContract()
        }
        return new Promise((resolve, reject) => {
            this.freeContract.methods.placeBetfree(web3.utils.toWei(this.freeAmount + '', "ether"), params.betMask, params.modulo, params.commitLastBlock, params.commit, params.r, params.s).send({
                gas: '150000',
                gasPrice: web3.utils.toWei(gas + '', 'gwei'),
                from: this.account
            }).catch(err => {
                reject(err)
            })
    
            this.freeContract.once('Commit', {

            }, (error, event) => {
                resolve(event)
            })
        })
    }

    // 投注
    async bet (params, gas, amount) {
        if (this.contract === null) {
            this.initContract()
        }
        return new Promise((resolve, reject) => {
            this.contract.methods.placeBet(params.betMask, params.modulo, params.commitLastBlock, params.commit, params.r, params.s).send({
                gas: '150000',
                gasPrice: web3.utils.toWei(gas + '', 'gwei'),
                from: this.account,
                value: web3.utils.toWei(amount + '', "ether")
            }).catch(err => {
                reject(err)
            })
    
            this.contract.once('Commit', {

            }, (error, event) => {
                resolve(event)
            })
        })
        
    }
}

export default EthService