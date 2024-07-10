// SPDX-License-Identifier: MIT 
// UTXOIssuance.sol
pragma solidity ^0.8.0;

import "../Roles.sol";
import "../Counter.sol";

contract UTXOIssuance {
    using Roles for Roles.Role;
    using Counters for Counters.Counter;

    // Struct for UTXO
    struct UTXO {
        bytes32 txHash;
        uint256 index;
        uint256 amount;
        uint256 timestamp;
        address owner;
        // Additional fields as needed
    }

    // Mapping of UTXO ID to UTXO details
    mapping (bytes32 => UTXO) public utxos;

    // Mapping of address to list of UTXO IDs
    mapping (address => bytes32[]) public addressToUtxos;

    // Counter for UTXO IDs
    Counters.Counter private utxoIdCounter;

    // Role for UTXO issuers
    Roles.Role private issuers;

    // Role for UTXO administrators
    Roles.Role private administrators;

    // Event emitted when a new UTXO is issued
    event Issuance(bytes32 indexed utxoId, address indexed owner, uint256 amount);

    // Event emitted when a UTXO is transferred
    event Transfer(bytes32 indexed utxoId, address indexed from, address indexed to, uint256 amount);

    // Event emitted when a UTXO is updated
    event Update(bytes32 indexed utxoId, uint256 amount);

    // Constructor
    constructor() {
        // Initialize roles
        issuers.add(msg.sender);
        administrators.add(msg.sender);
    }

    // Function to issue a new UTXO
    function issueUTXO(address _to, bytes32 _txHash, uint256 _index, uint256 _amount) public {
        require(issuers.has(msg.sender), "Only issuers can issue UTXOs");
        
        bytes32 utxoId = keccak256(abi.encodePacked(_txHash, _index));
        utxoIdCounter.increment();
        utxos[utxoId] = UTXO(_txHash, _index, _amount, block.timestamp, _to);
        addressToUtxos[_to].push(utxoId);
        
        emit Issuance(utxoId, _to, _amount);
    }

    // Function to transfer a UTXO
    function transferUTXO(bytes32 _utxoId, address _to) public {
        require(msg.sender == utxos[_utxoId].owner, "Only the owner can transfer a UTXO");
        require(utxos[_utxoId].amount > 0, "UTXO has no value");

        // Transfer ownership
        utxos[_utxoId].owner = _to;
        addressToUtxos[_to].push(_utxoId);
        addressToUtxos[msg.sender].remove(_utxoId);
        
        emit Transfer(_utxoId, msg.sender, _to, utxos[_utxoId].amount);
    }

    // Function to update a UTXO
    function updateUTXO(bytes32 _utxoId, uint256 _amount) public {
        require(administrators.has(msg.sender), "Only administrators can update UTXOs");
        require(utxos[_utxoId].amount > 0, "UTXO has no value");

        // Update UTXO amount
        utxos[_utxoId].amount = _amount;
        
        emit Update(_utxoId, _amount);
    }

    // Function to get a UTXO by ID
    function getUTXO(bytes32 _utxoId) public view returns (UTXO memory) {
        return utxos[_utxoId];
    }

    // Function to get UTXOs by address
    function getUTXOsByAddress(address _address) public view returns (bytes32[] memory) {
        return addressToUtxos[_address];
    }
}