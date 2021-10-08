const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Payouts contract", () => {

  let Payouts;
  let payouts;
  let acct1;  
  let acct2;
  let acct3;
  let acct4;

  beforeEach(async () => {
    Payouts = await ethers.getContractFactory("Payouts");
    [acct1] = await ethers.getSigners();
    payouts = await Payouts.deploy();
  }) 

  describe("Deployment", () => {
    it("Should set payouts as inactive", async () => {
      expect(await payouts.activated(acct1.address)).to.equal(false);
    });
    
    it("Should have payouts with no payees", async () => {
      const payeeList = await payouts.getPayees();
      expect(Array.isArray(payeeList)).to.equal(true);
      expect(payeeList.length).to.equal(0);
    });

    it("Should set balances to zero", async () => {
      expect(await payouts.getBalance()).to.equal(0);
    });
  });
});
