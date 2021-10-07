//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Payouts is Ownable {    
    
    struct Payee {
        address account;
        uint split;
        uint balance;
    }

    mapping(address => bool) public isPayee;
    Payee[] public payees;

    function addPayee(address _address, uint _split) public onlyOwner {
        require(!isPayee[_address], "Account already added as a payee");
        require(_address != address(0), "Can't add the zero address as a payee");
        isPayee[_address] = true;
        payees.push(Payee({
            account: _address,
            split: _split,
            balance: 0
        }));
    }

    // function getBalance() public view {

    // }

    // function withdraw() public {

    // }
    
}