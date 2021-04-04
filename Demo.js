console.log("Hello, This is a BlockChain Demo.")
const sha256=require('crypto-js/sha256')


class Block{
    constructor(data,previousHash){
        this.data=data
        this.previousHash=previousHash
        this.nonce=1
        this.hash=this.computeHash()
    }

    computeHash(){
        return sha256(this.data+this.previousHash+this.nonce).toString()
    }

    getAnswer(difficulty){
        //difficult 是链给的,为一个整数,但难度提升是指数级的上升的
        //开头前n位为0的hash字符串
        let answer=''
        for(let i=0;i<difficulty;i++){
            answer += '0'
        }
        return answer
    }

    //挖矿程序
    mine(difficulty){
        //得到的difficult 是链给出的
        while(true){
            console.log("计算出Hash值: ",this.hash)
            console.log("不符合要求,继续计算...")

            this.hash=this.computeHash()
            if(this.hash.substring(0,difficulty)!==this.getAnswer(difficulty)){
                //根据链给的difficult,我们知道了要算出的hash值必须满足什么要求
                //每计算一次,便将得到的hash与拿去验证
                //验证不通过,则改变随机数nonce的值
                this.nonce++
                this.hash=this.computeHash()
            }else{
                //得到了满足链要求的hash值,则跳出循环
                break       
            }
        }
        console.log('挖矿结束! 得到的Hash值:\n',this.hash)
        console.log('成功接入链.')
    }
}


class Chain{
    constructor(){
        this.chain=[this.bigBang()]
        this.difficulty=3       //挖矿的难度
        //难度是由链决定的
        //区块只有计算出符合链给出的难度的hash,才能被接到链上
    }

    bigBang(){
        const genesisBlock = new Block("我是祖先",'')
        return genesisBlock
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1]
    }
    addBlockChain(newBlock){
        //找到最近一个block的Hash,作为新区块的previousHash
        newBlock.previousHash=this.getLatestBlock().hash
        
        newBlock.hash=newBlock.computeHash()        //先让区块获取一个hash
        //将链提出的难度要求告诉区块
        //区块将计算结果与链的要求做匹配,不符合则改变自己的随机值继续计算
        //直到算出的hash符合要求
        newBlock.mine(this.difficulty)
        this.chain.push(newBlock)
    }

    validateChain(){
        if(this.chain.length===1){
            return this.chain[0].hash===this.chain[0].computeHash()
        }
        //下面是从第二个区块开始验证
        for(let i=1;i<= this.chain.length-1;i++){
            const blockToValidate=this.chain[i]
            if(blockToValidate.hash !== blockToValidate.computeHash()){
                console.log('数据篡改')
                return false
            }
            const previousBlock=this.chain[i-1]
            if(blockToValidate.previousHash !== previousBlock.hash){
                console.log("区块断裂")
                return false
            }
        }

        return "区块链无误"
    }


}

const MyChain= new Chain()
const block1 = new Block("转账10元","")
// const block2 = new Block("转账100元","")
MyChain.addBlockChain(block1)
// MyChain.addBlockChain(block2)

// MyChain.chain[1].data="转账300元"
// MyChain.chain[1].hash=MyChain.chain[1].computeHash()
console.log(MyChain)
console.log(MyChain.validateChain())