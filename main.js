const SHA256 = require('crypto-js/sha256');

class Block
{
    constructor(index, timestamp, data, previoushash = '')
    {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previoushash = previoushash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash()
    {
        return SHA256(this.index + this.previoushash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty)
    {
        //endless loop unless contents of block changes. . .
        //add nonce value to each block!
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0"))
        {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain{
    constructor()
    {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2021", "Genesis block", "0");
    }

    getLatestBlock()
    {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock)
    {
        newBlock.previoushash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid()
    {
        for( let i = 1; i < this.chain.length; i++)
        {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash())
            {
                return false;
            }

            if(currentBlock.previoushash !== previousBlock.hash)
            {
                return false;
            }
        }

        return true;
    }
}

let catesCoin = new Blockchain();

console.log('Mining block 1. . . ');
catesCoin.addBlock(new Block(1, "04/29/2021", { amount: 4}));

console.log('Mining block 2. . .');
catesCoin.addBlock(new Block(2, "05/29/2021", { amount: 8}));


//console.log('Is blockchain valid ' + catesCoin.isChainValid());

//catesCoin.chain[1].data = { amount: 100};
//catesCoin.chain[1].hash = catesCoin.chain[1].calculateHash();

//console.log('Is blockchain valid ' + catesCoin.isChainValid());

//console.log(JSON.stringify(catesCoin, null, 4));