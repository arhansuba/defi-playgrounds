// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./Govarnance.sol";
import "./UserRegistry.sol";
import "./MerchantRegistry.sol";
import "./KYC.sol"; // Add KYC contract for AML checks

contract Payment {
    // Mapping of users to their payment balances
    mapping (address => uint256) public userBalances;

    // Mapping of merchants to their payment balances
    mapping (address => uint256) public merchantBalances;

    // Mapping of payment IDs to payment details
    mapping (bytes32 => PaymentDetails) public paymentDetails;

    // ERC20 token contract
    ERC20 public token;

    // Governance contract
    Governance public governance;

    // User registry contract
    UserRegistry public userRegistry;

    // Merchant registry contract
    MerchantRegistry public merchantRegistry;

    // KYC contract for AML checks
    KYC public kyc;

    // Event emitted when a payment is made
    event PaymentMade(bytes32 paymentId, address user, address merchant, uint256 amount);

    // Event emitted when a payment is refunded
    event PaymentRefunded(bytes32 paymentId, address user, address merchant, uint256 amount);

    // Event emitted when a payment is disputed
    event PaymentDisputed(bytes32 paymentId, address user, address merchant);

    struct PaymentDetails {
        bytes32 paymentId;
        address user;
        address merchant;
        uint256 amount;
        uint256 timestamp;
        bool isRefunded;
        bool isDisputed;
    }

    /**
     * @dev Initializes the contract with the ERC20 token, governance, user registry, merchant registry, and KYC contracts
     * @param _token ERC20 token contract
     * @param _governance Governance contract
     * @param _userRegistry User registry contract
     * @param _merchantRegistry Merchant registry contract
     * @param _kyc KYC contract
     */
    constructor(ERC20 _token, Governance _governance, UserRegistry _userRegistry, MerchantRegistry _merchantRegistry, KYC _kyc) {
        token = _token;
        governance = _governance;
        userRegistry = _userRegistry;
        merchantRegistry = _merchantRegistry;
        kyc = _kyc;
    }

    /**
     * @dev Allows a user to make a payment to a merchant
     * @param _merchant Address of the merchant
     * @param _amount Amount of tokens to pay
     */
    function makePayment(address _merchant, uint256 _amount) public {
        require(userRegistry.isUser(msg.sender), "Only users can make payments");
        require(merchantRegistry.isMerchant(_merchant), "Only merchants can receive payments");
        require(kyc.checkAML(msg.sender, _amount), "AML check failed");
        require(token.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        bytes32 paymentId = keccak256(abi.encodePacked(msg.sender, _merchant, _amount, block.timestamp));
        paymentDetails[paymentId] = PaymentDetails(paymentId, msg.sender, _merchant, _amount, block.timestamp, false, false);

        userBalances[msg.sender] -= _amount;
        merchantBalances[_merchant] += _amount;

        emit PaymentMade(paymentId, msg.sender, _merchant, _amount);
    }

    /**
     * @dev Allows a merchant to refund a payment to a user
     * @param _paymentId Payment ID of the payment to refund
     */
    function refundPayment(bytes32 _paymentId) public {
        require(merchantRegistry.isMerchant(msg.sender), "Only merchants can refund payments");
        require(paymentDetails[_paymentId].merchant == msg.sender, "Only the merchant can refund this payment");
        require(!paymentDetails[_paymentId].isRefunded, "Payment has already been refunded");

        uint256 amount= paymentDetails[_paymentId].amount;
        paymentDetails[_paymentId].isRefunded = true;

        userBalances[paymentDetails[_paymentId].user] += amount;
        merchantBalances[msg.sender] -= amount;

        emit PaymentRefunded(_paymentId, paymentDetails[_paymentId].user, msg.sender, amount);
    }

    /**
     * @dev Allows a user to dispute a payment
     * @param _paymentId Payment ID of the payment to dispute
     */
    function disputePayment(bytes32 _paymentId) public {
        require(userRegistry.isUser(msg.sender), "Only users can dispute payments");
        require(paymentDetails[_paymentId].user == msg.sender, "Only the user can dispute this payment");
        require(paymentDetails[_paymentId].merchantBalances[msg.sender], "Only the user can dispute this payment");
        require(!paymentDetails[_paymentId].isDisputed, "Payment has already been disputed");
          paymentDetails[_paymentId].isDisputed = true;

    emit PaymentDisputed(_paymentId, msg.sender, paymentDetails[_paymentId].merchant);
}
}