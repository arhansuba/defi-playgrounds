// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Lending is Ownable {
    using Math for uint256;

    // Structure representing a loan
    struct Loan {
        uint256 id;
        address borrower;
        address collateralAsset;
        address loanAsset;
        uint256 collateralAmount;
        uint256 loanAmount;
        uint256 duration;
        uint256 interestRate;
        uint256 startTime;
        uint256 endTime;
        bool active;
        bool repaid;
    }

    // Array of all loans
    Loan[] public loans;

    // Mapping of borrower to loans
    mapping(address => uint256[]) public borrowerLoans;

    // ERC20 token for collateral
    IERC20 public collateralToken;

    // ERC20 token for loan
    IERC20 public loanToken;

    // Interest rate model
    uint256 public interestRateModel;

    // Events
    event LoanCreated(uint256 indexed id, address indexed borrower, uint256 collateralAmount, uint256 loanAmount);
    event LoanRepaid(uint256 indexed id, address indexed borrower, uint256 loanAmount);

    // Constructor to set ERC20 tokens and interest rate model
    constructor(address _collateralToken, address _loanToken, uint256 _interestRateModel) Ownable() {
        collateralToken = IERC20(_collateralToken);
        loanToken = IERC20(_loanToken);
        interestRateModel = _interestRateModel;
    }

    // Function to create a new loan
    function createLoan(
        uint256 _collateralAmount,
        uint256 _loanAmount,
        uint256 _duration,
        uint256 _interestRate
    ) external {
        require(_collateralAmount > 0, "Collateral amount must be greater than 0");
        require(_loanAmount > 0, "Loan amount must be greater than 0");

        // Transfer collateral from borrower to contract
        require(collateralToken.transferFrom(msg.sender, address(this), _collateralAmount), "Failed to transfer collateral");

        uint256 loanId = loans.length;

        loans.push(Loan({
            id: loanId,
            borrower: msg.sender,
            collateralAsset: address(collateralToken),
            loanAsset: address(loanToken),
            collateralAmount: _collateralAmount,
            loanAmount: _loanAmount,
            duration: _duration,
            interestRate: _interestRate,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration,
            active: true,
            repaid: false
        }));

        borrowerLoans[msg.sender].push(loanId);

        emit LoanCreated(loanId, msg.sender, _collateralAmount, _loanAmount);
    }

    // Function to repay a loan
    function repayLoan(uint256 _loanId, uint256 _repayAmount) external {
        Loan storage loan = loans[_loanId];
        require(loan.active && !loan.repaid, "Loan is not active or already repaid");
        require(msg.sender == loan.borrower, "Only borrower can repay the loan");

        // Calculate interest
        uint256 interest = calculateInterest(loan);

        // Transfer loan amount from borrower to contract
        require(loanToken.transferFrom(msg.sender, address(this), _repayAmount.add(interest)), "Failed to transfer loan amount");

        // Transfer collateral back to borrower
        require(collateralToken.transfer(msg.sender, loan.collateralAmount), "Failed to transfer collateral back to borrower");

        loan.repaid = true;
        loan.active = false;

        emit LoanRepaid(_loanId, msg.sender, _repayAmount);
    }

    // Function to calculate interest
    function calculateInterest(Loan storage loan) internal view returns (uint256) {
        uint256 interest = loan.loanAmount.mul(loan.interestRate).div(100);
        return interest;
    }

    // Function to get total loans
    function getTotalLoans() external view returns (uint256) {
        return loans.length;
    }

    // Function to get borrower's loans
    function getBorrowerLoans(address _borrower) external view returns (uint256[] memory) {
        return borrowerLoans[_borrower];
    }

    // Function to set interest rate model
    function setInterestRateModel(uint256 _interestRateModel) external onlyOwner {
        interestRateModel = _interestRateModel;
    }
}
