// frontend/src/components/Navbar.js
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const { user, token, logout } = useContext(UserContext);

  if (!token) {
    return <div>You are not logged in</div>;
  }

  return (
    <nav>
      <span>Welcome, {user.name}!</span>
      <button onClick={logout}>Log out</button>
    </nav>
  );
};