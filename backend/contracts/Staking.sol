// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract Staking {
    // Mapping of user addresses to their staked balances
    mapping (address => StakedBalance) public stakedBalances;

    // Mapping of user addresses to their staking rewards
    mapping (address => uint256) public stakingRewards;

    // Total staked balance
    uint256 public totalStakedBalance;

    // Staking reward rate (e.g. 10% per year)
    uint256 public stakingRewardRate;

    // Minimum staking period (e.g. 30 days)
    uint256 public minStakingPeriod;

    // Maximum staking period (e.g. 1 year)
    uint256 public maxStakingPeriod;

    // Event emitted when a user stakes tokens
    event Staked(address indexed user, uint256 amount, uint256 timestamp);

    // Event emitted when a user unstakes tokens
    event Unstaked(address indexed user, uint256 amount, uint256 timestamp);

    // Event emitted when a user claims staking rewards
    event RewardsClaimed(address indexed user, uint256 amount, uint256 timestamp);

    struct StakedBalance {
        uint256 amount;
        uint256 timestamp;
    }

    /**
     * @dev Initializes the contract
     */
    constructor() {
        stakingRewardRate = 10**16; // 10% per year
        minStakingPeriod = 30 days;
        maxStakingPeriod = 365 days; // Adjusted to 1 year in seconds
    }

    /**
     * @dev Stakes tokens for a user
     * @param _amount Amount of tokens to stake
     */
    function stake(uint256 _amount) public {
        require(_amount > 0, "Cannot stake 0 tokens");

        StakedBalance storage stakedBalance = stakedBalances[msg.sender];
        stakedBalance.amount += _amount;
        stakedBalance.timestamp = block.timestamp;

        totalStakedBalance += _amount;

        emit Staked(msg.sender, _amount, block.timestamp);
    }

    /**
     * @dev Unstakes tokens for a user
     * @param _amount Amount of tokens to unstake
     */
    function unstake(uint256 _amount) public {
        require(_amount > 0, "Cannot unstake 0 tokens");
        require(stakedBalances[msg.sender].amount >= _amount, "Insufficient staked balance");
        require(block.timestamp - stakedBalances[msg.sender].timestamp >= minStakingPeriod, "Staking period not met");

        StakedBalance storage stakedBalance = stakedBalances[msg.sender];
        stakedBalance.amount -= _amount;

        totalStakedBalance -= _amount;

        emit Unstaked(msg.sender, _amount, block.timestamp);
    }

    /**
     * @dev Claims staking rewards for a user
     */
    function claimRewards() public {
        uint256 rewards = calculateRewards(msg.sender);
        stakingRewards[msg.sender] += rewards;

        emit RewardsClaimed(msg.sender, rewards, block.timestamp);
    }

    /**
     * @dev Calculates the staking rewards for a user
     * @param _user Address of the user to calculate rewards for
     * @return Staking rewards for the user
     */
    function calculateRewards(address _user) public view returns (uint256) {
        StakedBalance storage stakedBalance = stakedBalances[_user];
        uint256 timeStaked = block.timestamp - stakedBalance.timestamp;
        uint256 rewards = (stakedBalance.amount * stakingRewardRate * timeStaked) / (1e18);

        return rewards;
    }
}
