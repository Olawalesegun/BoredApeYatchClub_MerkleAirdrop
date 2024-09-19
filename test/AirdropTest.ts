import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import hre, { ethers } from "hardhat";
import { expect } from "chai";
// import { Airdrop } from "../typechain-types/Airdrop";
// import { AirdropToken } from "../typechain-types/AirdropToken";
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import keccak256 from "keccak256";

describe("Airdrop", function () {

  async function deployAirdropToken(){
    const [ owner ]= await ethers.getSigners();
    const TokenCon = await ethers.getContractFactory("AirdropToken");
    const token = await TokenCon.deploy();

    return { token, owner };
  }

  async function deployAsGlobal() {
    // const TOKEN = 0x29E7b72825E0F593f22487fA87230A68BCF0DCDD;
    // const tokenAddress = await ethers.getImpersonatedSigner("0x011fa9c75858236ea7254e8e17ac66e6acce14e3ab099bcaec7544c5de36bcb0");
    const { token }= await loadFixture(deployAirdropToken);
    const [owner] = await ethers.getSigners();
    const REWARDING_TOKEN_ADDRESS = token.getAddress();
    const confirmedAirdropReceiver = await ethers.getImpersonatedSigner("0x11aF10451E3d86fD95E83443dbe0581F4532744B");

    const merkleRoot = "0x011fa9c75858236ea7254e8e17ac66e6acce14e3ab099bcaec7544c5de36bcb0";
    const airdropCon = await ethers.getContractFactory("Airdrop");
    const airdpCn = await airdropCon.deploy(token, merkleRoot);
    
    const airdropReceiverProof = [
      "0x4bbf10b9eade8441f14f7fa3615d4ec0a3f53f0f6f69512c23a10a56a4b97d32",
      "0x95465b6895073b31aa853da4c59e008c2fecb9efc1a47c813a5153280ea13dca",
      "0x4a35bbba156053fbfa132555dd0de89dd49b36261ed8250a4f6f83ec7ecb7d8b",
      "0x03f823922beea17de8cff4674d99ade4b75eef92bda2291464684001950a2fd7"
    ]
    const BAYCADDRESS = await ethers.getSigner("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D");
    const tokenToBeDistributed = await ethers.getSigner("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D");

    return {
      REWARDING_TOKEN_ADDRESS,
      confirmedAirdropReceiver,
      merkleRoot,
      airdpCn,
      airdropReceiverProof,
      BAYCADDRESS,
      tokenToBeDistributed,
      owner
    }
  }

  describe("Deployment", function(){
    it("should return the baycNFTADDRESS", async function(){
      const {BAYCADDRESS, airdpCn } = await loadFixture(deployAsGlobal);
      const ardropBayc = await airdpCn.baycNFTCONAddress();
      expect(ardropBayc).to.equal(BAYCADDRESS);
    })

    it("Should test that distributing token is same as we wished", async function(){
      const { BAYCADDRESS, airdpCn} = await loadFixture(deployAsGlobal);
      const ardropBayc = await airdpCn.baycNFTCONAddress();

      expect(ardropBayc).to.equal(BAYCADDRESS);
    })

    it("should test to confirm the RootHash", async function(){
      const {airdpCn, merkleRoot} = await loadFixture(deployAsGlobal);
      const airdrpBayc = await airdpCn.rootHash();

      expect(airdrpBayc).to.equal(merkleRoot);
    })

    it("should test to confirm the initiator", async function(){
      const {airdpCn, owner} = await loadFixture(deployAsGlobal);
      const airdrpBayc = await airdpCn.airdropInitiator();

      expect(airdrpBayc).to.equal(owner);
    })

    it("should test to confirm the content of the map upon deployment is empty", async function(){
      const {airdpCn} = await loadFixture(deployAsGlobal);
      const [owner, signer1] = await ethers.getSigners();
      const airdrp = await airdpCn.participants(signer1.address);

      expect(airdrp.nonFungTokenCount).to.be.equal(0);
    })
  }) 

  // it("should test deployment", async function(){
  //   const { TOKEN, tokenAddress, merkleRoot, airdropCon }= await loadFixture(deployAsGlobal);

  //   airdropCon.
  // })



 

  // async function deployAsGlobal(){
  //   // const {token} = await loadFixture(deployAirdropToken);
  //   const [owner, user1, user2, user3] = await ethers.getSigners();

  //   const TOK_ADDRESS = 0x29E7b72825E0F593f22487fA87230A68BCF0DCDD;
  //   const MERKLE_ROOT = 0x011fa9c75858236ea7254e8e17ac66e6acce14e3ab099bcaec7544c5de36bcb0;

  //   const airdropCon = await ethers.getContractFactory("Airdrop");
  //   const amountOfEther = await ethers.parseEther("20");
  //   // ethers.keccak256(ethers.AbiCoder(["address", "uint256"], []));



  //   // airdropCon.deploy(token, );
  // }

  // TOK_ADDRESS ::: 0x29E7b72825E0F593f22487fA87230A68BCF0DCDD

  // async function useAsGlobal(){
  //   const AirdropContract = await hre.ethers.getContractFactory("Airdrop");
  //   AirdropContract.deploy()
  // }
  // let airdrop: Airdrop;
  // let distributingToken: AirdropToken;
  // let owner: SignerWithAddress;
  // let user1: SignerWithAddress;
  // let user2: SignerWithAddress;
  // let merkleRoot: string;
  // const amount = ethers.parseEther("10");

  // beforeEach(async function () {
  //   [owner, user1, user2] = await ethers.getSigners();
  //   const AirdropTokenFactory = await ethers.getContractFactory("AirdropToken");
  //   distributingToken = await AirdropTokenFactory.deploy() as AirdropToken;
  //   merkleRoot = ethers.keccak256(ethers.AbiCoder.encode(["address", "uint256"], [user1.address, amount]));
  //   const AirdropFactory = await ethers.getContractFactory("Airdrop");
  //   airdrop = await AirdropFactory.deploy(distributingToken.getAddress(), merkleRoot) as Airdrop;
  //   await distributingToken.transfer(airdrop.getAddress(), amount);
  // });

  // it("should allow a user to claim an airdrop if eligible", async function () {
  //   await distributingToken.approve(airdrop.getAddress(), amount);
  //   await airdrop.connect(user1).claimAirdrop(amount, [merkleRoot]);
  //   const participant = await airdrop.participants(user1.getAddress());
  //   expect(participant.tokenReceived).to.equal(amount);
  //   expect(participant.userCanReceiveAirdrop).to.be.true;
  // });

  // it("should revert when user tries to claim without owning a BAYC NFT", async function () {
  //   await expect(airdrop.connect(user2).claimAirdrop(amount, [merkleRoot])).to.be.revertedWith("YouDontHaveBAYCMyFriend");
  // });

  // it("should revert when user tries to claim twice", async function () {
  //   await distributingToken.approve(airdrop.getAddress(), amount);
  //   await airdrop.connect(user1).claimAirdrop(amount, [merkleRoot]);
  //   await expect(airdrop.connect(user1).claimAirdrop(amount, [merkleRoot])).to.be.revertedWith("YouHaveClaimedAlready");
  // });

  // it("should revert when claiming with an invalid amount", async function () {
  //   await expect(airdrop.connect(user1).claimAirdrop(0, [merkleRoot])).to.be.revertedWith("AmountIsNotValid");
  // });

  // it("should revert when claiming with an invalid merkle proof", async function () {
  //   await distributingToken.approve(airdrop.getAddress(), amount);
  //   await expect(airdrop.connect(user1).claimAirdrop(amount, ["invalid_proof"])).to.be.revertedWith("NotEligibleForAirdrop");
  // });

  // it("should allow user to verify NFT claim", async function () {
  //   const canClaim = await airdrop.connect(user1).verifyUserNFTClaim();
  //   expect(canClaim).to.be.true;
  // });
});
  