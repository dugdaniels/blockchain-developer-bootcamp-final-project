# blockchain-developer-bootcamp-final-project

## Concept

This dapp provides a public utility allowing any address to easily set up payment splits without having to deploy a seperate contract. Anyone can visit the hosted app and begin to configure a split. 

You add recipients by thier addresses and define how wighted their split is. For example, an account with a split of 2 will recive twice as much as a recepiet with a split of one. After configering the split, any payment sent to the contract from the account that configured the split will be divided among their recipients and the recipient balances made available for withdrawal.

A single deployment of the contract provides this split functionality to anyone who wishes to use it. Addidionally, any contract can also configure a split, providing even more flexibility.  

## Directory structure

.
├── contracts                       # Solidity source file for the smart contract 
├── scripts                         # Hardhat script for deployment
├── public                          # Public assets for the React frontend
├── src                             # Source files for the React frontend
├── test                            # Smart contract unit tests
├── avoiding_common_attacks.md
├── deployed_address.txt
├── design_pattern_decisions.md
├── README.md
└── ...

## Installing dependencies

You need Node.js `12.0` or newer installed, then after cloning the repo, run `npm install` to install project dependencies locally

## Running smart contract unit tests

Run `npx hardhat test` to run the smart contract unit tests locally

## Accessing the project

The public version of the app can be viewed at [https://blockchain-developer-bootcamp-final-project-10zy34fhq.vercel.app/](https://blockchain-developer-bootcamp-final-project-10zy34fhq.vercel.app/). You'll need to connect your wallet via the Rinkey network. 

## Screencast

A walkthrough of the project can be viewed [here](https://www.loom.com/share/29a8aa30cd0047fc9d679aa5e21ef87b).