pragma solidity ^0.8.0;

import "./../../../../../../../../console.sol";

contract C {

	function log(
		uint p0, bool p8, uint p1, string memory p4, bool p9, address p12, uint p2, string memory p5, bool p10, address p13
	) public {
		console.log(p0, p8);
		console.log(p0, p8, p1);
		console.log(p0, p8, p4);
		console.log(p0, p8, p9);
		console.log(p0, p8, p12);
		console.log(p0, p8, p1, p2);
		console.log(p0, p8, p1, p4);
		console.log(p0, p8, p1, p9);
		console.log(p0, p8, p1, p12);
		console.log(p0, p8, p4, p1);
		console.log(p0, p8, p4, p5);
		console.log(p0, p8, p4, p9);
		console.log(p0, p8, p4, p12);
		console.log(p0, p8, p9, p1);
		console.log(p0, p8, p9, p4);
		console.log(p0, p8, p9, p10);
		console.log(p0, p8, p9, p12);
		console.log(p0, p8, p12, p1);
		console.log(p0, p8, p12, p4);
		console.log(p0, p8, p12, p9);
		console.log(p0, p8, p12, p13);
	}
}
