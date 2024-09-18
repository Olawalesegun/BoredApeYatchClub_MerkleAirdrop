//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Airdrop {
  address baycNFTCONAddress = 0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D;
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
    // ROOT-HASH-GOTTEN:: 0x011fa9c75858236ea7254e8e17ac66e6acce14e3ab099bcaec7544c5de36bcb0

  }

  function claimAirdrop()external {

  }

  function verifyUserNFTClaim() external {

  }
}