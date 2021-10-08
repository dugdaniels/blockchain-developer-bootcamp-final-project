//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Payouts {    
    
    mapping(address => uint) balances;

    mapping(address => bool) activated;
    mapping(address => address[]) payees;
    mapping(address => mapping(address => uint)) splits;

    function _updateActivated(address _payoutsAddress) internal {
        if (payees[_payoutsAddress].length == 0 && activated[_payoutsAddress]) {
            activated[_payoutsAddress] = false;
        } else if (!activated[_payoutsAddress]) {
            activated[_payoutsAddress] = true;
        }
    }

    function isActivated() public view returns (bool) {
        return activated[msg.sender];
    }

    function addPayee(address _payeeAddress, uint _payeeSplit) public {
        require(splits[msg.sender][_payeeAddress] == 0, "Account already added as a payee");
        require(_payeeAddress != address(0), "Can't add the zero address as a payee");
        require(_payeeSplit > 0, "You must allocate a non-zero split");

        payees[msg.sender].push(_payeeAddress);
        splits[msg.sender][_payeeAddress] = _payeeSplit;
        _updateActivated(msg.sender);
    }

    function getPayees() public view returns (address[] memory) {
        return payees[msg.sender];
    }

    function getPayeeSplit(address _payeeAddress) public view returns (uint) {
        return splits[msg.sender][_payeeAddress];
    }

    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }

    // function withdraw() public {

    // }
    
}