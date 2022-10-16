const express = require('express');
const app = express();
//cryptocurrencies API software
const Moralis = require("moralis").default;
//L:ibrary for working interval with promise propertly
const interval = require('interval-promise');
const fs = require('fs/promises');
const format = require('node.date-time');
const { EvmChain } = require("@moralisweb3/evm-utils");
//wallet address
const address = require('./config'); 
const port = 3000;

const MORALIS_API_KEY = "Litot1VeP1MVW8qGOZmPGMUcRQvCf4P0zg9JwhxXFSpAVzRMZzgZeQnW5JVP5zYX";
const chain = EvmChain.ETHEREUM;

//connect Moralis server
const startMoralis = async () => {
  await Moralis.start({
    apiKey: MORALIS_API_KEY,
  });
};
startMoralis();

//get wallet info
async function getDemoData () {
  console.log('getdemo started');
  // Get native balance
  const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
    address,
    chain,
  });

  // Format the native balance formatted in ether via the .ether getter
  const native = nativeBalance.result.balance.ether;

  // Get token balances
  const tokenBalances = await Moralis.EvmApi.token.getWalletTokenBalances({
    address,
    chain,
  });

  // Format the balances to a readable output with the .display() method
  const tokens = tokenBalances.result.map((token) => token.display());

  // Get tokens quantity
  const tokensQuantity = tokens.length;

  console.log('getdemo finished');

  return { native, tokensQuantity, tokens };
};

app.get('/demo', (req, res) => {

//get time loged   
  let logTime = () => {
    return new Date().format("Y-M-d H:M:S")+' ';
  };
//app view  
  interval(async () => {
    const objectParsed = await getDemoData();
    let time = logTime();
    const balance = JSON.stringify(objectParsed);
    await fs.writeFile('readme.log', time + balance);
    res.end(time + balance);
}, 60000, {stopOnError: false});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});