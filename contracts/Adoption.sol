pragma solidity ^0.4.17;

contract Adoption {
  // An array of our adopters, limited to 16 addresses
  address[6] public adopters;  

  // Pet adoption
  function adopt (uint petId) public returns (uint) {
    require(petId >= 0 && petId <= 5); // enforces our 16 addresses

    adopters[petId] = msg.sender; // the sender of the adoption message gets the pet!

    return petId;
  }

  // Retrieve the adopters
  function getAdopters() public view returns (address[6]) {
    return adopters;  
  }




}