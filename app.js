const express = require("express")
const Moralis = require("moralis").default
const { EvmChain } = require("@moralisweb3/evm-utils")
const address = require('./config')
const fs = require('fs/promises');

const app = express()
const port = 3000

const MORALIS_API_KEY = "Litot1VeP1MVW8qGOZmPGMUcRQvCf4P0zg9JwhxXFSpAVzRMZzgZeQnW5JVP5zYX"
const chain = EvmChain.ETHEREUM

async function getDemoData () {
        console.log('getdemo started');
        // Get native balance
        const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
          address,
          chain,
        })
      
        // Format the native balance formatted in ether via the .ether getter
        const native = nativeBalance.result.balance.ether
      
        // Get token balances
        const tokenBalances = await Moralis.EvmApi.token.getWalletTokenBalances({
          address,
          chain,
 //       limit: 10,
        })
      
        // Format the balances to a readable output with the .display() method
        const tokens = tokenBalances.result.map((token) => token.display())
        console.log('getdemo finished');
        return { native, tokens }
        
    }

// const interval = ms => {
//    return new Promise(setInterval(getDemoData(), ms))
// }

app.get("/demo",   (req, res) => {
//         async function printData () {
//             try {
//                 // Get and return the crypto data
//                const data = await getDemoData();
//  //               const data =await getDemoData()
//                 res.status(200)
//                 res.json(data)
//               } catch (error) {
//                 // Handle errors
//                 console.error(error)
//                 res.status(500)
//                 res.json({ error: error.message })
//               }
//         } 
//         printData();
  //     setInterval(printData, 3000);
  const createLog = async () => {
    const balance = await getDemoData();
    console.log(balance);
 //   const time = logTime();
 const objectParsed = JSON.stringify(balance);
    await fs.appendFile('readme.log',  objectParsed + '\n');
 //   res.end( balance);
  };
  setInterval(createLog, 5000);
})

const startServer = async () => {
  await Moralis.start({
    apiKey: MORALIS_API_KEY,
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

startServer()