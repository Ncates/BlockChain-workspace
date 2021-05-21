const SHA256 = require('crypto-js/sha256');

class Transaction
{
    constructor(fromAddress, toAddress, amount)
    {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

//A Single Block in the chain.
class Block
{
    //modified 'data' to 'transations'
    //removed index (not useful in a blockchain)
    constructor(timestamp, transactions, previoushash = '')
    {
        //this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previoushash = previoushash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    //Hash is the linkage between the blocks.
    calculateHash()
    {
        return SHA256(this.index + this.previoushash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    //Difficulty can also dictate the speed at which the chain is implemented.
        //Number of zeros in the beginning of each hash. Very large number.
    mineBlock(difficulty)
    {
        //endless loop unless contents of block changes. . .
        //Runs until adequate number of zeros reached.
        //add nonce value to each block!
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0"))
        {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

//The chain itself. Typically a public ledger.
class Blockchain{
    constructor()
    {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    //Genesis block-first block in the chain
        //Does not have a previous block.
    createGenesisBlock(){
        return new Block("01/01/2021", "Genesis block", "0");
    }

    //Use the chain to see the last block entered
    getLatestBlock()
    {
        return this.chain[this.chain.length - 1];
    }

    //creates a new block based on the criteria given in constructor.
    /*OLD */
    // addBlock(newBlock)
    // {
    //     newBlock.previoushash = this.getLatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    /*NEWER*/
    minePendingTransactions(miningRewardAddress)
    {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];

    }

    createTransaction(transaction)
    {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address)
    {
        let balance = 0;

        for(const block of this.chain)
        {
            for( const trans of block.transactions)
            {
                if(trans.fromAddress === address)
                {
                    balance -= trans.amount;
                }

                if(trans.toAddress===address)
                {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    //Check chain validity
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

/*Console testing:

command:
    node main.js
    
*/

//

// OLD TEST
//{
//Instantiate object that serves as the crypto(blockchain)
// let catesCoin = new Blockchain();

// console.log('Mining block 1. . . ');
// catesCoin.addBlock(new Block(1, "04/29/2021", { amount: 4}));

// console.log('Mining block 2. . .');
// catesCoin.addBlock(new Block(2, "05/29/2021", { amount: 8}));


// //console.log('Is blockchain valid ' + catesCoin.isChainValid());

// //catesCoin.chain[1].data = { amount: 100};
// //catesCoin.chain[1].hash = catesCoin.chain[1].calculateHash();

// //console.log('Is blockchain valid ' + catesCoin.isChainValid());

// //console.log(JSON.stringify(catesCoin, null, 4));

//                                                                      }


/*Testing After adding newer code (transactions instead of indexes) */

let catesCoin = new Blockchain();
catesCoin.createTransaction(new Transaction('address1', 'address2', 100));
catesCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner');
catesCoin.minePendingTransactions('nate');

console.log('\nBalance of nate is', catesCoin.getBalanceOfAddress('nate'));