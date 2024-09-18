//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.24;

contract Airdrop {
  address baycNFTCONAddress = 0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D;
  address distributingTokenAddress;
  bytes32 rootHash;
  address airdropInitiator;

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
    // ROOT-HASH:: 0x011fa9c75858236ea7254e8e17ac66e6acce14e3ab099bcaec7544c5de36bcb0

  }
}