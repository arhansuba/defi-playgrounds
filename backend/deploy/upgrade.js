const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer) {
  const TradingV2 = artifacts.require('TradingV2');

  // Upgrade the Trading contract
  await upgradeProxy('Trading', TradingV2, {
    deployer: deployer,
    initializer: 'initialize',
    call: {
      fn: 'initialize',
      args: [],
    },
  });
};