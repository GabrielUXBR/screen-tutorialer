
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
    toast.success(`${amount.toLocaleString()} créditos adicionados com sucesso!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Seus Créditos</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="text-brand h-5 w-5" />
                Saldo de Créditos
              </CardTitle>
              <CardDescription>
                Seus créditos são usados quando você salva gravações e gera artigos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total</span>
                  <span className="text-2xl font-bold">{creditBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Restantes</span>
                  <span className="text-2xl font-bold">{creditBalance.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-brand hover:bg-brand-dark" 
                onClick={() => handleAddCredits(5000)}
              >
                <Plus className="mr-2 h-4 w-4" /> Adicionar mais créditos
              </Button>
            </CardFooter>
          </Card>
          
          <h2 className="text-xl font-semibold mb-4">Pacotes de Créditos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Básico</CardTitle>
                <CardDescription>Para quem está começando</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">5.000</p>
                <p className="text-sm text-gray-500">Créditos suficientes para aproximadamente 10 tutoriais</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleAddCredits(5000)}
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Comprar por R$25
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-brand">
              <CardHeader className="bg-brand/5">
                <CardTitle>Premium</CardTitle>
                <CardDescription>Nosso pacote mais popular</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">15.000</p>
                <p className="text-sm text-gray-500">Créditos suficientes para aproximadamente 30 tutoriais</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-brand hover:bg-brand-dark" 
                  onClick={() => handleAddCredits(15000)}
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Comprar por R$60
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>Para uso intensivo</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">50.000</p>
                <p className="text-sm text-gray-500">Créditos suficientes para aproximadamente 100 tutoriais</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleAddCredits(50000)}
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Comprar por R$150
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Como os créditos são usados</h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                <li className="flex justify-between">
                  <span>Salvar uma gravação</span>
                  <span className="font-semibold">500 créditos</span>
                </li>
                <Separator />
                <li className="flex justify-between">
                  <span>Gerar um artigo a partir da gravação</span>
                  <span className="font-semibold">1.000 créditos</span>
                </li>
                <Separator />
                <li className="flex justify-between">
                  <span>Compartilhar tutorial</span>
                  <span className="font-semibold">Grátis</span>
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
