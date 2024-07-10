// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";

contract Token {
    // Mapping of addresses to their token balances
    mapping (address => uint256) public balances;

    // Mapping of addresses to their token allowances
    mapping (address => mapping (address => uint256)) public allowances;

    // Total supply of tokens
    uint256 public totalSupply;

    // Token name
    string public name;

    // Token symbol
    string public symbol;

    // Token decimals
    uint256 public decimals;

    // Event emitted when tokens are transferred
    event Transfer(address indexed from, address indexed to, uint256 value);

    // Event emitted when an approval is made
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Initializes the contract with the token details
     * @param _name Token name
     * @param _symbol Token symbol
     * @param _decimals Token decimals
     * @param _totalSupply Total supply of tokens
     */
    constructor(string memory _name, string memory _symbol, uint256 _decimals, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
    }

    /**
     * @dev Transfers tokens from one address to another
     * @param from Address to transfer from
     * @param to Address to transfer to
     * @param value Amount of tokens to transfer
     */
    function transfer(address from, address to, uint256 value) public {
        require(balances[from] >= value, "Insufficient balance");
        balances[from] -= value;
        balances[to] += value;
        emit Transfer(from, to, value);
    }

    /**
     * @dev Approves an address to spend tokens on behalf of another address
     * @param owner Address that owns the tokens
     * @param spender Address that is approved to spend tokens
     * @param value Amount of tokens that can be spent
     */
    function approve(address owner, address spender, uint256 value) public {
        allowances[owner][spender] = value;
        emit Approval(owner, spender, value);
    }

    /**
     * @dev Transfers tokens from one address to another using an approved allowance
     * @param from Address to transfer from
     * @param to Address to transfer to
     * @param value Amount of tokens to transfer
     */
    function transferFrom(address from, address to, uint256 value) public {
        require(allowances[from][msg.sender] >= value, "Insufficient allowance");
        require(balances[from] >= value, "Insufficient balance");
        balances[from] -= value;
        balances[to] += value;
        allowances[from][msg.sender] -= value;
        emit Transfer(from, to, value);
    }

    /**
     * @dev Returns the balance of tokens for a given address
     * @param owner Address to check the balance for
     * @return Balance of tokens for the given address
     */
    function balanceOf(address owner) public view returns (uint256) {
        return balances[owner];
    }

    /**
     * @dev Returns the allowance of tokens for a given owner and spender
     * @param owner Address that owns the tokens
     * @param spender Address that is approved to spend tokens
     * @return Allowance of tokens for the given owner and spender
     */
    function allowance(address owner, address spender) public view returns (uint256) {
        return allowances[owner][spender];
    }
}