// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";
import "./InterestRateModel.sol";

contract Borrowing {
    // Mapping of borrower addresses to their borrowed amounts
    mapping (address => uint256) public borrowedAmounts;

    // Mapping of borrower addresses to their collateral amounts
    mapping (address => uint256) public collateralAmounts;

    // Token contract instance
    Token public token;

    // Interest rate model instance
    InterestRateModel public interestRateModel;

    // Minimum collateral ratio required for borrowing
    uint256 public minCollateralRatio;

    // Event emitted when a borrower borrows tokens
    event Borrow(address indexed borrower, uint256 amount);

    // Event emitted when a borrower repays tokens
    event Repay(address indexed borrower, uint256 amount);

    // Event emitted when a borrower's collateral is liquidated
    event Liquidate(address indexed borrower, uint256 amount);

    /**
     * @dev Initializes the contract with the token and interest rate model instances
     * @param _token Token contract instance
     * @param _interestRateModel Interest rate model instance
     */
    constructor(Token _token, InterestRateModel _interestRateModel) {
        token = _token;
        interestRateModel = _interestRateModel;
        minCollateralRatio = 150; // 150% collateral ratio required
    }

    /**
     * @dev Allows a borrower to borrow tokens
     * @param amount Amount of tokens to borrow
     */
    function borrow(uint256 amount) public {
        // Check if the borrower has sufficient collateral
        require(collateralAmounts[msg.sender] >= amount * minCollateralRatio / 100, "Insufficient collateral");

        // Calculate the interest rate based on the borrowed amount and interest rate model
        uint256 interestRate = interestRateModel.getInterestRate(amount);

        // Update the borrower's borrowed amount and collateral amount
        borrowedAmounts[msg.sender] += amount;
        collateralAmounts[msg.sender] -= amount * minCollateralRatio / 100;

        // Transfer the borrowed tokens to the borrower
        token.transfer(msg.sender, amount);

        // Emit the Borrow event
        emit Borrow(msg.sender, amount);
    }

    /**
     * @dev Allows a borrower to repay tokens
     * @param amount Amount of tokens to repay
     */
    function repay(uint256 amount) public {
        // Check if the borrower has sufficient tokens to repay
        require(token.balanceOf(msg.sender) >= amount, "Insufficient tokens");

        // Update the borrower's borrowed amount and collateral amount
        borrowedAmounts[msg.sender] -= amount;
        collateralAmounts[msg.sender] += amount * minCollateralRatio / 100;

        // Transfer the repaid tokens to the contract
        token.transferFrom(msg.sender, address(this), amount);

        // Emit the Repay event
        emit Repay(msg.sender, amount);
    }

    /**
     * @dev Liquidates a borrower's collateral if their collateral ratio falls below the minimum
     * @param borrower Address of the borrower to liquidate
     */
    function liquidate(address borrower) public {
        // Check if the borrower's collateral ratio is below the minimum
        require(collateralAmounts[borrower] < borrowedAmounts[borrower] * minCollateralRatio / 100, "Collateral ratio is sufficient");

        // Calculate the amount of collateral to liquidate
        uint256 amount = borrowedAmounts[borrower] * minCollateralRatio / 100 - collateralAmounts[borrower];

        // Update the borrower's collateral amount
        collateralAmounts[borrower] -= amount;

        // Transfer the liquidated collateral to the contract
        token.transferFrom(borrower, address(this), amount);

        // Emit the Liquidate event
        emit Liquidate(borrower, amount);
    }
}