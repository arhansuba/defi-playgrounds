// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../Counter.sol";

contract Staking is Ownable {
    using Math for uint256;
    using Counter for Counter.Counter;

    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 endTime;
        uint256 reward;
        bool active;
        uint256 stakeId;
    }

    IERC20 public token;
    uint256 public rewardRate = 100; // 100 tokens per day as an example
    uint256 public minStakeAmount = 1000 * 10**18; // Minimum stake amount required
    mapping(address => Stake[]) public stakes;
    Counters.Counter private stakeIdCounter;

    event Staked(address indexed user, uint256 amount, uint256 stakeId);
    event Unstaked(address indexed user, uint256 amount, uint256 reward, uint256 stakeId);

    constructor(address _token) {
        token = IERC20(_token);
    }

    function stake(uint256 _amount) external {
        require(_amount >= minStakeAmount, "Amount is below minimum stake");
        require(token.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        uint256 stakeId = stakeIdCounter.current();
        stakeIdCounter.increment();

        stakes[msg.sender].push(Stake({
            amount: _amount,
            startTime: block.timestamp,
            endTime: block.timestamp + 30 days, // Example: staking period of 30 days
            reward: 0,
            active: true,
            stakeId: stakeId
        }));

        emit Staked(msg.sender, _amount, stakeId);
    }

    function unstake(uint256 _stakeId) external {
        require(stakes[msg.sender].length > 0, "No active stakes");
        require(stakes[msg.sender][_stakeId].active, "Stake is not active");

        uint256 reward = calculateReward(msg.sender, _stakeId);
        uint256 amount = stakes[msg.sender][_stakeId].amount;

        require(token.transfer(msg.sender, amount + reward), "Transfer failed");

        stakes[msg.sender][_stakeId].active = false;

        emit Unstaked(msg.sender, amount, reward, _stakeId);
    }

    function calculateReward(address _user, uint256 _stakeId) public view returns (uint256) {
       // Stake memory stake = stakes[_user][_stakeId];

        if (!stake.active) {
            return 0;
        }

        uint256 endTime = block.timestamp < stake.endTime ? block.timestamp : stake.endTime;
        uint256 duration = endTime - stake.startTime;
        uint256 reward = duration * rewardRate;

        return reward;
    }

    function setRewardRate(uint256 _rewardRate) external onlyOwner {
        rewardRate = _rewardRate;
    }

    function setMinStakeAmount(uint256 _minStakeAmount) external onlyOwner {
        minStakeAmount = _minStakeAmount;
    }

    function getStakes(address _user) public view returns (Stake[] memory) {
        return stakes[_user];
    }
}
