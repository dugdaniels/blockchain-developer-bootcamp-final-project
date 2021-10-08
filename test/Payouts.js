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
    [acct1, acct2, acct3, acct4] = await ethers.getSigners();
    payouts = await Payouts.deploy();
  }) 

  describe("Deployment", () => {
    it("Should initialize payouts as inactive", async () => {
      expect(await payouts.isActivated()).to.equal(false);
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
      expect(await payouts.getPayeeSplit(payeeList[0])).to.equal(1);
    });

    it("Should allow multiple payees to be added", async () => {
      await payouts.addPayee(acct2.address, 1);
      await payouts.addPayee(acct3.address, 1);
      await payouts.addPayee(acct4.address, 1);
      const payeeList = await payouts.getPayees();
      expect(payeeList.length).to.equal(3);
    });

    it("Should set the payout to active when the first payee is added", async () => {
      await payouts.addPayee(acct2.address, 1);
      expect(await payouts.isActivated()).to.equal(true);
    });

    it("Should require a non-zero split to be set", async () => {
      await expect(
        payouts.addPayee(acct1.address, 0)
      ).to.be.revertedWith("You must allocate a non-zero split");
    });

    it("Should prevent a payee from being added more than once", async () => {
      await payouts.addPayee(acct2.address, 1);
      await expect(
        payouts.addPayee(acct2.address, 1)
      ).to.be.revertedWith("Account already added as a payee");
    });

    it("Should prevent the zero account from being added as a payee", async () => {
      const zeroAddress = "0x0000000000000000000000000000000000000000";
      await expect(
        payouts.addPayee(zeroAddress, 1)
      ).to.be.revertedWith("Can't add the zero address as a payee");
    });
  });

  describe("Removing payees", () => {
    it("Should allow a payee to be removed", async () => {
      await payouts.addPayee(acct2.address, 1);
      await payouts.addPayee(acct3.address, 1);
      await payouts.addPayee(acct4.address, 1);
      let payeeList = await payouts.getPayees();
      expect(payeeList.length).to.equal(3);

      await payouts.removePayee(acct3.address);
      payeeList = await payouts.getPayees();
      expect(payeeList.length).to.equal(2);

      expect(payeeList[0]).to.equal(acct2.address);
      expect(payeeList[1]).to.equal(acct4.address);
    });

    it("Should set a payee split to zero when removed", async () => {
      await payouts.addPayee(acct2.address, 1);
      await payouts.removePayee(acct2.address);
      expect(await payouts.getPayeeSplit(acct2.address)).to.equal(0);
    });

    it("Should only allow removing payees that have a split allocated", async () => {
      await expect(
        payouts.removePayee(acct2.address)
      ).to.be.revertedWith("Account not listed added as a payee");
    });

    it("Removing all payees should set the payout to inactive", async () => {
      await payouts.addPayee(acct2.address, 1);
      await payouts.removePayee(acct2.address);
      expect(await payouts.isActivated()).to.equal(false);
    });
  });
});
