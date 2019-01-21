var AlastriaPublicKeyRegistry = artifacts.require("../contracts/AlastriaPublicKeyRegistry.sol");

module.exports = function (deployer) {
    deployer.deploy(AlastriaPublicKeyRegistry);
};
