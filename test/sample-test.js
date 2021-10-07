const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Payouts", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Payouts = await ethers.getContractFactory("Payouts");
    const payouts = await Payouts.deploy();
    await payouts.deployed();

    // expect(await greeter.greet()).to.equal("Hello, world!");

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
