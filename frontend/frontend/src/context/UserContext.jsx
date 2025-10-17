// context/UserContext.js
import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: localStorage.getItem('patientName') || '',
    patientId: localStorage.getItem('patientId') || '',
    token: localStorage.getItem('doclinkToken') || '',
    userId: localStorage.getItem('userId') || '',
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};