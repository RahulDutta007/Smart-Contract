var token = artifacts.require("./contracts/token.sol");
var vehicle = artifacts.require("./contracts/SCVehicle.sol");
var sgb = artifacts.require("./contracts/SGB.sol");
var safeMath = artifacts.require("./contracts/SafeMath.sol");
module.exports = async function(callback) {

	var tokenInstance;
	var SGBInstance;
	var vehicleInstance;

	var add = await web3.eth.getAccounts();

	console.log("********DEPLOYING SMART CONTRACTS********\n");

	tokenInstance = await token.deployed();
	console.log("Deployed Succesfully --[Token.sol]");
	
	SGBInstance = await sgb.deployed();
	console.log("Deployed Succesfully --[SGB.sol]");

	vehicleInstance = await vehicle.deployed(SGBInstance.address);
	console.log("Deployed Succesfully --[Vehicle.sol]");
	console.log("\nDONE...\n");

	var s = await tokenInstance.initialSupply();
	console.log(s.toString());
	console.log("********INITIALIZING SMART GARBAGE BINS********\n");
	console.log("Function: initSGB()\n");

	var SGB_1 = { ID: "1", loc: "Island 13, Sector 3, Salt Lake", status: "[To be sensed]", seg: "[To be sensed]"};
	var SGB_2 = { ID: "2", loc: "Island 14, Sector 3, Salt Lake", status: "[To be sensed]", seg: "[To be sensed]"};
	var SGB_3 = { ID: "3", loc: "Island 15, Sector 3, Salt Lake", status: "[To be sensed]", seg: "[To be sensed]"};
	
	var SGB_1_User = add[1];
	var SGB_2_User = add[2];
	var SGB_3_User = add[3];


	var SGB_1_state = [1, 6];
	
	
	var SGB_2_state = [5, 6];
	var SGB_2_seg = "FALSE";
	
	var SGB_3_state = [8, 8];


	var SGB = [ SGB_1, SGB_2, SGB_3];
	console.log("Executing Smart Contract Function: registerSGB() --[SGB.sol]");
	console.log("Displaying registered SGB\n");
	SGB.forEach(function(eachSGB) {
		SGBInstance.registerSGB(eachSGB.ID, eachSGB.loc);
		console.log("SGB:", eachSGB, "\n");
	});
	
	console.log("\nDONE...\n");

	console.log("********DUMP WASTE INTO SGB********\n");
	console.log("Function: DumpWaste() \n");

	console.log("User with public key:", add[1]," dumps waste in SGB where SGB.ID = ", SGB_1.ID);	
	console.log("User with public key:", add[2]," dumps waste in SGB where SGB.ID = ", SGB_2.ID);
	console.log("User with public key:", add[3]," dumps waste in SGB where SGB.ID = ", SGB_3.ID);

	console.log("\nDONE...\n");


	console.log("********CHECKING SEGREGATION STATUS********\n");
	console.log("Function: WasteSeg()\n");

	SGB[0].seg = "TRUE";
	SGB[1].seg = "FALSE";
	SGB[2].seg = "FALSE";

	

	/*console.log("Executing SGBStatus() --[SGB.sol]...");
	SGBInstance.SGBStatus(SGB_1.id, SGB_1_seg, SGB_1_state[0], SGB_1_state[0]);
	SGBInstance.SGBStatus(SGB_2.id, SGB_1_seg, SGB_2_state[0], SGB_2_state[0]);
	SGBInstance.SGBStatus(SGB_3.id, SGB_1_seg, SGB_3_state[0], SGB_3_state[0]);
	console.log("Updating...Done\n");

	console.log("\nDONE...\n");

	/*console.log("Registering SGB");
	await SGBInstance.registerSGB("1","bl");
	console.log("Registering done");

	console.log("Setting SGB Status");
	await SGBInstance.SGBStatus("1","TRUE",1,5).then(res=>{console.log(res.logs[0].args)});
	console.log("Done setting SGB Status");

	console.log("Setting address");
	var add = await web3.eth.getAccounts();
	console.log("Done Setting address");

	console.log("Registering Vehicle");
	await vehicleInstance.registerVehicle(add[1],"vl","AVAILABLE").then(res=>{console.log(res.logs[0].args)});
	console.log("Done Registering Vehicle");

	console.log("Sending SGB Notification");
	await vehicleInstance.SGBNotification(add[1],"1").then(res=>{console.log(res.logs[0].args)});
	console.log("Done Sending SGB Notification");*/

}