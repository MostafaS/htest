import { Alchemy, Network } from "alchemy-sdk";

// alchemy config
const config = {
  apiKey: "5s3WOY3GmTQMtQN5iMaibPeMsQ6D4-Ue",
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

// using alchemy NFT api, we get all of the owners of the collection 1 (address1) and collection 2 (address2)
// then we cross check them against each other to find the addresses which holds at least one of each collection
// then return the result
export async function getOwnersFast(address1, address2) {
  // Get owners
  let owners1 = await alchemy.nft.getOwnersForContract(address1);
  let owners2 = await alchemy.nft.getOwnersForContract(address2);
  let owners1Set = new Set(owners1.owners);
  let owners2Set = new Set(owners2.owners);
  let finalResult = new Set();
  for (const add1 of owners1Set) {
    if (owners2Set.has(add1)) finalResult.add(add1);
  }
  return finalResult;
  //   console.log(owners);
}
