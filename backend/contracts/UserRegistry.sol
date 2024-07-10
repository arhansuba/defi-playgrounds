// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract UserRegistry {
    // Mapping of user addresses to their registration status
    mapping (address => User) public users;

    // Mapping of user IDs to their corresponding addresses
    mapping (uint256 => address) public userIdToAddress;

    // Mapping of user roles to their corresponding permissions
    mapping (uint256 => Role) public roles;

    // Event emitted when a user is registered
    event UserRegistered(address user, uint256 userId, uint256 roleId);

    // Event emitted when a user is deregistered
    event UserDeregistered(address user, uint256 userId);

    // Event emitted when a user's role is updated
    event UserRoleUpdated(address user, uint256 userId, uint256 roleId);

    struct User {
        uint256 userId;
        uint256 roleId;
        bool isActive;
    }

    struct Role {
        uint256 roleId;
        string roleName;
        uint256[] permissions;
    }

    // Administrator role ID
    uint256 public adminRoleId;

    // User ID counter
    uint256 public userIdCounter;

    /**
     * @dev Initializes the contract with the administrator role ID
     * @param _adminRoleId Administrator role ID
     */
    constructor(uint256 _adminRoleId) public {
        adminRoleId = _adminRoleId;
        userIdCounter = 0;
    }

    /**
     * @dev Registers a user with a given role
     * @param _user Address of the user to register
     * @param _roleId Role ID of the user
     */
    function registerUser(address _user, uint256 _roleId) public {
        require(!users[_user].isActive, "User is already registered");
        require(roles[_roleId].roleId!= 0, "Role does not exist");

        userIdCounter++;
        users[_user] = User(userIdCounter, _roleId, true);
        userIdToAddress[userIdCounter] = _user;

        emit UserRegistered(_user, userIdCounter, _roleId);
    }

    /**
     * @dev Deregisters a user
     * @param _user Address of the user to deregister
     */
    function deregisterUser(address _user) public {
        require(users[_user].isActive, "User is not registered");

        uint256 userId = users[_user].userId;
        delete users[_user];
        delete userIdToAddress[userId];

        emit UserDeregistered(_user, userId);
    }

    /**
     * @dev Updates a user's role
     * @param _user Address of the user to update
     * @param _roleId New role ID of the user
     */
    function updateUserRole(address _user, uint256 _roleId) public {
        require(users[_user].isActive, "User is not registered");
        require(roles[_roleId].roleId!= 0, "Role does not exist");

        users[_user].roleId = _roleId;

        emit UserRoleUpdated(_user, users[_user].userId, _roleId);
    }

    /**
     * @dev Checks if a user is registered
     * @param _user Address of the user to check
     * @return True if the user is registered, false otherwise
     */
    function isUser(address _user) public view returns (bool) {
        return users[_user].isActive;
    }

    /**
     * @dev Checks if a user has a specific role
     * @param _user Address of the user to check
     * @param _roleId Role ID to check
     * @return True if the user has the role, false otherwise
     */
    function hasRole(address _user, uint256 _roleId) public view returns (bool) {
        return users[_user].roleId == _roleId;
    }

    /**
     * @dev Checks if a user has a specific permission
     * @param _user Address of the user to check
     * @param _permission Permission to check
     * @return True if the user has the permission, false otherwise
     */
    function hasPermission(address _user, uint256 _permission) public view returns (bool) {
        uint256 roleId = users[_user].roleId;
        Role storage role = roles[roleId];
        for (uint256 i = 0; i < role.permissions.length; i++) {
            if (role.permissions[i] == _permission) {
                return true;
            }
        }
        return false;
    }
}