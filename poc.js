var token = artifacts.require("./contracts/token.sol");
var vehicle = artifacts.require("./contracts/SCVehicle.sol");
var sgb = artifacts.require("./contracts/SGB.sol");
var safeMath = artifacts.require("./contracts/SafeMath.sol");
const chalk = require('chalk');
module.exports = async function(callback) {

	var tokenInstance;
	var SGBInstance;
	var vehicleInstance;

	var add = await web3.eth.getAccounts();

	var SGB_1;
	var SGB_2;
	var SGB_3;

	var SGB_1_User;
	var SGB_2_User;
	var SGB_3_User;

	var SGB_1_state;
	var SGB_2_state;
	var SGB_3_state;

	var SGB;
	var sgbFull;
	var vehicle_1;
	var vehicle_2;
	var vehicle_3;

	var Vehicle;
	var nearbyVehicle;
	var nearestVehicle;

	var da1 = "Disposal area 1";
	var da2 = "Disposal area 2";
	var da3 = "Disposal area 3";

	var DA = [da1, da2, da3];

	async function deployContracts(){
		console.log(chalk.underline.blue.bold("********DEPLOYING SMART CONTRACTS********\n"));

		tokenInstance = await token.deployed();
		console.log("Deployed Succesfully --[Token.sol]");
		
		SGBInstance = await sgb.deployed();
		console.log("Deployed Succesfully --[SGB.sol]");

		vehicleInstance = await vehicle.deployed(SGBInstance.address);
		console.log("Deployed Succesfully --[Vehicle.sol]");
		console.log(chalk.underline.blue.bold("\nDONE...\n"));	
	}

	async function initState(){
		console.log(chalk.underline.blue.bold("********INITIALIZING SMART GARBAGE BINS AND VEHICLES********\n"));

		SGB_1 = { ID: "1", loc: "Island 13, Sector 3, Salt Lake", status: "[To be sensed]", seg: "[To be sensed]"};
		SGB_2 = { ID: "2", loc: "Island 14, Sector 3, Salt Lake", status: "[To be sensed]", seg: "[To be sensed]"};
		SGB_3 = { ID: "3", loc: "Island 15, Sector 3, Salt Lake", status: "[To be sensed]", seg: "[To be sensed]"};
		

		vehicle_1 = {PK: add[5], loc: "Island 13, Sector 3, Salt Lake", status: "[To be sensed]"};
		vehicle_2 = {PK: add[6], loc: "Island 14, Sector 3, Salt Lake", status: "[To be sensed]"};
		vehicle_3 = {PK: add[7], loc: "Island 15, Sector 3, Salt Lake", status: "[To be sensed]"};

		Vehicle = [vehicle_1, vehicle_2, vehicle_3];

		SGB_1_User = add[1];
		SGB_2_User = add[2];
		SGB_3_User = add[3];

		SGB_1_state = [1, 6];		
		SGB_2_state = [5, 6];
		SGB_3_state = [8, 8];
		SGB = [ SGB_1, SGB_2, SGB_3];
		
		console.log(chalk.green.bold("Invoking smart contract Function: registerSGB() --[SGB.sol]"));		
		SGBInstance.registerSGB(SGB[0].ID, SGB[0].loc);//.then(res=>{console.log(res.logs[0].args)});
		SGBInstance.registerSGB(SGB[1].ID, SGB[1].loc);//.then(res=>{console.log(res.logs[0].args)});
		SGBInstance.registerSGB(SGB[2].ID, SGB[2].loc);//.then(res=>{console.log(res.logs[0].args)});
		console.log("Registering SGBs...Done\n")

		console.log("Registered SGBS are...");
		console.log(chalk.bold.red("ID: ",SGB_1.ID,", Location: ",SGB_1.loc,", Status: ",SGB_1.status,", Segregation status: ",SGB_1.seg));
		console.log(chalk.bold.red("ID: ",SGB_2.ID,", Location: ",SGB_2.loc,", Status: ",SGB_2.status,", Segregation status: ",SGB_2.seg));
		console.log(chalk.bold.red("ID: ",SGB_3.ID,", Location: ",SGB_3.loc,", Status: ",SGB_3.status,", Segregation status: ",SGB_3.seg));


		console.log(chalk.green.bold("\nInvoking smart contract Function: registerVehicle() --[Vehicle.sol]"));
		vehicleInstance.registerVehicle(Vehicle[0].PK,Vehicle[0].loc,Vehicle[0].status);
		vehicleInstance.registerVehicle(Vehicle[1].PK,Vehicle[1].loc,Vehicle[1].status);
		vehicleInstance.registerVehicle(Vehicle[2].PK,Vehicle[2].loc,Vehicle[2].status);
		console.log("Registering Vehicles...Done\n")

		console.log("Registered Vehicles are...");
		console.log(chalk.bold.red("Public Key: ",vehicle_1.PK,", Location: ",vehicle_1.loc,", Status: ",vehicle_1.status));
		console.log(chalk.bold.red("Public Key: ",vehicle_2.PK,", Location: ",vehicle_2.loc,", Status: ",vehicle_2.status));
		console.log(chalk.bold.red("Public Key: ",vehicle_3.PK,", Location: ",vehicle_3.loc,", Status: ",vehicle_3.status));

		da1 = "Disposal area sector 5/1";
		da2 = "Disposal area sector 5/2";
		da3 = "Disposal area sector 6";

		DA = [da1, da2, da3];


		console.log(chalk.underline.blue.bold("\nDONE...\n"));
	}

	async function WasteSeg(userPK, sgb, value){
		if (sgb.seg == "TRUE"){	

			console.log("Segregated waste in SGB where SGB ID:",sgb.ID,"\n");
			console.log(chalk.green.bold("Invoking smart contract Function: trasnferIncentive() --[Token.sol]"));
			console.log("Transfering incentive...Done");

			tokenInstance.transferIncentive(userPK, value, seg);
		}
	}

	async function SGBSensing(sgb, d, h){
		console.log(chalk.bold.green("\nInvoking Smart Contract Function: SGBStatus() --[SGB.sol]"));
		console.log("Sensing status of SGB with SGB ID:",sgb.ID);
		await SGBInstance.SGBStatus(sgb.ID, sgb.seg, d, h);
	}

	
	async function notifyVehicles(sgb){
		nearbyVehicle = [Vehicle[0], Vehicle[1]];
		console.log("Calculating nearby vehicles...Done");
		console.log("The nearby vehicles are...\n");

		console.log(chalk.bold.red("Public Key: ",nearbyVehicle[0].PK,", Location: ",nearbyVehicle[0].loc,", Status: ",nearbyVehicle[0].status));
		console.log(chalk.bold.red("Public Key: ",nearbyVehicle[1].PK,", Location: ",nearbyVehicle[1].loc,", Status: ",nearbyVehicle[1].status),"\n");

		vehicleInstance.SGBNotification(nearbyVehicle[0].PK, sgb.ID);
		console.log("\nSending SGB notification to nearby vehicle with public key:",chalk.bold.red(nearbyVehicle[0].PK),"...Sent");
		vehicleInstance.SGBNotification(nearbyVehicle[1].PK, sgb.ID);
		console.log("Sending SGB notification to nearby vehicle with public key:",chalk.bold.red(nearbyVehicle[1].PK),"...Sent");
	}

	async function monitorRequest(eachNearbyVehicle, s, wt){
		console.log(chalk.bold.green("Invoking smart contract Function: vehicleStatus() --[Vehicle.sol]"));
		await vehicleInstance.vehicleStatus(eachNearbyVehicle.PK,s,wt);//.then(res=>{console.log(res.logs[0].args)});;
		console.log("Updating vehicle status of nearby vehicle with public key:",chalk.bold.red(eachNearbyVehicle.PK),"...Done\n");
		
		console.log(chalk.bold.green("Invoking smart contract Function: getVehicleStatus() --[Vehicle.sol]"));
		eachNearbyVehicle = await vehicleInstance.getVehicleStatus(eachNearbyVehicle.PK);
		//console.log(eachNearbyVehicle);


		console.log("Updated nearby vehicle is...\n");
		console.log(chalk.bold.red("Public Key: ",eachNearbyVehicle[0],", Location: ",eachNearbyVehicle[1],", Status: ",eachNearbyVehicle[2]),"\n");

		console.log(chalk.bold.green("Invoking smart contract Function: requestResponse() --[Vehicle.sol]"));
		vehicleInstance.requestResponse(eachNearbyVehicle[0]);//.then(res=>{console.log(res.logs[0].args)});
		console.log("Responding to SGB notification by nearby vehicle with public key:",chalk.bold.red(eachNearbyVehicle[0]),"...Done\n");
		//console.log(2);
	}

	async function monitorResponse(sgb) {
		var flag = [];
		console.log(chalk.bold.green("Invoking smart contract Function: getRequestResponse() --[Vehicle.sol]"));
		var temp = await vehicleInstance.getRequestResponse(nearbyVehicle[0].PK, sgb.ID);
		temp = await vehicleInstance.getVehicleStatus(temp[0]);
		temp = {PK: temp[0], loc: temp[1], status: temp[2]};
		//console.log(temp);
		console.log("Checking response\n");

		flag.push(temp);

		console.log("Nearby vehicle with public key:",chalk.red.bold(temp.PK)," has responded\n");
		console.log(chalk.bold.green("Invoking smart contract Function: getRequestResponse() --[Vehicle.sol]"));
		var temp = await vehicleInstance.getRequestResponse(nearbyVehicle[1].PK, sgb.ID);
		temp = await vehicleInstance.getVehicleStatus(temp[0]);
		temp = {PK: temp[0], loc: temp[1], status: temp[2]};
		//console.log(temp);
		flag.push(temp);
		console.log("Checking response...Done\n");

		console.log("Nearby vehicle with public key:",chalk.red.bold(temp.PK)," has responded");
		nearestVehicle=flag[0];
		console.log("\nCalculating nearest vehicle...Done");
		console.log("Nearest vehicle is...");

		console.log(chalk.bold.red("Public Key: ",nearestVehicle.PK,", Location: ",nearestVehicle.loc,", Status: ",nearestVehicle.status));

		var routeCollect = "From Hudco to Tank 13, Sector 3";
		console.log("\nGenerating optimal route for collection...Done");
		console.log("Optimal route: ",chalk.yellow.bold(routeCollect));

		console.log(chalk.bold.green("\nInvoking smart contract Function: optimalRouteCollect() --[Vehicle.sol]"));
		vehicleInstance.optimalRouteCollect(nearestVehicle, routeCollect);
		console.log("Sending optimal route to nearest vehicle...Sent");
	} 

	async function collectWaste(nearestVehicle){
		console.log(chalk.bold.green("Invoking smart contract Function: getOptimalRouteCollect() --[Vehicle.sol]"));
		var flag = await vehicleInstance.getOptimalRouteCollect(nearestVehicle.PK);
		var sgb = {ID: flag[0], loc: flag[1], status: flag[2], seg: flag[3]};
		var routeCollect = flag[4];
		console.log("Getting optimal route for waste collection...Done");
		console.log("Waste collection by nearest vehicle with public key:", chalk.bold.red(nearestVehicle.PK),"...Done");
		SGBInstance.SGBStatus(sgb.ID, sgb.seg, 0, 0);
		console.log("Updating SGB status...Done\n");
		var s = 1;
		var wt = 60;
		console.log(chalk.bold.green("Invoking smart contract Function: vehicleStatus() --[Vehicle.sol]"));
		vehicleInstance.vehicleStatus(nearestVehicle.PK, s, wt);
		console.log("Updating nearest vehicle status...Done\n");
		console.log(chalk.bold.green("Invoking smart contract Function: getVehicleStatus() --[Vehicle.sol]"));
		nearestVehicle = await vehicleInstance.getVehicleStatus(nearestVehicle.PK);
		nearestVehicle = { PK:nearestVehicle[0], loc: nearestVehicle[1], status: nearestVehicle[2]};

		console.log(chalk.underline.blue.bold("\nDONE...\n"));
		if(nearestVehicle.status == "FULL")
		{
			console.log("Nearest vehicle status found FULL\n");	
			await disposeRoute(nearestVehicle);
			
		}	
	}

	async function disposeRoute(nearestVehicle){
		console.log(chalk.underline.blue.bold("********SEND OPTIMAL ROUTE FOR DISPOSAL********\n"));
		da=DA[0];
		console.log("Calculating nearest disposal area...Done");
		console.log("Disposal area: ",chalk.bold.red.bold(da));
		var routeDispose = "3 km tank 13, sector 3";
		console.log("\nGenerating optimal route for waste disposal...Done");
		console.log("Optimal route: ",chalk.bold.yellow(routeDispose));
		console.log(chalk.bold.green("\nInvoking smart contract Function: optimalRouteDispose() --[Vehicle.sol]"));
		vehicleInstance.optimalRouteDispose(nearestVehicle.PK, da, routeDispose);
		console.log("Sending optimal route for waste disposal to nearest vehicle...Done");
		console.log(chalk.underline.blue.bold("\nDONE...\n"));
	}

	async function wasteDispose(nearestVehicle){
		console.log(chalk.bold.green("\nInvoking smart contract Function: getOptimalRouteDispose() --[Vehicle.sol]"));
		var flag = await vehicleInstance.getOptimalRouteDispose(nearestVehicle.PK);
		console.log("Getting optimal route for waste disposal...Done");
		routeDispose = flag[0];
		da = flag[1];
		console.log("Waste Disposal by nearest vehicle with public key:",chalk.bold.red(nearestVehicle.PK),"...Done");
		console.log(chalk.bold.green("\nInvoking smart contract Function: vehicleStatus() --[Vehicle.sol]"));
		await vehicleInstance.vehicleStatus(nearestVehicle.PK,100,0);
		console.log("Updating nearest vehicle status...Done");
		nearestVehicle = await vehicleInstance.getVehicleStatus(nearestVehicle.PK);
		console.log("Updated nearest vehicle is...");
		console.log(chalk.bold.red("Public Key: ",nearestVehicle[0],", Location: ",nearestVehicle[1],", Status: ",nearestVehicle[2]));
	}

	async function print() {
		console.log("Hello");
	}	
	deployContracts().then(function(){
		initState().then(async function(){
			SGB[0].seg="TRUE";
			SGB[1].seg="FALSE";
			SGB[2].seg="FALSE";
			console.log(chalk.underline.blue.bold("********CHECK IF WASTE IN SGB IS SEGREGATED********\n"));
	   		WasteSeg(SGB_1_User,SGB[0],5);
	   		WasteSeg(SGB_2_User,SGB[1],5);
	   		WasteSeg(SGB_3_User,SGB[2],5);
	   		console.log(chalk.underline.blue.bold("\nDONE...\n"));
		}).then(async function(){
			console.log(chalk.underline.blue.bold("********SENSE SGB Status********\n"));
			SGBSensing(SGB[0], 1, 5);
			SGBSensing(SGB[1], 5, 5);
			SGBSensing(SGB[2], 7, 9);
			console.log("\nUpdated SGBs are...\n")
			var flag = await SGBInstance.getSGBStatus(SGB[0].ID);
			console.log(chalk.red.bold("ID: ", flag[0], ", Status: ", flag[1], ", Location: ", flag[2], ", Segregation Status: ", flag[3] ));
			flag = await SGBInstance.getSGBStatus(SGB[1].ID);
			console.log(chalk.red.bold("ID: ", flag[0], ", Status: ", flag[1], ", Location: ", flag[2], ", Segregation Status: ", flag[3] ));
			flag = await SGBInstance.getSGBStatus(SGB[2].ID);
			console.log(chalk.red.bold("ID: ", flag[0], ", Status: ", flag[1], ", Location: ", flag[2], ", Segregation Status: ", flag[3] ));
			console.log(chalk.underline.blue.bold("\nDONE...\n"));
		}).then(async function(){
			
			sgbFull = await SGBInstance.getSGBStatus(SGB[0].ID);
			if(sgbFull[1]=="FULL")
			{
				console.log("Found SGB Status FULL of SGB with SGB ID:",sgbFull[0], "\n");
				console.log(chalk.underline.blue.bold("********NOTIFY NEARBY VEHICLES********\n"));
				console.log(chalk.bold.green("Invoking Smart Contract Function: SGBNotification() --[Vehicle.sol]"));
				SGB[0].ID=sgbFull[0];
				SGB[0].status=sgbFull[1];
				SGB[0].loc=sgbFull[2];
				SGB[0].seg=sgbFull[3];
				notifyVehicles(SGB[0]);
				console.log(chalk.underline.blue.bold("\nDONE...\n"));
			}
			sgbFull = {ID: sgbFull[0], status: sgbFull[1], loc: sgbFull[2], seg: sgbFull[3]};
			
		}).then(async function(){
			console.log(chalk.underline.blue.bold("********MONITOR AND RESPOND TO REQUEST********\n"));
			
			await monitorRequest(nearbyVehicle[0],15,15);
			await monitorRequest(nearbyVehicle[1],15,15);
			console.log(chalk.underline.blue.bold("\nDONE...\n"));
		}).then(async function(){
			console.log(chalk.underline.blue.bold("********MONITOR RESPOSES FROM VEHICLES********\n"));
			await monitorResponse(sgbFull);
			console.log(chalk.underline.blue.bold("\nDONE...\n"));			
		}).then(async function(){
			console.log(chalk.underline.blue.bold("********COLLECT WASTE********\n"));
			await collectWaste(nearestVehicle);
		}).then(async function(){
			console.log(chalk.underline.blue.bold("********DISPOSE WASTE INTO DISPOSAL AREA********\n"));
			await wasteDispose(nearestVehicle);
			console.log(chalk.underline.blue.bold("\nDONE...\n"));
		});
	});
}