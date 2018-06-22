pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
  Adoption adoption = Adoption(DeployedAddresses.Adoption());

  // Test that the adopt() function works, it will return pet id passed to it.
  function testUserCanAdoptPet() public {
    uint returnedId = adoption.adopt(2);
    uint expected = 2;

    Assert.equal(returnedId, expected, "Adoption of pet ID 2 should be recorded.");
  }

  // Test getting a pet's owner
  function testGetAdopterAddressByPetId() public {
    // Expected owner is this contract
    address expected = this;

    address adopter = adoption.adopters(2);

    Assert.equal(adopter, expected, "Owner of pet ID 2 should be recorded.");
  }

  // Test retrieving all pet owners
  function testGetAdopterAddressByPetIdInArray() public {
    // Expected owner is this contract
    address expected = this;

    // Store the adopters array
    address[6] memory adopters = adoption.getAdopters(); // memory attribute tells solidity to temp store value in memory instead of contracts storage

    Assert.equal(adopters[2], expected, 'Owner of pet ID 2 should be recorded in adopters array.');
  }
}