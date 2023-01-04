import ethers from "ethers";
import { abi } from "./abi.js"; // ERC-721 openzeppelin ABI

// infura endpoint
const provider_mainnet =
  "https://mainnet.infura.io/v3/69a978fad6ce45f8b3c0fd577fdd2940";
// "https://eth-mainnet.g.alchemy.com/v2/5s3WOY3GmTQMtQN5iMaibPeMsQ6D4-Ue";

// here we get all the current owners of all the tokens that has been issued
async function getOwners(contract) {
  // First find the mint count which is equal to the token count
  const transferFilter = contract.filters.Transfer(
    "0x0000000000000000000000000000000000000000",
    null,
    null
  );
  // getting all the transfer event which initiated from address 0 (minted)
  const tokens = await contract.queryFilter(transferFilter);
  // getting the total size of it
  const tokenCount = tokens.length;

  // Iterate over tokens and store owner addresses in an array
  // using set to eliminate the repetitive ones
  let owners = new Set();
  for (let i = 0; i < tokenCount; i++) {
    // find the all transfers of the token
    // from null` to `null` so we get all the transfers of `tokenId`
    const transferFilter = contract.filters.Transfer(
      null,
      null,
      parseInt(tokens[i].args.tokenId)
    );
    const tokenTransfers = await contract.queryFilter(transferFilter);

    // `args.to` of the last element gives the current owner of issued token
    let lastTransfer = tokenTransfers[tokenTransfers.length - 1];
    let currentOwner = lastTransfer.args.to;
    process.stdout.write("\r\x1B[K"); // Clear the current line and move the cursor to the beginning of the line
    process.stdout.write(
      `BlockNumber =>  ${lastTransfer.blockNumber} for token ID ${tokens[i].args.tokenId} out of ${tokenCount}`
    );
    // If the address has already found before, don't add it...
    owners.add(currentOwner);
  }

  return owners;
}

// by reading emited events we find all the owners of the tokens in each collection
export async function getOwnersSlow() {
  console.log("Checking contracts for ERC721 token holders...");
  const provider = new ethers.providers.JsonRpcProvider(provider_mainnet);

  const contractAddress1 = "0x1A92f7381B9F03921564a437210bB9396471050C";
  const contract1 = new ethers.Contract(contractAddress1, abi, provider);

  const contractAddress2 = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
  const contract2 = new ethers.Contract(contractAddress2, abi, provider);

  const contract1_holders = await getOwners(contract1);
  const contract2_holders = await getOwners(contract2);
  console.log("Contract 1 holders size: ", contract1_holders.size);
  console.log("Contract 2 holders size: ", contract2_holders.size);

  console.log("Got all holders, cheking for shared addresses...");
  let final_result = new Set();
  for (const add1 of contract1_holders) {
    final_result.add(add1);
  }

  // if the final result length is more than zero, we will show the length of the array
  // which is the total number of addresses which hold at least one of each collection
  if (final_result.size > 0) {
    console.log(
      `There are ${final_result.size} addresses has at least of a each collections' token\nHere are all addresses`
    );
    console.log(final_result.getByIdx(1));
  } else {
    console.log(
      "There are no address which has at least one of each collections' token",
      final_result
    );
  }

  // returning the result
  return final_result;
}
