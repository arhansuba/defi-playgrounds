// SPDX-License-Identifier: MIT 
// Token.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "../Counter.sol";

contract Token is ERC20, Ownable, Pausable {
    using Counters for Counters.Counter;

    Counters.Counter private _totalSupply;
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(address account, uint256 amount) public onlyOwner {
        _totalSupply.increment();
        balances[account] = balances[account].add(amount);
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public onlyOwner {
        require(balances[account] >= amount, "Insufficient balance");
        _totalSupply.decrement();
        balances[account] = balances[account].sub(amount);
        _burn(account, amount);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply.current();
    }

    function balanceOf(address account) public view override returns (uint256) {
        return balances[account];
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        allowances[msg.sender][spender] = amount;
        return true;
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] = balances[msg.sender].sub(amount);
        balances[recipient] = balances[recipient].add(amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        require(allowances[sender][msg.sender] >= amount, "Insufficient allowance");
        require(balances[sender] >= amount, "Insufficient balance");
        allowances[sender][msg.sender] = allowances[sender][msg.sender].sub(amount);
        balances[sender] = balances[sender].sub(amount);
        balances[recipient] = balances[recipient].add(amount);
        return true;
    }
}