
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Wallet } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCredits } from '@/context/CreditsContext';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const { creditBalance } = useCredits();

  return (
    <header className="w-full py-4 px-6 glassmorphism sticky top-0 z-50 flex items-center justify-between">
      <div className="flex items-center">
        <Link 
          to="/" 
          className="flex items-center gap-2 mr-8 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="text-2xl font-bold text-brand">
            Pathcx
          </span>
        </Link>
        
        <div className="relative hidden md:block w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            type="text" 
            placeholder="Search recordings" 
            className="pl-10 h-10 rounded-full border-gray-200 focus:border-brand focus:ring-brand/20" 
          />
        </div>
      </div>
      
      <nav className="flex items-center gap-6">
        <Link 
          to="/credits" 
          className="flex items-center gap-2 px-3 py-1.5 bg-brand/10 rounded-full text-sm font-medium text-brand hover:bg-brand/20 transition-colors"
        >
          <Wallet className="h-4 w-4" />
          <span>{creditBalance.toLocaleString()} credits</span>
        </Link>
        <Link 
          to="/" 
          className="text-sm font-medium text-gray-600 hover:text-brand transition-colors"
        >
          My guides
        </Link>
        <Link 
          to="/settings" 
          className="text-sm font-medium text-gray-600 hover:text-brand transition-colors"
        >
          Settings
        </Link>
        <Link 
          to="/profile" 
          className="text-sm font-medium text-gray-600 hover:text-brand transition-colors"
        >
          Profile
        </Link>
      </nav>
    </header>
  );
};

export default Header;
