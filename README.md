# blockchain-developer-bootcamp-final-project

## Concept

My inital thoughts for a final project revolve around a service that enables users to deploy a general-purpose, splits contract built for dynamic payment setups. It would include additional features around access management and payment configuration.

### Access management features

- The owner of the contract should be able to transfer owernship to another EOA
- Only the owner has the ability to invite payees and edit the splits configuration

### Payment features

- The contract should store a list of 'payout' accounts that can hold a balance
- Each 'payout' account should have a weighted split that can be edited
- Payments to the contract should be split between the 'payout' accounts
- The owner or any payee should be able to initiate a payout