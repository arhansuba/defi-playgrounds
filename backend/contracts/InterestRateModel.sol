// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InterestRateModel {
    // Mapping of borrowed amounts to their corresponding interest rates
    mapping (uint256 => uint256) public interestRates;

    // Minimum interest rate (e.g. 1% per annum)
    uint256 public minInterestRate;

    // Maximum interest rate (e.g. 10% per annum)
    uint256 public maxInterestRate;

    // Event emitted when the interest rate model is updated
    event InterestRateModelUpdated(uint256 minInterestRate, uint256 maxInterestRate);

    /**
     * @dev Initializes the contract with the minimum and maximum interest rates
     * @param _minInterestRate Minimum interest rate (e.g. 1% per annum)
     * @param _maxInterestRate Maximum interest rate (e.g. 10% per annum)
     */
    constructor(uint256 _minInterestRate, uint256 _maxInterestRate) {
        minInterestRate = _minInterestRate;
        maxInterestRate = _maxInterestRate;
    }

    /**
     * @dev Calculates the interest rate for a given borrowed amount
     * @param amount Borrowed amount
     * @return Interest rate for the given borrowed amount
     */
    function getInterestRate(uint256 amount) public view returns (uint256) {
        // Simple linear interest rate model: interest rate increases with borrowed amount
        uint256 interestRate = minInterestRate + (amount * (maxInterestRate - minInterestRate)) / 1000000;
        return interestRate;
    }

    /**
     * @dev Updates the minimum and maximum interest rates
     * @param _minInterestRate New minimum interest rate
     * @param _maxInterestRate New maximum interest rate
     */
    function updateInterestRateModel(uint256 _minInterestRate, uint256 _maxInterestRate) public {
        minInterestRate = _minInterestRate;
        maxInterestRate = _maxInterestRate;
        emit InterestRateModelUpdated(_minInterestRate, _maxInterestRate);
    }
}