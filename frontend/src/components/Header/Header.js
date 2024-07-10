// frontend/src/components/Header.js
import React from 'eact';

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><a href="#" className="active">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
      <h1>DeFi Playgrounds</h1>
    </header>
  );
}

export default Header;