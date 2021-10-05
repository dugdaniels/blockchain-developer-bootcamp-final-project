// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Payouts {
    constructor() public {
        admins[msg.sender] = true;
    }

    mapping(address => bool) public admins;
    mapping(address => uint) public balances;

    modifier onlyAdmin() {
        require(admins[msg.sender], "caller is not an admin");
        _;
    }

    function addAdmin(address _address) public onlyAdmin {

    }

    function removeAdmin(address _address) public onlyAdmin {

    }

    function addPayee(address _address) public onlyAdmin {

    }

    function removePayee(address _address) public onlyAdmin {

    }

    function getBalance() public view {

    }

    function withdraw() public {

    }
    
}
