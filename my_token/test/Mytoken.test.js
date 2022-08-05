const Mytoken = artifacts.require("Mytoken")

contract("Mytoken", (accounts) => {

    const _name = 'Thanh'
    const _symbol = 'CTT'
    
    before(async () => {
        mytoken = await Mytoken.deployed()
    })
        
    it('has the correct name', async () => {                              
        const name = await mytoken.name()                  
        assert.equal(name, _name)       
    })

    it('has the correct symbol', async () => {                           
        const symbol = await mytoken.symbol()                  
        assert.equal(symbol, _symbol)       
    })

    it("gives the owner of the token 1B tokens", async () => {
        let balance = await mytoken.balanceOf(accounts[0])
        balance = web3.utils.fromWei(balance,'ether')
        assert.equal(balance,'1000000000',"Balance should be 1M tokens for contract creator")
    })

    it("check Total Supply", async () => {
        let totalSupply = await mytoken.totalSupply()
        totalSupply = web3.utils.fromWei(totalSupply,'ether')
        assert.equal(totalSupply,'1000000000')
    })

    it("can transfer tokens between accounts", async () => {
        let amount = web3.utils.toWei('1000','ether')
        await mytoken.transfer(accounts[1], amount, {from: accounts[0]})

        let balance = await mytoken.balanceOf(accounts[1])
        balance = web3.utils.fromWei(balance,'ether')
        assert.equal(balance,'1000',"Balance should be 1M tokens for contract creator")
    })

    it("test mint", async () => {

        let amount = web3.utils.toWei('1000','ether')
        await mytoken.mint(amount, {from: accounts[0]})

        let totalSupply = await mytoken.totalSupply()
        totalSupply = web3.utils.fromWei(totalSupply,'ether')

        assert.equal(totalSupply, '1000001000', 'not correct')

    })

    it("test burn", async () => {

        //total = 1000001000
        let amount = web3.utils.toWei('500000000','ether')
        await mytoken.burn(amount, {from: accounts[0]})

        let totalSupply = await mytoken.totalSupply()
        totalSupply = web3.utils.fromWei(totalSupply,'ether')
        assert.equal(totalSupply, '500001000', 'not correct')

    })

    it("test pause", async () => {

        //500001000

        let amount = web3.utils.toWei('500000000','ether')

        //pause
        await mytoken.pause()
        try{
            await mytoken.burn(amount, {from: accounts[0]})
        } catch(err){
            console.log("Paused! Go away!")
        }

        //unpause
        await mytoken.unpause()
        await mytoken.burn(amount, {from: accounts[0]})
        
        //check
        let totalSupply = await mytoken.totalSupply()
        totalSupply = web3.utils.fromWei(totalSupply,'ether')
        assert.equal(totalSupply, '1000', 'not correct')     
    })


})