// frontend/src/hooks/useAuth.js
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';

const useAuth = () => {
  const { user, token, login, logout, updateUser } = useContext(UserContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsAuthLoading(false);
  }, [token]);

  const authenticate = async (username, password) => {
    try {
      await login(username, password);
      setIsAuthenticated(true);
    } catch (error) {
      console.error(error);
    }
  };

  const unauthenticate = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    isAuthenticated,
    isAuthLoading,
    authenticate,
    unauthenticate,
    user,
    token,
    updateUser,
  };
};

export default useAuth;