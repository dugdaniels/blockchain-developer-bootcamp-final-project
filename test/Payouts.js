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

    // Ensure that payouts are initialized as inactive since they have no payees
    it("Should initialize payouts as inactive", async () => {
      expect(await payouts.isActivated()).to.equal(false);
    });
    
    // Ensure that there are no payees when payouts are initialized
    it("Should initialize payouts with no payees", async () => {
      const payeeList = await payouts.getPayees();
      expect(Array.isArray(payeeList)).to.equal(true);
      expect(payeeList.length).to.equal(0);
    });

    // Ensure that payouts are initialized with a balance of 0
    it("Should initialize balances at zero", async () => {
      expect(await payouts.getBalance()).to.equal(0);
    });
  });

  describe("Adding payees", () => {

    // Ensure that a user can add a payee
    it("Should allow a payee to be added", async () => {
      await payouts.addPayee(acct2.address, 1);
      const payeeList = await payouts.getPayees();
      expect(payeeList[0].accountAddress).to.equal(acct2.address);
      expect(payeeList[0].split).to.equal(1);
    });

    // Ensure that a user can add multiple payees
    it("Should allow multiple payees to be added", async () => {
      await payouts.addPayee(acct2.address, 1);
      await payouts.addPayee(acct3.address, 1);
      await payouts.addPayee(acct4.address, 1);
      const payeeList = await payouts.getPayees();
      expect(payeeList.length).to.equal(3);
    });

    // Ensure that the payout is activated when a payee is added
    it("Should set the payout to active when the first payee is added", async () => {
      await payouts.addPayee(acct2.address, 1);
      expect(await payouts.isActivated()).to.equal(true);
    });

    // Ensure that a payee cannot be added with a split of 0
    it("Should require a non-zero split to be set", async () => {
      await expect(
        payouts.addPayee(acct1.address, 0)
      ).to.be.revertedWith("You must allocate a non-zero split");
    });

    // Ennsure that a payee cannot be added twice
    it("Should prevent a payee from being added more than once", async () => {
      await payouts.addPayee(acct2.address, 1);
      await expect(
        payouts.addPayee(acct2.address, 1)
      ).to.be.revertedWith("Account already added as a payee");
    });

    // Ensure that the zero address cannot be added as a payee
    it("Should prevent the zero account from being added as a payee", async () => {
      const zeroAddress = "0x0000000000000000000000000000000000000000";
      await expect(
        payouts.addPayee(zeroAddress, 1)
      ).to.be.revertedWith("Can't add the zero address as a payee");
    });
  });

  describe("Removing payees", () => {

    // Ensure that the user can remove a payee
    it("Should allow a payee to be removed", async () => {
      await payouts.addPayee(acct2.address, 1);
      await payouts.addPayee(acct3.address, 1);
      await payouts.addPayee(acct4.address, 1);
      let payeeList = await payouts.getPayees();
      expect(payeeList.length).to.equal(3);

      await payouts.removePayee(acct3.address);
      payeeList = await payouts.getPayees();
      expect(payeeList.length).to.equal(2);

      expect(payeeList[0].accountAddress).to.equal(acct2.address);
      expect(payeeList[1].accountAddress).to.equal(acct4.address);
    });

    // Ensure that a payees split is set to 0 when the payee is removed
    it("Should set a payee split to zero when removed", async () => {
      await payouts.addPayee(acct2.address, 1);
      await payouts.removePayee(acct2.address);
      expect(await payouts.getPayeeSplit(acct2.address)).to.equal(0);
    });

    // Ensure that you can't remove a payee that doesn't have a split configured
    it("Should only allow removing payees that have a split allocated", async () => {
      await expect(
        payouts.removePayee(acct2.address)
      ).to.be.revertedWith("Account not listed as a payee");
    });

    // Ensure that the payout is deactivated when the last payee is removed
    it("Should set the payout to inactive if all payees are removed", async () => {
      await payouts.addPayee(acct2.address, 1);
      await payouts.removePayee(acct2.address);
      expect(await payouts.isActivated()).to.equal(false);
    });
  });

  describe("Editing payees", () => {    

    // Ensure that a payee address can be changed
    it("Should let you update a payee address", async () => {
      await payouts.addPayee(acct2.address, 1);
      await payouts.editPayee(acct2.address, acct3.address, 1);

      payeeList = await payouts.getPayees();
      expect(payeeList[0].accountAddress).to.equal(acct3.address);

      expect(await payouts.getPayeeSplit(acct2.address)).to.equal(0);
      expect(await payouts.getPayeeSplit(acct3.address)).to.equal(1);
    });

    // Ensure that you can't edit a payee that doesn't have a split configured
    it("Should only allow editing currently allocated payees", async () => {
      await expect(
        payouts.editPayee(acct2.address, acct3.address, 1)
      ).to.be.revertedWith("Account not listed as a payee");
    });        
    
    // Ensure a payee address can be changed to the zero address
    it("Should prevent a payees address from being changed to the zero account", async () => {
      await payouts.addPayee(acct2.address, 1);
      const zeroAddress = "0x0000000000000000000000000000000000000000";
      await expect(
        payouts.editPayee(acct2.address, zeroAddress, 1)
      ).to.be.revertedWith("Can't add the zero address as a payee");
    });
    
    // Ensure that a payee split can be changed
    it("Should allow updating a payees allocation", async () => {
      await payouts.addPayee(acct2.address, 1);
      await payouts.editPayee(acct2.address, acct2.address, 2);

      expect(await payouts.getPayeeSplit(acct2.address)).to.equal(2);
    });
  });

  describe("Routing payments", () => {

    // Ensure that a payment is correctly divided among the payees
    it("Should split payments among payees", async () => {
      await payouts.addPayee(acct2.address, 1);
      await payouts.addPayee(acct3.address, 1);

      await acct1.sendTransaction({
        to: payouts.address,
        value: 2,
      });

      expect(await payouts.connect(acct1).getBalance()).to.equal(0);
      expect(await payouts.connect(acct2).getBalance()).to.equal(1);
      expect(await payouts.connect(acct3).getBalance()).to.equal(1);
    });

    // Ensure that a payment is correctly divided according to payee splits
    it("Should weight splits based on payee allocation", async () => {
      await payouts.addPayee(acct2.address, 1);
      await payouts.addPayee(acct3.address, 3);

      await acct1.sendTransaction({
        to: payouts.address,
        value: 4,
      });

      expect(await payouts.connect(acct1).getBalance()).to.equal(0);
      expect(await payouts.connect(acct2).getBalance()).to.equal(1);
      expect(await payouts.connect(acct3).getBalance()).to.equal(3);
    });    
    
    // Ensure that splits are still accurate after payee splits are changed
    it("Should update when payee allocations are edited", async () => {
      await payouts.addPayee(acct2.address, 1);
      await payouts.addPayee(acct3.address, 1);

      await acct1.sendTransaction({
        to: payouts.address,
        value: 4,
      });

      expect(await payouts.connect(acct1).getBalance()).to.equal(0);
      expect(await payouts.connect(acct2).getBalance()).to.equal(2);
      expect(await payouts.connect(acct3).getBalance()).to.equal(2);

      await payouts.editPayee(acct2.address, acct2.address, 2);
      await payouts.editPayee(acct3.address, acct4.address, 1);

      await acct1.sendTransaction({
        to: payouts.address,
        value: 6,
      });

      expect(await payouts.connect(acct1).getBalance()).to.equal(0);
      expect(await payouts.connect(acct2).getBalance()).to.equal(6);
      expect(await payouts.connect(acct3).getBalance()).to.equal(2);
      expect(await payouts.connect(acct4).getBalance()).to.equal(2);
    });

    // Ensure that any odd change is applied to the senders balance
    it("Should deliver any remaining wei to the senders balance", async () => {
      await payouts.addPayee(acct2.address, 1);
      await payouts.addPayee(acct3.address, 2);

      await acct1.sendTransaction({
        to: payouts.address,
        value: 5,
      });

      expect(await payouts.connect(acct1).getBalance()).to.equal(2);
      expect(await payouts.connect(acct2).getBalance()).to.equal(1);
      expect(await payouts.connect(acct3).getBalance()).to.equal(2);
    }); 
  });

  describe("Withdrawing", () => {

    // Ensure that a payee can withdraw their funds
    it("Should allow a payee to withdraw funds", async () => {
      const originalBalance = await acct2.getBalance();
      const payment = 5;

      await payouts.addPayee(acct2.address, 1);

      await acct1.sendTransaction({
        to: payouts.address,
        value: payment,
      });

      const tx = await payouts.connect(acct2).withdraw();
      const receipt = await tx.wait();
      const txCost = receipt.gasUsed.mul(receipt.effectiveGasPrice)
      const finalBalance = originalBalance.add(payment).sub(txCost);

      expect(await acct2.getBalance()).to.equal(finalBalance);
    });    
    
    // Ensure that a payee cannot withdraw funds if they don't have any
    it("Should prevent withdrawing when no funds are available", async () => {
      await expect(
        payouts.connect(acct2).withdraw()
      ).to.be.revertedWith("You have no funds to withdraw");
    });
  });
});
