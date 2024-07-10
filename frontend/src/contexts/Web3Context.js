// frontend/src/contexts/Web3Context.js
import React, { createContext, useState, useEffect } from 'react';
import getWeb3 from '../services/web3';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      const web3Instance = await getWeb3();
      setWeb3(web3Instance);
    };
    initWeb3();
  }, []);

  return (
    <Web3Context.Provider value={{ web3 }}>
      {children}
    </Web3Context.Provider>
  );
};
