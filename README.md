# Technical test

Here we have 3 different api end point in order to address the task

# 1. Using Alchemy NFT API

- # endpoint is: /api/getOwnersFast <br/>
  this will use alchemy NFT API to get all owners of each collection and then we will<br/>
  cross check addresses against each other to find the similar one and show the result.<br/>
  since reading from blockchain is slow, this will give us the result fast.<br/>
  <br/>

# 2. Using events

- # endpoint is: /api/getOwnersSlow <br/>
  this will use each conract transfer event from address 0 (minted tokens) to find all tokenIDs<br/>
  then we will use the total count of tokenIDs to get their current owners. we do this for both contracts<br/>
  then we will cross check them against each other to find addresses which hold at least one of each. <br/>
  since reading from blockchain is slow, this will take some time to finish, but you can see the result<br/>
  on the console.

# 3. owners balance

- # endpoint is: /api/getOwnersBalance <br/>
  using alchemy API we get all the addresses which hold at least one of each collection (#1)<br/>
  then we use infura provider to get balance of each address and return the result to the client.<br/>
  due to the slow blockchain reading, it will take some time, but you can follow the process in the console<br/>
  while its been prepared.
