// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract MerchantRegistry {
    // Mapping of merchant addresses to their registration status
    mapping (address => Merchant) public merchants;

    // Mapping of merchant IDs to their corresponding addresses
    mapping (uint256 => address) public merchantIdToAddress;

    // Mapping of merchant categories to their corresponding merchants
    mapping (string => address[]) public merchantCategories;

    // Event emitted when a merchant is registered
    event MerchantRegistered(address merchant, uint256 merchantId);

    // Event emitted when a merchant is deregistered
    event MerchantDeregistered(address merchant, uint256 merchantId);

    struct Merchant {
        uint256 merchantId;
        string name;
        string description;
        address walletAddress;
        bool isActive;
        string[] categories;
    }

    // Merchant ID counter
    uint256 public merchantIdCounter;

    /**
     * @dev Initializes the contract
     */
    constructor() public {
        merchantIdCounter = 0;
    }

    /**
     * @dev Registers a merchant
     * @param _merchant Address of the merchant to register
     * @param _name Name of the merchant
     * @param _description Description of the merchant
     * @param _walletAddress Wallet address of the merchant
     * @param _categories Categories of the merchant
     */
    function registerMerchant(address _merchant, string memory _name, string memory _description, address _walletAddress, string[] memory _categories) public {
        require(!merchants[_merchant].isActive, "Merchant is already registered");

        merchantIdCounter++;
        merchants[_merchant] = Merchant(merchantIdCounter, _name, _description, _walletAddress, true, _categories);
        merchantIdToAddress[merchantIdCounter] = _merchant;

        for (uint256 i = 0; i < _categories.length; i++) {
            string memory category = _categories[i];
            merchantCategories[category].push(_merchant);
        }

        emit MerchantRegistered(_merchant, merchantIdCounter);
    }

    /**
     * @dev Deregisters a merchant
     * @param _merchant Address of the merchant to deregister
     */
    function deregisterMerchant(address _merchant) public {
        require(merchants[_merchant].isActive, "Merchant is not registered");

        uint256 merchantId = merchants[_merchant].merchantId;
        delete merchants[_merchant];
        delete merchantIdToAddress[merchantId];

        for (uint256 i = 0; i < merchants[_merchant].categories.length; i++) {
            string memory category = merchants[_merchant].categories[i];
            address[] storage categoryMerchants = merchantCategories[category];
            for (uint256 j = 0; j < categoryMerchants.length; j++) {
                if (categoryMerchants[j] == _merchant) {
                    categoryMerchants[j] = categoryMerchants[categoryMerchants.length - 1];
                    categoryMerchants.pop();
                    break;
                }
            }
        }

        emit MerchantDeregistered(_merchant, merchantId);
    }

    /**
     * @dev Checks if a merchant is registered
     * @param _merchant Address of the merchant to check
     * @return True if the merchant is registered, false otherwise
     */
    function isMerchant(address _merchant) public view returns (bool) {
        return merchants[_merchant].isActive;
    }

    /**
     * @dev Gets a merchant's information
     * @param _merchant Address of the merchant to get information for
     * @return Merchant information (name, description, wallet address, categories)
     */
    function getMerchantInfo(address _merchant) public view returns (string memory, string memory, address, string[] memory) {
        Merchant storage merchant = merchants[_merchant];
        return (merchant.name, merchant.description, merchant.walletAddress, merchant.categories);
    }

    /**
     * @dev Gets a list of merchants in a specific category
     * @param _category Category to get merchants for
     * @return List of merchant addresses in the category
     */
    function getMerchantsInCategory(string memory _category) public view returns (address[] memory) {
        return merchantCategories[_category];
    }
}