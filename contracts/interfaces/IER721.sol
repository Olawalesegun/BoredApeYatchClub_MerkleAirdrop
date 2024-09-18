//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IER721 {
  function balanceOf(address _owner) external view returns (uint256);
  function ownerOf(uint256 _tokenId) external view returns (address);
}