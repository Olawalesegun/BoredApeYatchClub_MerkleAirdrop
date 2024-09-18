//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Airdrop {
  address baycNFTCONAddress;
  address distributingTokenAddress;
  bytes32 rootHash;
  address airdropInitiator;

  struct AirdropParticipantDetails {
    uint256 nonFungTokenCount;
    uint256 tokenReceived;
    bool userCanReceiveAirdrop;
  }

  mapping(address => AirdropParticipantDetails) participants;

  error AddressZeroCannotBeAllowed();
  error AmountIsNotValid();
  error NotEligibleForAirdrop();
  error YouHaveClaimedAlready();
  error YouDontHaveBAYCMyFriend();
  error ThisTransferFailed();

  constructor(address tokenAddress, bytes32 merkleRoot){
    if(msg.sender == address(0)){
      revert AddressZeroCannotBeAllowed();
    }

    if(tokenAddress == address(0)){
      revert AddressZeroCannotBeAllowed();
    }

    distributingTokenAddress = tokenAddress;
    rootHash = merkleRoot;
    airdropInitiator = msg.sender;
    baycNFTCONAddress = 0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D;
    // ROOT-HASH-GOTTEN:: 0x011fa9c75858236ea7254e8e17ac66e6acce14e3ab099bcaec7544c5de36bcb0
  }

  function claimAirdrop(uint256 amount, bytes32[] calldata merkleProof) external {
    if(msg.sender == address(0)) {
      revert AddressZeroCannotBeAllowed();
    }
    if(amount <= 0) {
      revert AmountIsNotValid();
    }

    AirdropParticipantDetails storage participant = participants[msg.sender];

    bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
    if (!MerkleProof.verify(merkleProof, rootHash, leaf)) {
        revert NotEligibleForAirdrop();
    }

    if(participant.userCanReceiveAirdrop){
      revert YouHaveClaimedAlready();
    }
    
    if(!ownsBAYCNFT(msg.sender)){
      revert YouDontHaveBAYCMyFriend();
    }

    participant.tokenReceived += amount;
    participant.userCanReceiveAirdrop = true;

    if(!IERC20(distributingTokenAddress).transfer(msg.sender, amount)){
      revert ThisTransferFailed();
    }    
  }

 function ownsBAYCNFT(address user) internal view returns (bool) {
        IERC721 baycNFTContract = IERC721(baycNFTCONAddress);
        uint256 balance = baycNFTContract.balanceOf(user);
        return balance > 0;
    }

    function verifyUserNFTClaim() external view returns (bool) {
      if(msg.sender == address(0)){
        revert AddressZeroCannotBeAllowed();
      }
        return ownsBAYCNFT(msg.sender);
    }
}