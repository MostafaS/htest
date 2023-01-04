import express from "express";
import ethers from "ethers";
import { getOwnersFast } from "./fast.js";
import { getOwnersSlow } from "./slow.js";

const app = express();
const BAYC = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
const COOL = "0x1A92f7381B9F03921564a437210bB9396471050C";
const provider_mainnet =
  "https://mainnet.infura.io/v3/69a978fad6ce45f8b3c0fd577fdd2940";
//   "https://eth-mainnet.g.alchemy.com/v2/5s3WOY3GmTQMtQN5iMaibPeMsQ6D4-Ue";
//   "https://rpc.ankr.com/eth";
const provider = new ethers.providers.JsonRpcProvider(provider_mainnet);

// this using alchemy API, get all current owners and cross check
// them to find those addresses that have at least one of each collection
app.get("/api/getOwnersFast", async (req, res) => {
  const ownersSet = await getOwnersFast(BAYC, COOL);
  let response = Array.from(ownersSet);
  res.send({ status: "OK", data: response });
});

// here, first using alchemy API we get all the owners, then using infura provider, we get owners balance
app.get("/api/getOwnersBalance", async (req, res) => {
  const ownersSet = await getOwnersFast(BAYC, COOL);
  let response = Array.from(ownersSet);
  const ownersBalance = await getBalance(response);
  res.send({ status: "OK", data: ownersBalance });
});

// this will read from events of those smart contracts to get all current owners and cross check
// them to find those addresses that have at least one of each collection
app.get("/api/getOwnersSlow", async (req, res) => {
  let ownersSet = await getOwnersSlow(BAYC, COOL);
  const response = Array.from(ownersSet);
  res.send({ status: "OK", data: response });
});

// helper function to get balance of all the addresses in the passed parameters (add_list)
// then using infura provider, we will get balances of all addresses, since reading from blockchain is slow
// it will take some time to get all of them (it around 600 addresses).
// you can check the balances on the console though
async function getBalance(add_list) {
  let final_result = [{}];
  console.log("List size is ", add_list.length);
  for (let i = 0; i < add_list.length; i++) {
    const balance = ethers.utils.formatEther(
      await provider.getBalance(add_list[i])
    );
    console.log("Balance: ", balance);
    final_result.push({
      address: add_list[i],
      balance: balance,
    });
  }

  return final_result;
}

// starting the server
app.listen(3000, () => {
  console.log("API endpoint listening on port 3000!");
});
