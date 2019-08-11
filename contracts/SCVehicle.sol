pragma solidity >=0.4.19 <0.6.0;

import "./SGB.sol";

contract SCVehicle {
	struct Vehicles {
		address PK;
		string loc;
		string status;
	}

	struct Bins {
		string ID;
		string loc;
		string status;
		string seg;
	}

	struct Notification {
		Vehicles vehicle;
		Bins bin;
	}

	struct Response {
		Notification notify;
		string resp;
	}

	struct RouteCollect {
		Notification notify;
		string route;
	}

	struct RouteDispose {
		Vehicles vehicle;
		string disposalArea;
		string route;

	}

	event SGBNotificationEvent(address PK, string vehicleLoc, string vehicleStatus, string binID, string binStatus, string binLoc, string binSeg);
	event ResponseEvent(address PK, string vehicleLoc, string vehicleStatus, string binID, string binStatus, string binLoc, string binSeg, string resp);
	event OptimalRouteCollectEvent(address PK, string vehicleLoc, string vehicleStatus, string binID, string binStatus, string binLoc, string binSeg, string route);
	event OptimalRouteDisposeEvent(address PK, string vehicleLoc, string vehicleStatus, string disposalArea, string route);
	event VehicleStatusEvent(address PK, string vehicleLoc, string vehicleStatus);
	event RegisterVehicleEvent(address PK, string vehicleLoc, string vehicleStatus);

	mapping (address => Vehicles) vehicle;
	mapping (address => Notification) sgbNotification;
	mapping (address => string) vehicleSpace;
	mapping (address => string) vehicleWeight;
	mapping (address => Response) response;
	mapping (address => RouteCollect) routeCollect;
	mapping (address => RouteDispose) routeDispose;

	string vehicleStatusFull = "FULL";
	string vehicleStatusAvailable = "AVAILABLE";
	string respTrue = "READY";
	string respFalse = "NOT READY";

	uint256 constant vehicleThresholdWeight = 50;
	uint256 constant vehicleThresholdSpace  = 10;

	SGB sgb;
    constructor(SGB _sgb) public {	
    	sgb = _sgb;
    }

    function registerVehicle(address _vehiclePK, string memory _vehicleLoc, string memory _vehicleStatus) public {
    	vehicle[_vehiclePK] = Vehicles(_vehiclePK, _vehicleLoc, _vehicleStatus);
    	emit RegisterVehicleEvent(vehicle[_vehiclePK].PK, vehicle[_vehiclePK].loc, vehicle[_vehiclePK].status);
    }

    function SGBNotification(address _vehiclePK, string memory _binID) public {
    	(string memory ID, string memory status, string memory loc, string memory seg) = sgb.getSGBStatus(_binID);
    	Vehicles storage v = vehicle[_vehiclePK];

    	sgbNotification[_vehiclePK].vehicle.PK = v.PK;
    	sgbNotification[_vehiclePK].vehicle.loc = v.loc;
    	sgbNotification[_vehiclePK].vehicle.status = v.status;

    	sgbNotification[_vehiclePK].bin.ID = ID;
    	sgbNotification[_vehiclePK].bin.loc = loc;
    	sgbNotification[_vehiclePK].bin.status = status;
    	sgbNotification[_vehiclePK].bin.seg = seg;

    	emit SGBNotificationEvent(v.PK, v.loc, v.status, ID, status, loc, seg);
    }

    function vehicleStatus(address _vehiclePK, uint256 _vehicleSpace, uint256 _vehicleWeight) public  {				
		if (_vehicleSpace <= vehicleThresholdSpace || _vehicleWeight >= vehicleThresholdWeight )
			vehicle[_vehiclePK].status = vehicleStatusFull;
		else
			vehicle[_vehiclePK].status = vehicleStatusAvailable;

		emit VehicleStatusEvent(vehicle[_vehiclePK].PK, vehicle[_vehiclePK].loc, vehicle[_vehiclePK].status);
    }

    function getVehicleStatus( address _vehiclePK ) public view returns(address, string memory, string memory) {
    	
    	return (vehicle[_vehiclePK].PK, vehicle[_vehiclePK].loc, vehicle[_vehiclePK].status);	
    }
    
    function requestResponse(address _vehiclePK) public {
		Bins storage b = sgbNotification[_vehiclePK].bin;
		Vehicles storage v = sgbNotification[_vehiclePK].vehicle;
		
		response[_vehiclePK].notify.vehicle.PK=v.PK;
		response[_vehiclePK].notify.vehicle.loc=v.loc;
		response[_vehiclePK].notify.vehicle.status=v.status;

		response[_vehiclePK].notify.bin.ID=b.ID;
		response[_vehiclePK].notify.bin.loc=b.loc;
		response[_vehiclePK].notify.bin.status=b.status;
		response[_vehiclePK].notify.bin.seg=b.seg;
		
		if (keccak256(abi.encodePacked(vehicle[_vehiclePK].status )) == keccak256(abi.encodePacked(vehicleStatusAvailable))){
			response[_vehiclePK].resp=respTrue;
			emit ResponseEvent(vehicle[_vehiclePK].PK, vehicle[_vehiclePK].loc, vehicle[_vehiclePK].status, b.ID, b.status, b.loc, b.seg, respTrue);	    	
		}
		else
		{
			response[_vehiclePK].resp=respFalse;
			emit ResponseEvent(vehicle[_vehiclePK].PK, vehicle[_vehiclePK].loc, vehicle[_vehiclePK].status, b.ID, b.status, b.loc, b.seg, respFalse);	    	
		}
    }

    function getRequestResponse(address _vehiclePK, string memory _binID) public view returns(address, string memory, string memory, string memory) {

		if(keccak256(abi.encodePacked(response[_vehiclePK].notify.bin.ID)) == keccak256(abi.encodePacked(_binID)))
			if(keccak256(abi.encodePacked(response[_vehiclePK].resp)) == keccak256(abi.encodePacked("READY")))
				return (response[_vehiclePK].notify.vehicle.PK, response[_vehiclePK].notify.vehicle.loc, response[_vehiclePK].notify.vehicle.status, response[_vehiclePK].resp);
    }

    function optimalRouteCollect (address _vehiclePK, string memory _route) public {
    	//(string memory _binID, string memory _binStatus, string memory _binLoc, string memory _binSeg) = sgb.getSGBStatus(_binID);
 		Bins storage b = sgbNotification[_vehiclePK].bin;
 		Vehicles storage v = sgbNotification[_vehiclePK].vehicle;

		routeCollect[_vehiclePK].notify.vehicle.PK=v.PK;
		routeCollect[_vehiclePK].notify.vehicle.loc=v.loc;
		routeCollect[_vehiclePK].notify.vehicle.status=v.status;

		routeCollect[_vehiclePK].notify.bin.ID=b.ID;
		routeCollect[_vehiclePK].notify.bin.loc=b.loc;
		routeCollect[_vehiclePK].notify.bin.status=b.status;
		routeCollect[_vehiclePK].notify.bin.seg=b.seg;

		routeCollect[_vehiclePK].route=_route;

		emit OptimalRouteCollectEvent(v.PK, v.loc, v.status, b.ID, b.status, b.loc, b.seg, _route);
    }

    function getOptimalRouteCollect (address _vehiclePK) public view returns(string memory, string memory, string memory, string memory, string memory) {
		return(routeCollect[_vehiclePK].notify.bin.ID, routeCollect[_vehiclePK].notify.bin.loc, routeCollect[_vehiclePK].notify.bin.status, routeCollect[_vehiclePK].notify.bin.seg, routeCollect[_vehiclePK].route ); 	
    }

    function optimalRouteDispose(address _vehiclePK, string memory _disposalArea , string memory _route) public {
    	routeDispose[_vehiclePK].vehicle.PK = vehicle[_vehiclePK].PK;
    	routeDispose[_vehiclePK].vehicle.loc = vehicle[_vehiclePK].loc;
    	routeDispose[_vehiclePK].vehicle.status = vehicle[_vehiclePK].status;
    	routeDispose[_vehiclePK].route = _route;

    	emit OptimalRouteDisposeEvent(vehicle[_vehiclePK].PK, vehicle[_vehiclePK].loc, vehicle[_vehiclePK].status, _disposalArea, _route);
    }

    function getOptimalRouteDispose(address _vehiclePK) public view returns (string memory, string memory) {
    	return(routeDispose[_vehiclePK].route, routeDispose[_vehiclePK].disposalArea); 	
    }

}
