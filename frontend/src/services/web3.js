// frontend/src/services/web3.js
import Web3 from 'web3';
// frontend/src/services/Web3.js
import Web3 from 'web3';

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/YOUR_PROJECT_ID'));

class Web3Service {
  async deployContract(contractName, args) {
    const contract = require(`../contracts/${contractName}.json`);
    const bytecode = contract.bytecode;
    const abi = contract.abi;

    const txCount = await web3.eth.getTransactionCount('0xYourEthereumAddress');
    const tx = {
      from: '0xYourEthereumAddress',
      data: bytecode,
      gas: '2000000',
      gasPrice: web3.utils.toWei('20', 'gwei'),
      nonce: txCount,
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, 'YOUR_PRIVATE_KEY');
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    const contractAddress = receipt.contractAddress;
    const contractInstance = new web3.eth.Contract(abi, contractAddress);

    await contractInstance.methods.initialize(...args).send({
      from: '0xYourEthereumAddress',
      gas: '2000000',
      gasPrice: web3.utils.toWei('20', 'gwei'),
    });

    return contractAddress;
  }

  async callContractFunction(contractAddress, functionName, args) {
    const contract = new web3.eth.Contract(require('../contracts/MyContract.json').abi, contractAddress);

    const result = await contract.methods[functionName](...args).call();
    return result;
  }

  async getEvents(contractAddress, eventName, fromBlock, toBlock) {
    const contract = new web3.eth.Contract(require('../contracts/MyContract.json').abi, contractAddress);

    const events = await contract.getPastEvents(eventName, {
      fromBlock,
      toBlock,
    });

    return events;
  }

  async estimateGas(contractAddress, functionName, args) {
    const contract = new web3.eth.Contract(require('../contracts/MyContract.json').abi, contractAddress);

    const gasEstimate = await contract.methods[functionName](...args).estimateGas({
      from: '0xYourEthereumAddress',
    });

    return gasEstimate;
  }
}


const getWeb3 = () =>
  new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        resolve(window.web3);
      } else {
        const provider = new Web3.providers.HttpProvider("http://localhost:8545");
        const web3 = new Web3(provider);
        resolve(web3);
      }
    });
  });

  export default new Web3Service();
