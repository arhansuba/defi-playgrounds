// frontend/src/components/ProposalList.js
import React, { useState, useEffect } from 'eact';
import useAuth from '../hooks/useAuth';
import useApi from '../hooks/useApi';

const ProposalList = () => {
  const { user, token } = useAuth();
  const { data, error, isLoading, fetchData } = useApi('/proposals', token);

  useEffect(() => {
    if (!user) {
      // Redirect to login page if user is not logged in
      window.location.href = '/login';
    }
  }, [user]);

  const [filter, setFilter] = useState({
    status: 'all',
  });

  const handleFilterChange = (event) => {
    setFilter({...filter, [event.target.name]: event.target.value });
  };

  const filteredProposals = data.filter((proposal) => {
    if (filter.status === 'all') return true;
    return proposal.status === filter.status;
  });

  return (
    <div>
      <h1>Proposal List</h1>
      <form>
        <label>
          Filter by status:
          <select name="status" value={filter.status} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
      </form>
      <ul>
        {filteredProposals.map((proposal) => (
          <li key={proposal.id}>
            <h2>{proposal.title}</h2>
            <p>{proposal.description}</p>
            <p>Status: {proposal.status}</p>
            <p>Created at: {proposal.createdAt}</p>
            <p>Updated at: {proposal.updatedAt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProposalList;