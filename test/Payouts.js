const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Payouts contract", () => {

  let Payouts;
  let payouts;
  let owner;  
  // let payee1;
  // let payee2;
  // let payee3;

  beforeEach(async () => {
    Payouts = await ethers.getContractFactory("Payouts");
    [owner] = await ethers.getSigners();
    payouts = await Payouts.deploy();
  }) 

  describe("Deployment", () => {
    it("Should set the correct owner", async () => {
      expect(await payouts.owner()).to.equal(owner.address);
    })
  })
});
