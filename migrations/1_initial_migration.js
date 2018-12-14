var AlastriaPublickeyRegistry = artifacts.require("./AlastriaPublickeyRegistry.sol");

module.exports = function (deployer) {
    deployer.deploy(AlastriaPublickeyRegistry);
};
