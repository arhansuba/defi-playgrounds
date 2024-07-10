// SPDX-License-Identifier: MIT 
// Token.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RootstockToken is ERC20, Ownable {
    constructor() ERC20("Rootstock Token", "RST") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    // Function to mint new tokens
    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    // Function to burn tokens
    function burn(address account, uint256 amount) public onlyOwner {
        _burn(account, amount);
    }

    // Function to pause token transfers
    function pause() public onlyOwner {
        pause();
    }

    // Function to unpause token transfers
    function unpause() public onlyOwner {
        unpause();
    }

    // Function to set token name and symbol
    function setTokenInfo(string memory name, string memory symbol) public onlyOwner {
        _setName(name);
        _setSymbol(symbol);
    }
}