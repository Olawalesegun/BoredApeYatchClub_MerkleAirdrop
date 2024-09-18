import hre, { ethers } from "hardhat";
import { expect } from "chai";
import { Airdrop } from "../typechain-types/Airdrop";
import { AirdropToken } from "../typechain-types/AirdropToken";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Airdrop", function () {

  // async function useAsGlobal(){
  //   const AirdropContract = await hre.ethers.getContractFactory("Airdrop");
  //   AirdropContract.deploy()
  // }
  let airdrop: Airdrop;
  let distributingToken: AirdropToken;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let merkleRoot: string;
  const amount = ethers.parseEther("10");

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const AirdropTokenFactory = await ethers.getContractFactory("AirdropToken");
    distributingToken = await AirdropTokenFactory.deploy() as AirdropToken;
    merkleRoot = ethers.keccak256(ethers.defaultAbiCoder.encode(["address", "uint256"], [user1.address, amount]));
    const AirdropFactory = await ethers.getContractFactory("Airdrop");
    airdrop = await AirdropFactory.deploy(distributingToken.getAddress(), merkleRoot) as Airdrop;
    await distributingToken.transfer(airdrop.getAddress(), amount);
  });

  it("should allow a user to claim an airdrop if eligible", async function () {
    await distributingToken.approve(airdrop.getAddress(), amount);
    await airdrop.connect(user1).claimAirdrop(amount, [merkleRoot]);
    const participant = await airdrop.participants(user1.getAddress());
    expect(participant.tokenReceived).to.equal(amount);
    expect(participant.userCanReceiveAirdrop).to.be.true;
  });

  it("should revert when user tries to claim without owning a BAYC NFT", async function () {
    await expect(airdrop.connect(user2).claimAirdrop(amount, [merkleRoot])).to.be.revertedWith("YouDontHaveBAYCMyFriend");
  });

  it("should revert when user tries to claim twice", async function () {
    await distributingToken.approve(airdrop.getAddress(), amount);
    await airdrop.connect(user1).claimAirdrop(amount, [merkleRoot]);
    await expect(airdrop.connect(user1).claimAirdrop(amount, [merkleRoot])).to.be.revertedWith("YouHaveClaimedAlready");
  });

  it("should revert when claiming with an invalid amount", async function () {
    await expect(airdrop.connect(user1).claimAirdrop(0, [merkleRoot])).to.be.revertedWith("AmountIsNotValid");
  });

  it("should revert when claiming with an invalid merkle proof", async function () {
    await distributingToken.approve(airdrop.getAddress(), amount);
    await expect(airdrop.connect(user1).claimAirdrop(amount, ["invalid_proof"])).to.be.revertedWith("NotEligibleForAirdrop");
  });

  it("should allow user to verify NFT claim", async function () {
    const canClaim = await airdrop.connect(user1).verifyUserNFTClaim();
    expect(canClaim).to.be.true;
  });
});
  