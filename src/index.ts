import { Blockchain } from './classes/blockchain'

const difficulty: number = Number(process.argv[2]) || 4

const blockchain = new Blockchain(difficulty)

const numBlocks: number = Number(process.argv[3]) || 10

let chain = blockchain.chain

for (let index = 0; index < numBlocks; index++) {
  const block = blockchain.createBlock(`Block ${index}`)
  const mineInfo = blockchain.mineBlock(block)

  chain = blockchain.sendBlock(mineInfo.minedBlock)
}

console.log('---- BLOCKCHAIN ----')
console.log(chain)
