import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const userInfo = localStorage.getItem('userInfoLms');
  let parsedUser = null;

  if (userInfo) {
    try {
      parsedUser = JSON.parse(userInfo);
    } catch (error) {
      parsedUser = null;
    }
  }

  const [user, setUser] = useState(parsedUser);

  const login = (user) => {
    setUser(user);
  };
  const logout = () => {
    localStorage.removeItem('userInfoLms');
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
