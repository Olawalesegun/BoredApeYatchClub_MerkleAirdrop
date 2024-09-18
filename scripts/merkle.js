const fsReader = require('fs');
const csv = require('csv-parser');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { getAddress, parseUnits, solidityPacked, keccak256: ethersKeccack256 } = require('ethers');
const path = require('path');

const whitelistedAddresses = path.join(__dirname, "../data", "airdroplist.csv");

const leaves = [];

fsReader.createReadStream(whitelistedAddresses)
.pipe(csv())
.on("data", (data) => {
 try{
  const addressOnEachStream = getAddress(data.address.trim());
  let amountOnEachStream = data.amount.toString().trim();
  amountOnEachStream = parseUnits(amountOnEachStream, 18);
  

  const hashedAddress = keccak256(solidityPacked(["address", "uint256"], [addressOnEachStream,amountOnEachStream]));

  leaves.push(hashedAddress.toString("hex"));
  console.log("Hashes ARE::: ", leaves);

 
 }catch(error) {
  console.error("Issues:::", error.message);
  console.error('Data with ish:::', data);
 }
})
.on("end", () => {
  const merkle = new MerkleTree(leaves, keccak256, {sortPairs: true});
  console.log("MERKLE:::", merkle);
  const rootHash = merkle.getHexRoot();
  console.log("ROOT HASH:::", rootHash);

  const proof = {}
  let i = 0;
  leaves.map((data) => {
    proof[i] = merkle.getHexProof(data);
    i++;
  })

  console.log("ALL OUR WHITELIST CSV PROOF ARE:::", proof);
})