
import React, { createContext, useContext, useState } from 'react';

interface CreditsContextType {
  creditBalance: number;
  addCredits: (amount: number) => void;
  spendCredits: (amount: number) => boolean; // Returns whether the operation was successful
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const CreditsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [creditBalance, setCreditBalance] = useState(10000); // Start with 10,000 credits

  const addCredits = (amount: number) => {
    setCreditBalance(prevBalance => prevBalance + amount);
  };

  const spendCredits = (amount: number): boolean => {
    if (creditBalance >= amount) {
      setCreditBalance(prevBalance => prevBalance - amount);
      return true;
    }
    return false;
  };

  return (
    <CreditsContext.Provider
      value={{
        creditBalance,
        addCredits,
        spendCredits,
      }}
    >
      {children}
    </CreditsContext.Provider>
  );
};

export const useCredits = (): CreditsContextType => {
  const context = useContext(CreditsContext);
  
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  
  return context;
};
