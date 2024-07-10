// backend/contracts/Payment.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Payment is ERC20 {
    constructor() ERC20("PaymentToken", "PTK") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}
