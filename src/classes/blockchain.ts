import { BlockModel, PayloadModel } from '../models/blockchain.model'
import { hash, checkedHash } from '../utils/helpers.util'

export class Blockchain {
  #chain: BlockModel[] = []
  private powPrefix = '0'

  constructor(private readonly difficulty: number = 4) {
    this.#chain.push(this.createGenesisBlock())
  }

  private createGenesisBlock(): BlockModel {
    const payload: PayloadModel = {
      sequency: 0,
      timestamp: +new Date(),
      data: 'Initial Block',
      prevHash: ''
    }

    return {
      header: {
        nonce: 0,
        blockHash: hash(JSON.stringify(payload))
      },
      payload
    }
  }

  get chain(): BlockModel[] {
    return this.#chain
  }

  private get lastBlock(): BlockModel {
    return this.#chain.at(-1) as BlockModel
  }

  private lastBlockHash(): string {
    return this.lastBlock.header.blockHash
  }

  createBlock(data: any): PayloadModel {
    const newBlock: PayloadModel = {
      sequency: this.lastBlock.payload.sequency + 1,
      timestamp: +new Date(),
      data,
      prevHash: this.lastBlockHash()
    }

    console.log(`Block #${newBlock.sequency} created: ${JSON.stringify(newBlock)}`)
    return newBlock
  }

  mineBlock(block: PayloadModel): any {
    let nonce: number = 0
    const begin: number = +new Date()

    while (true) {
      const blockHash: string = hash(JSON.stringify(block))
      const hashPow: string = hash(blockHash + nonce)
      if (
        checkedHash({
          hash: hashPow,
          difficulty: this.difficulty,
          prefix: this.powPrefix
        })
      ) {
        const final: number = +new Date()
        const reducedHash: string = blockHash.slice(0, 12)
        const miningTime: number = (final - begin) / 1000

        console.log(`Block #${block.sequency} mined in ${miningTime}s. Hash ${reducedHash} (${nonce} attempts)`)

        return {
          minedBlock: {
            payload: { ...block },
            header: {
              nonce,
              blockHash
            }
          }
        }
      }
      nonce++
    }
  }

  checkBlock(block: BlockModel): boolean {
    if (block.payload.prevHash !== this.lastBlockHash()) {
      console.error(
        `Block #${block.payload.sequency} it's ${this.lastBlockHash().slice(
          0,
          12
        )} indeed ${block.payload.prevHash.slice(0, 12)}`
      )
      return false
    }

    const hashTest: string = hash(hash(JSON.stringify(block.payload)) + block.header.nonce)

    if (!checkedHash({ hash: hashTest, difficulty: this.difficulty, prefix: this.powPrefix })) {
      console.error(
        `Block #${block.payload.sequency} it's invalid! Nonce ${block.header.nonce} it's invalid and can't be checked!`
      )
      return false
    }

    return true
  }

  sendBlock(block: BlockModel): BlockModel[] {
    if (this.checkBlock(block)) {
      this.#chain.push(block)
      console.log(`Block #${block.payload.sequency} has been added into blockchain: ${JSON.stringify(block, null, 2)}`)
    }

    return this.#chain
  }
}
