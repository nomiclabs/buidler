pragma solidity ^0.8.0;

contract C {

  function test() public {
    assembly {
      revert(0, 0)
    }
  }

}
