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
    [acct1, acct2] = await ethers.getSigners();
    payouts = await Payouts.deploy();
  }) 

  describe("Deployment", () => {
    it("Should initialize payouts as inactive", async () => {
      expect(await payouts.activated(acct1.address)).to.equal(false);
    });
    
    it("Should initialize payouts with no payees", async () => {
      const payeeList = await payouts.getPayees();
      expect(Array.isArray(payeeList)).to.equal(true);
      expect(payeeList.length).to.equal(0);
    });

    it("Should initialize balances at zero", async () => {
      expect(await payouts.getBalance()).to.equal(0);
    });
  });

  describe("Adding payees", () => {
    it("Should allow a payee to be added", async () => {
      await payouts.addPayee(acct2.address, 1);
      const payeeList = await payouts.getPayees();
      expect(payeeList[0]).to.equal(acct2.address);
    });
  });
});
