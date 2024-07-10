// frontend/src/components/StakingPage.js
import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useApi from '../hooks/useApi';

const StakingPage = () => {
  const { user, token } = useAuth();
  const { data, error, isLoading, fetchData } = useApi('/staking', token);

  useEffect(() => {
    if (!user) {
      // Redirect to login page if user is not logged in
      window.location.href = '/login';
    }
  }, [user]);

  const [stakingForm, setStakingForm] = useState({
    amount: '',
    lockPeriod: '',
  });

  const handleStake = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchData('/staking', 'POST', stakingForm);
      console.log('Stake successful:', response);
    } catch (error) {
      console.error('Error staking:', error);
    }
  };

  const handleUnstake = async (stakeId) => {
    try {
      const response = await fetchData(`/staking/${stakeId}`, 'DELETE');
      console.log('Unstake successful:', response);
    } catch (error) {
      console.error('Error unstaking:', error);
    }
  };

  return (
    <div>
      <h1>Staking Page</h1>
      <form onSubmit={handleStake}>
        <label>
          Amount:
          <input type="number" name="amount" value={stakingForm.amount} onChange={(event) => setStakingForm({ ...stakingForm, amount: event.target.value })} />
        </label>
        <br />
        <label>
          Lock Period:
          <select name="lockPeriod" value={stakingForm.lockPeriod} onChange={(event) => setStakingForm({ ...stakingForm, lockPeriod: event.target.value })}>
            <option value="30">30 days</option>
            <option value="60">60 days</option>
            <option value="90">90 days</option>
          </select>
        </label>
        <br />
        <button type="submit">Stake</button>
      </form>
      <h2>Current Stakes</h2>
      <ul>
        {data && data.map((stake) => (
          <li key={stake.id}>
            Amount: {stake.amount}
            Lock Period: {stake.lockPeriod}
            <button onClick={() => handleUnstake(stake.id)}>Unstake</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StakingPage;