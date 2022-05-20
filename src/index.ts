const difficulty: number = Number(process.argv[2]) || 4;

const blockchain = new Blockchain(difficulty)
