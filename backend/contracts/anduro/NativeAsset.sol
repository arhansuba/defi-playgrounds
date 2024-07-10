// SPDX-License-Identifier: MIT 

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../Counter.sol";

contract NativeAsset {
    // Mapping of NFTs to their owners
    mapping (uint256 => address) public nftOwners;

    // Mapping of NFTs to their metadata
    mapping (uint256 => string) public nftMetadata;

    // Mapping of NFTs to their attributes (e.g., rarity, stats, etc.)
    mapping (uint256 => Attribute[]) public nftAttributes;

    // Event emitted when an NFT is minted
    event Mint(uint256 indexed nftId, address indexed owner, string metadata);

    // Event emitted when an NFT is transferred
    event Transfer(uint256 indexed nftId, address indexed from, address indexed to);

    // Event emitted when an NFT's attributes are updated
    event UpdateAttributes(uint256 indexed nftId, Attribute[] attributes);

    // Role for minters
    Roles.Role private minters;

    // Role for administrators
    Roles.Role private administrators;

    // Counter for NFT IDs
    using Counters for Counters.Counter;
    Counters.Counter private nftIdCounter;

    // Struct to represent an attribute (e.g., rarity, stats, etc.)
    struct Attribute {
        string key;
        string value;
    }

    // Constructor
    constructor() public {
        // Initialize roles
        minters.add(msg.sender);
        administrators.add(msg.sender);
    }

    // Mint a new NFT
    function mint(string memory _metadata, Attribute[] memory _attributes) public {
        require(minters.has(msg.sender), "Only minters can mint NFTs");
        uint256 nftId = nftIdCounter.current();
        nftIdCounter.increment();
        nftOwners[nftId] = msg.sender;
        nftMetadata[nftId] = _metadata;
        nftAttributes[nftId] = _attributes;
        emit Mint(nftId, msg.sender, _metadata);
    }

    // Transfer an NFT
    function transfer(uint256 _nftId, address _to) public {
        require(nftOwners[_nftId] == msg.sender, "Only the owner can transfer an NFT");
        nftOwners[_nftId] = _to;
        emit Transfer(_nftId, msg.sender, _to);
    }

    // Update an NFT's attributes
    function updateAttributes(uint256 _nftId, Attribute[] memory _attributes) public {
        require(nftOwners[_nftId] == msg.sender, "Only the owner can update an NFT's attributes");
        nftAttributes[_nftId] = _attributes;
        emit UpdateAttributes(_nftId, _attributes);
    }

    // Get the owner of an NFT
    function getOwner(uint256 _nftId) public view returns (address) {
        return nftOwners[_nftId];
    }

    // Get the metadata of an NFT
    function getMetadata(uint256 _nftId) public view returns (string memory) {
        return nftMetadata[_nftId];
    }

    // Get the attributes of an NFT
    function getAttributes(uint256 _nftId) public view returns (Attribute[] memory) {
        return nftAttributes[_nftId];
    }
}