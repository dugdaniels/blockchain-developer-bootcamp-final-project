# Design pattern decisions

## Inheritance and Interfaces

The smart contract imports [EnumerableSet](https://docs.openzeppelin.com/contracts/4.x/api/utils#EnumerableSet) from OpenZeppelin and uses it for an AddressSet. It's functionality helps with management of each users list of payees.

## Optimizing gas

The entire smart contract concept revolves around providing a gas efficient way for users to manage payment splits. A single deployed contract can be used publicly, so users don'd have to deploy their own contract.