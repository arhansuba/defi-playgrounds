// frontend/src/components/VotingPage.js
import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useApi from '../hooks/useApi';

const VotingPage = () => {
  const { user, token } = useAuth();
  const { data, error, isLoading, fetchData } = useApi('/proposals', token);

  useEffect(() => {
    if (!user) {
      // Redirect to login page if user is not logged in
      window.location.href = '/login';
    }
  }, [user]);

  const [selectedProposal, setSelectedProposal] = useState(null);
  const [vote, setVote] = useState({
    proposalId: '',
    vote: '',
  });

  const handleProposalSelect = (proposal) => {
    setSelectedProposal(proposal);
  };

  const handleVoteChange = (event) => {
    setVote({...vote, [event.target.name]: event.target.value });
  };

  const handleCastVote = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchData('/votes', 'POST', vote);
      console.log('Vote cast successfully:', response);
    } catch (error) {
      console.error('Error casting vote:', error);
    }
  };

  return (
    <div>
      <h1>Voting Page</h1>
      <h2>Select a proposal to vote on:</h2>
      <ul>
        {data.map((proposal) => (
          <li key={proposal.id}>
            <input
              type="radio"
              name="proposalId"
              value={proposal.id}
              onChange={() => handleProposalSelect(proposal)}
            />
            <span>{proposal.title}</span>
          </li>
        ))}
      </ul>
      {selectedProposal && (
        <div>
          <h2>Vote on {selectedProposal.title}:</h2>
          <form onSubmit={handleCastVote}>
            <label>
              Vote:
              <select name="vote" value={vote.vote} onChange={handleVoteChange}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="abstain">Abstain</option>
              </select>
            </label>
            <br />
            <button type="submit">Cast Vote</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default VotingPage;