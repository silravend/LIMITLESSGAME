import { sliceNumber, tryDo } from '@/js/utils'
import { tron as tronAddr, tronSettle as tronSettleAddr, tronFree as tronFreeAddr } from '../address_config'
/**
 * Tron 的各种服务,包含合约
 */

class TronService {
    account = ''
    contract = null
    settleContract = null
    freeContract = null
    freeAmount = 100000
    freeTron = 0.1

    constructor () {
    }
    
    // 检查是否安装, 必须主动先调用
    checkInstalled () {
        return !!window.tronWeb
    }

    // 检查是否为主网
    checkMainNet () {
        return window.tronWeb.eventServer.host.indexOf('api.trongrid.io') > -1
    }

    async isConnected () {
        await window.tronWeb.isConnected()
    }

    // 初始化合约
    async initContract () {
        const [contract, settleContract, freeContract] = await Promise.all([window.tronWeb.contract().at(tronAddr), window.tronWeb.contract().at(tronSettleAddr),  window.tronWeb.contract().at(tronFreeAddr)])
        this.contract = contract
        this.settleContract = settleContract
        this.freeContract = freeContract
    }

    // 获取账户
    getAccount () {
        this.account = window.tronWeb.defaultAddress.base58
        return window.tronWeb.defaultAddress.base58
    }

    // 获取余额
    async getBalance () {
        const [res, err] = await tryDo(window.tronWeb.trx.getBalance(this.account))
        
        // tron的getBalance有一定概率会报错，所以使用了递归函数
        if (err) {
            return this.getBalance()
        } else {
            return sliceNumber(window.tronWeb.fromSun(res), 2)
        }
    }
    
    // 获取奖池
    async getJackpot () {
        const res = await this.contract.methods.jackpotSize().call()

        return sliceNumber(window.tronWeb.fromSun(res), 2)
    }
    
    // 获取投注结果
    async getResult (id, blockNumber) {
        if (this.settleContract === null) {
            await this.initContract()
        }
        const block = await window.tronWeb.trx.getBlock(parseInt(blockNumber))
        const blockHash = "0x" + block.blockID
        let result = await this.settleContract.getInfo(id, blockHash).call()
        const sha3Mod100 = parseInt(result[1].toString()) || 100
        
        return sha3Mod100
    }

    //免费下注
    async freeBet (params) {
        if (this.freeContract === null) {
            this.initContract()
        }
        return new Promise((resolve, reject) => {
            this.freeContract.Commit().watch({filters: {commit: params.commit.slice(2)}}, (err, res) => {
                if(err) {
                   reject(err)
                }

                resolve(res)
            })

            this.freeContract.placeBetfree(window.tronWeb.toSun(this.freeTron), params.betMask, params.modulo, params.commitLastBlock, params.commit, params.r, params.s).send({
                feeLimit: 100000000,
                shouldPollResponse:true
            }).catch(err => {
                reject(err)
            })
        })
    }

    // 投注
    async bet (params, amount) {
        if (this.contract === null) {
            this.initContract()
        }
        return new Promise((resolve, reject) => {
            this.contract.Commit().watch({filters: {commit: params.commit.slice(2)}}, (err, res) => {
                if(err) {
                   reject(err)
                }

                resolve(res)
            })

            this.contract.placeBet(params.betMask, params.modulo, params.commitLastBlock, params.commit, params.r, params.s).send({
                feeLimit: 100000000,
                callValue: window.tronWeb.toSun(amount),
                shouldPollResponse:true
            }).catch(err => {
                reject(err)
            })
        })
        
    }
}

export default TronService