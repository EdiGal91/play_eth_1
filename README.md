1. yarn start:node - create local ethereum network
2. form the 1. output, copy first account private key and import it to MMask account
3. yarn deploy:local - deploy contracts
4. copy deployed addresses to .env
5. copy the token address to MMast -> Add Token -> Token Contract Address ( 0 decimal )
6. yarn start - start the react app

# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
