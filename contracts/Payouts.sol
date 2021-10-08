//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Payouts {    
    
    mapping(address => uint) balances;

    mapping(address => bool) public activated;
    mapping(address => address[]) payees;
    mapping(address => mapping(address => uint)) splits;

    function addPayee(address _payeeAddress, uint _payeeSplit) public {
        require(splits[msg.sender][_payeeAddress] == 0, "Account already added as a payee");
        require(_payeeAddress != address(0), "Can't add the zero address as a payee");
        require(_payeeSplit > 0, "You must allocate a non-zero split");

        payees[msg.sender].push(_payeeAddress);
        splits[msg.sender][_payeeAddress] = _payeeSplit;
        updateActivated(msg.sender);
    }

    function updateActivated(address _payoutsAddress) private {
        if (payees[_payoutsAddress].length == 0 && activated[_payoutsAddress]) {
            activated[_payoutsAddress] = false;
        } else if (!activated[_payoutsAddress]) {
            activated[_payoutsAddress] = true;
        }
    } 

    function getPayees() public view returns (address[] memory) {
        return payees[msg.sender];
    }

    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }

    // function withdraw() public {

    // }
    
}