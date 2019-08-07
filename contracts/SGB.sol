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
	
	constructor() public {}


	function setSGBStatus(string memory _binID, string memory _binStatus, string memory _binLoc, string memory _binSeg, uint256 _binDistance, uint256 _binWasteHeight) public {
		if (_binDistance <= binThresholdDistance) {			
			_binStatus = binStatusFull;
			bins[_binID] = Bins(_binID, _binStatus, _binLoc, _binSeg);
			emit SGBUpdate(_binID, _binStatus, _binLoc, _binSeg);

		}
		else if (_binDistance == binHeight || _binWasteHeight == 0) {
			_binStatus = binStatusEmpty;
			bins[_binID] = Bins(_binID, _binStatus, _binLoc, _binSeg);
			emit SGBUpdate(_binID, _binStatus, _binLoc, _binSeg);

		}
	}

	function getSGBStatus(string memory ID) public view returns(string memory, string memory, string memory, string memory) {
		Bins storage bin = bins[ID];
		return (bin.ID, bin.status, bin.loc, bin.seg);
	}

}