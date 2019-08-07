const SafeMath = artifacts.require("SafeMath");
const token = artifacts.require("token");

module.exports = function(deployer) {
  deployer.deploy(SafeMath).then(function(){
  	return deployer.deploy(token, "Glacier", "XGC", "10000000");
  });
};
