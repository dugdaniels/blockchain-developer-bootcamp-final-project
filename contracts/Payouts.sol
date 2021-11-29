//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/// @title Payouts
/// @author @DugDaniels
/// @notice You can use this public contract to split payments to multiple recipients
/// @dev Any address can configure a split and distribute funds to multiple recipients
contract Payouts {    

    using EnumerableSet for EnumerableSet.AddressSet;

    struct Payee {
        address accountAddress;
        uint split;
    }

    mapping(address => uint) balances;

    mapping(address => bool) activated;
    mapping(address => EnumerableSet.AddressSet) payees;
    mapping(address => uint) totalAllocations;
    mapping(address => mapping(address => uint)) splits;

    /// @notice Activates a payout if it has at least one payee, otheswirs it will be deactivated
    /// @param _payoutsAddress The address of the payout owner
    function _updateActivated(address _payoutsAddress) internal {
        if (EnumerableSet.length(payees[_payoutsAddress]) == 0 && activated[_payoutsAddress]) {
            activated[_payoutsAddress] = false;
        } else if (!activated[_payoutsAddress]) {
            activated[_payoutsAddress] = true;
        }
    }

    /// @notice Checks if the callers payout is active
    /// @return True if active, false otherwise
    function isActivated() public view returns (bool) {
        return activated[msg.sender];
    }

    /// @notice Adds a payee to the split
    /// @param _payeeAddress The address of a split recipient
    /// @param _payeeSplit The weight of the recipients split
    function addPayee(address _payeeAddress, uint _payeeSplit) public {
        require(splits[msg.sender][_payeeAddress] == 0, "Account already added as a payee");
        require(_payeeAddress != address(0), "Can't add the zero address as a payee");
        require(_payeeSplit > 0, "You must allocate a non-zero split");

        EnumerableSet.add(payees[msg.sender], _payeeAddress);
        totalAllocations[msg.sender] += _payeeSplit;
        splits[msg.sender][_payeeAddress] = _payeeSplit;

        _updateActivated(msg.sender);
    }

    /// @notice Removes a payee from the split
    /// @param _payeeAddress The address of an existing split recipient
    function removePayee(address _payeeAddress) public {
        require(splits[msg.sender][_payeeAddress] > 0, "Account not listed as a payee");
        EnumerableSet.AddressSet storage payeeList = payees[msg.sender];
        EnumerableSet.remove(payeeList, _payeeAddress);

        totalAllocations[msg.sender] -= splits[msg.sender][_payeeAddress];
        splits[msg.sender][_payeeAddress] = 0;
        
        _updateActivated(msg.sender);
    }

    /// @notice Edits an existing payee and their split
    /// @param _originalPayeeAddress The address of an existing split recipient
    /// @param _newPayeeAddress The address to update the payee to, may be the same as the original
    /// @param _payeeSplit The updated weight of the recipients split, may be the same as the original
    function editPayee(address _originalPayeeAddress, address _newPayeeAddress, uint _payeeSplit) public {
        if (_originalPayeeAddress != _newPayeeAddress) {
            removePayee(_originalPayeeAddress);
            addPayee(_newPayeeAddress, _payeeSplit);
        } else if (splits[msg.sender][_newPayeeAddress] != _payeeSplit) {
            uint splitDifference;
            if (splits[msg.sender][_newPayeeAddress] > _payeeSplit) {
                splitDifference = splits[msg.sender][_newPayeeAddress] - _payeeSplit;
                totalAllocations[msg.sender] -= splitDifference;
            } else {
                splitDifference = _payeeSplit - splits[msg.sender][_newPayeeAddress];
                totalAllocations[msg.sender] += splitDifference;
            }
            splits[msg.sender][_newPayeeAddress] = _payeeSplit;
        }
    }

    /// @notice Returns a list of all payees the caller has configured
    /// @return An array of Payee objects containing addresses and split weights
    function getPayees() public view returns (Payee[] memory) {
        uint payeeCount = EnumerableSet.length(payees[msg.sender]);
        Payee[] memory payeeList = new Payee[](payeeCount);
        for (uint i; i < payeeCount; i++) {
            Payee memory payee = Payee({
                accountAddress: EnumerableSet.at(payees[msg.sender], i),
                split: splits[msg.sender][EnumerableSet.at(payees[msg.sender], i)]
            });
            payeeList[i] = payee;
        }
        return payeeList;
    }

    /// @notice Get the weight of a payees split
    /// @param _payeeAddress The address of an existing split recipient
    /// @return The weight of the payees split as a uint
    function getPayeeSplit(address _payeeAddress) public view returns (uint) {
        return splits[msg.sender][_payeeAddress];
    }

    /// @notice Gets the callers balance
    /// @return The callers balance as a uint
    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }

    /// @notice Internal function that splits a payment to multiple payees by weight and updates the balances
    /// @param _paymentValue The payment value to split
    function routePayment(uint _paymentValue) internal {
        if (_paymentValue < EnumerableSet.length(payees[msg.sender])) {
            balances[msg.sender] += _paymentValue;
        } else {
            address[] memory payeeList = EnumerableSet.values(payees[msg.sender]);
            uint remainingInPayment = _paymentValue;
            for (uint i; i < payeeList.length; i++) {
                uint payment = _paymentValue / totalAllocations[msg.sender] * splits[msg.sender][payeeList[i]];
                remainingInPayment -= payment;
                balances[payeeList[i]] += payment;
            }
            balances[msg.sender] += remainingInPayment;
        }
    }

    /// @notice Allows the caller to withdraw their balance
    function withdraw() public {
        require(balances[msg.sender] > 0, "You have no funds to withdraw");
        uint balance = balances[msg.sender];
        balances[msg.sender] = 0;
        (bool sent, ) = msg.sender.call{value: balance}("");
        require(sent, "Failed to withdraw Ether");
    }

    /// @notice Payable funtion that allows the caller to initeates a split payment
    receive() external payable {
        require(activated[msg.sender], "This payout is not active");
        if (msg.value > 0) {
            routePayment(msg.value);
        }
    }
    
}