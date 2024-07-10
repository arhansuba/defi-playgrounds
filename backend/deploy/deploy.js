
const Payment = artifacts.require("Payment");
const { deployer, web3 } = require('@openzeppelin/truffle-deployer');
const { Staking, Trading } = require('./contracts');

module.exports = async function (deployer) {
  // Deploy the Staking contract
  await deployer.deploy(Staking, {
    from: '0x...your_account_address...',
    gas: 4000000,
    gasPrice: web3.utils.toWei('20', 'gwei'),
  });

  // Deploy the Trading contract
  await deployer.deploy(Trading, {
    from: '0x...your_account_address...',
    gas: 4000000,
    gasPrice: web3.utils.toWei('20', 'gwei'),
  });

  // Set the Staking contract address in the Trading contract
  const stakingContract = await Staking.deployed();
  const tradingContract = await Trading.deployed();
  await tradingContract.setStakingContractAddress(stakingContract.address);

  // Set the Trading contract address in the Staking contract
  await stakingContract.setTradingContractAddress(tradingContract.address);
};
module.exports = function(deployer) {
  deployer.deploy(Payment);
};
