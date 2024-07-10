// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "./InterestRateModel.sol";
import "./Governance.sol";

contract Lending {
    // Mapping of users to their borrowed amounts
    mapping (address => uint256) public borrowedAmounts;

    // Mapping of users to their collateral amounts
    mapping (address => uint256) public collateralAmounts;

    // Mapping of users to their interest rates
    mapping (address => uint256) public interestRates;

    // ERC20 token contract
    ERC20 public token;

    // Interest rate model contract
    InterestRateModel public interestRateModel;

    // Governance contract
    Governance public governance;

    // Event emitted when a user borrows tokens
    event Borrow(address user, uint256 amount);

    // Event emitted when a user repays tokens
    event Repay(address user, uint256 amount);

    // Event emitted when a user's collateral is liquidated
    event Liquidate(address user, uint256 amount);

    /**
     * @dev Initializes the contract with the ERC20 token, interest rate model, and governance contracts
     * @param _token ERC20 token contract
     * @param _interestRateModel Interest rate model contract
     * @param _governance Governance contract
     */
    constructor(ERC20 _token, InterestRateModel _interestRateModel, Governance _governance) {
        token = _token;
        interestRateModel = _interestRateModel;
        governance = _governance;
    }

    /**
     * @dev Allows a user to borrow tokens
     * @param amount Amount of tokens to borrow
     */
    function borrow(uint256 amount) public {
        require(amount > 0, "Invalid amount");
        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance");
        borrowedAmounts[msg.sender] += amount;
        interestRates[msg.sender] = interestRateModel.getInterestRate(amount);
        emit Borrow(msg.sender, amount);
    }

    /**
     * @dev Allows a user to repay tokens
     * @param amount Amount of tokens to repay
     */
    function repay(uint256 amount) public {
        require(amount > 0, "Invalid amount");
        require(borrowedAmounts[msg.sender] >= amount, "Insufficient borrowed amount");
        borrowedAmounts[msg.sender] -= amount;
        emit Repay(msg.sender, amount);
    }

    /**
     * @dev Allows a user to deposit collateral
     * @param amount Amount of tokens to deposit as collateral
     */
    function depositCollateral(uint256 amount) public {
        require(amount > 0, "Invalid amount");
        collateralAmounts[msg.sender] += amount;
    }

    /**
     * @dev Liquidates a user's collateral if they default on their loan
     * @param user User to liquidate
     */
    function liquidate(address user) public {
        require(borrowedAmounts[user] > 0, "User has no outstanding loan");
        require(collateralAmounts[user] > 0, "User has no collateral");
        uint256 amount = borrowedAmounts[user];
        borrowedAmounts[user] = 0;
        collateralAmounts[user] -= amount;
        emit Liquidate(user, amount);
    }

    /**
     * @dev Updates the interest rate model
     * @param _minInterestRate New minimum interest rate
     * @param _maxInterestRate New maximum interest rate
     */
    function updateInterestRateModel(uint256 _minInterestRate, uint256 _maxInterestRate) public {
        require(governance.isOwner(msg.sender), "Only the owner can update the interest rate model");
        interestRateModel.updateInterestRateModel(_minInterestRate, _maxInterestRate);
    }
}