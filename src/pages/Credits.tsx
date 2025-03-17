
import React from 'react';
import Header from '@/components/Header';
import { useCredits } from '@/context/CreditsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Coins, CreditCard, Plus } from 'lucide-react';
import { toast } from 'sonner';

const Credits = () => {
  const { creditBalance, addCredits } = useCredits();

  const handleAddCredits = (amount: number) => {
    // In a real app, this would open a payment modal or redirect to a payment page
    addCredits(amount);
    toast.success(`${amount.toLocaleString()} credits added successfully!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Credits</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="text-brand h-5 w-5" />
                Credit Balance
              </CardTitle>
              <CardDescription>
                Your credits are used when you save recordings and generate articles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total</span>
                  <span className="text-2xl font-bold">{creditBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Remaining</span>
                  <span className="text-2xl font-bold">{creditBalance.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-brand hover:bg-brand-dark" 
                onClick={() => handleAddCredits(5000)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add more credits
              </Button>
            </CardFooter>
          </Card>
          
          <h2 className="text-xl font-semibold mb-4">Credit Packages</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>For beginners</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">5,000</p>
                <p className="text-sm text-gray-500">Credits for approximately 10 tutorials</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleAddCredits(5000)}
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Buy for $25
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-brand">
              <CardHeader className="bg-brand/5">
                <CardTitle>Premium</CardTitle>
                <CardDescription>Our most popular package</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">15,000</p>
                <p className="text-sm text-gray-500">Credits for approximately 30 tutorials</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-brand hover:bg-brand-dark" 
                  onClick={() => handleAddCredits(15000)}
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Buy for $60
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For intensive use</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">50,000</p>
                <p className="text-sm text-gray-500">Credits for approximately 100 tutorials</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleAddCredits(50000)}
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Buy for $150
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">How credits are used</h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                <li className="flex justify-between">
                  <span>Save a recording</span>
                  <span className="font-semibold">500 credits</span>
                </li>
                <Separator />
                <li className="flex justify-between">
                  <span>Generate an article from recording</span>
                  <span className="font-semibold">1,000 credits</span>
                </li>
                <Separator />
                <li className="flex justify-between">
                  <span>Share tutorial</span>
                  <span className="font-semibold">Free</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Credits;
