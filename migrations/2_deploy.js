const SGB = artifacts.require("SGB");
const SCVehicle = artifacts.require("SCVehicle");
module.exports = function(deployer) {
  deployer.deploy(SGB).then(function(){
  	return deployer.deploy(SCVehicle, SGB.address);
  });
};
