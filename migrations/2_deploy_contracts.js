var Adoption = artifacts.require("Adoption");

module.exports = function(deployer) {
  // Depeloy the latest version of the contract
  deployer.deploy(Adoption);
};