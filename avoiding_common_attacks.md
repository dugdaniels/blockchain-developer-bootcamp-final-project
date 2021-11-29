# Avoiding common attacks

## Proper use of require, assert and revert 

Require is used extensively in the smart contract to ensure methods calls can be completed

## Pull over push (prioritize receiving contract calls over making contract calls)

The balance of split recipients is held on contract until they withdraw it instead of attempting to transfer it to them when the payment occurs.

## Checks-effects-interactions (avoiding state changes after external calls)

State changes are made ahead of transactions