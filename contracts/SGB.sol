pragma solidity >=0.4.19 <0.6.0;

contract SGB {
	
	struct Bins {
		string ID;
		string status;
		string loc;
		string seg;
	}

	string binStatusFull = "FULL";
	string binStatusEmpty = "EMPTY";

	mapping ( string => Bins)   bins;
	mapping ( string => string)  binDistance;
	mapping ( string => string)  wasteHeight;

	uint256 constant public binHeight = 10;
	uint256 constant public binThresholdDistance = 2;

	event SGBUpdate (
    	string ID,
		string status,
		string loc,
		string seg
    );
	
	event RegisterSGB(string binID, string binStatus, string binLoc, string binSeg);

	constructor() public {}

	function registerSGB(string memory _binID, string memory _binLoc) public {
		bins[_binID] = Bins(_binID, binStatusEmpty, _binLoc, "FALSE");
		emit RegisterSGB(_binID, binStatusEmpty, _binLoc, "FALSE");
	}

	function SGBStatus(string memory _binID, string memory _binSeg, uint256 _binDistance, uint256 _binWasteHeight) public {
		bins[_binID].seg=_binSeg;
		if (_binDistance <= binThresholdDistance) {			
			bins[_binID].status = binStatusFull;
			emit SGBUpdate(bins[_binID].ID, bins[_binID].status, bins[_binID].loc, bins[_binID].seg);
		}
		else if (_binDistance == binHeight || _binWasteHeight == 0) {
			bins[_binID].status = binStatusEmpty;
			emit SGBUpdate(bins[_binID].ID, bins[_binID].status, bins[_binID].loc, bins[_binID].seg);
		}
	}

	function getSGBStatus(string memory ID) public view returns(string memory, string memory, string memory, string memory) {
		Bins storage bin = bins[ID];
		return (bin.ID, bin.status, bin.loc, bin.seg);
	}

}