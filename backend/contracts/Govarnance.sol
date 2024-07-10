// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/access/Ownable.sol";

contract Governance is Ownable {
    // Mapping of proposals to their corresponding votes
    mapping(uint256 => mapping(address => bool)) public votes;

    // Mapping of proposals to their corresponding descriptions
    mapping(uint256 => string) public proposalDescriptions;

    // Mapping of proposals to their corresponding targets
    mapping(uint256 => address) public proposalTargets;

    // Mapping of proposals to their corresponding values
    mapping(uint256 => uint256) public proposalValues;

    // Mapping of proposals to their corresponding calldatas
    mapping(uint256 => bytes) public proposalCalldatas;

    // Proposal counter
    uint256 public proposalCount;

    // Event emitted when a new proposal is created
    event NewProposal(uint256 indexed proposalId, string description, address indexed target, uint256 value, bytes calldata);

    // Event emitted when a proposal is voted on
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool inFavor);

    // Event emitted when a proposal is executed
    event ProposalExecuted(uint256 indexed proposalId);

    /**
     * @dev Creates a new proposal
     * @param description Description of the proposal
     * @param target Target contract of the proposal
     * @param value Value of the proposal (e.g. amount of tokens to transfer)
     * @param calldata Calldata of the proposal (e.g. function signature and arguments)
     */
    function propose(string memory description, address target, uint256 value, bytes memory calldata) public onlyOwner {
        proposalCount++;
        proposalDescriptions[proposalCount] = description;
        proposalTargets[proposalCount] = target;
        proposalValues[proposalCount] = value;
        proposalCalldatas[proposalCount] = calldata;
        emit NewProposal(proposalCount, description, target, value, calldata);
    }

    /**
     * @dev Votes on a proposal
     * @param proposalId ID of the proposal to vote on
     * @param inFavor Whether the voter is in favor of the proposal
     */
    function vote(uint256 proposalId, bool inFavor) public {
        require(votes[proposalId][msg.sender] == false, "Already voted");
        votes[proposalId][msg.sender] = inFavor;
        emit VoteCast(proposalId, msg.sender, inFavor);
    }

    /**
     * @dev Executes a proposal if it has reached a quorum
     * @param proposalId ID of the proposal to execute
     */
    function executeProposal(uint256 proposalId) public onlyOwner {
        require(votes[proposalId][msg.sender], "Proposal not approved");
        (bool success, ) = proposalTargets[proposalId].call(proposalCalldatas[proposalId]);
        require(success, "Proposal execution failed");
        emit ProposalExecuted(proposalId);
    }
}
