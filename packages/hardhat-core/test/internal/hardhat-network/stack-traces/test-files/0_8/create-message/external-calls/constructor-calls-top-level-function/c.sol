pragma solidity ^0.8.0;

function fail() {
  require(false, "failure reason");
}

function callFail() {
  fail();
}

contract C {
  constructor() public {
    callFail();
  }
}
