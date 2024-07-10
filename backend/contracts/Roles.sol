// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";



import "@openzeppelin/contracts/access/AccessControl.sol";
contract Roles {
    using Roles for Roles.Role;

    Roles.Role private admins;

    constructor() {
        admins.add(msg.sender);
    }

    function isAdmin(address account) public view returns (bool) {
        return admins.has(account);
    }
}
contract RoleContract is AccessControl {
    // Define role constants
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");

    constructor() {
        // Assign the deployer the default admin role
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        // Assign additional roles to the deployer
        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(MODERATOR_ROLE, msg.sender);
    }

    // Function to grant admin role
    function grantAdmin(address account) external {
        grantRole(ADMIN_ROLE, account);
    }

    // Function to revoke admin role
    function revokeAdmin(address account) external {
        revokeRole(ADMIN_ROLE, account);
    }

    // Function to check if an address has admin role
    function isAdmin(address account) public view returns (bool) {
        return hasRole(ADMIN_ROLE, account);
    }

    // Function to grant moderator role
    function grantModerator(address account) external {
        grantRole(MODERATOR_ROLE, account);
    }

    // Function to revoke moderator role
    function revokeModerator(address account) external {
        revokeRole(MODERATOR_ROLE, account);
    }

    // Function to check if an address has moderator role
    function isModerator(address account) public view returns (bool) {
        return hasRole(MODERATOR_ROLE, account);
    }
}

contract MyContract is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function grantAdmin(address account) external {
        grantRole(ADMIN_ROLE, account);
    }

    function revokeAdmin(address account) external {
        revokeRole(ADMIN_ROLE, account);
    }

    function isAdmin(address account) public view returns (bool) {
        return hasRole(ADMIN_ROLE, account);
    }
}
