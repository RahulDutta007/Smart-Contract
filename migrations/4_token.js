const token = artifacts.require("token");
module.exports = function(deployer) {
  deployer.deploy(token,"Jesse","XJC","10000000000000000");
};