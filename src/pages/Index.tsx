
import React, { useState } from 'react';
import Header from '@/components/Header';
import RecordButton from '@/components/RecordButton';
import RecordingStatus from '@/components/RecordingStatus';
import VideoPreview from '@/components/VideoPreview';
import TutorialsList from '@/components/TutorialsList';
import { useRecording } from '@/context/RecordingContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Index = () => {
  const { isRecording, recordedBlob } = useRecording();
  const [showTitleDialog, setShowTitleDialog] = useState(false);
  const [tutorialTitle, setTutorialTitle] = useState('');

  const handleSaveTutorial = () => {
    // In a real app, this would save the tutorial to your backend
    // For now, we'll just close the dialog
    setShowTitleDialog(false);
    setTutorialTitle('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {!isRecording && !recordedBlob && (
            <div className="mb-16 text-center">
              <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Crie tutoriais incríveis
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                Grave sua tela, adicione explicações e compartilhe conhecimento com seus colegas e clientes.
              </p>
              
              <div className="flex justify-center mb-10">
                <RecordButton />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center p-6 rounded-lg glassmorphism">
                  <div className="bg-brand/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Grave sua tela</h3>
                  <p className="text-gray-600 text-sm">Capture sua tela com áudio para criar tutoriais passo a passo</p>
                </div>
                
                <div className="text-center p-6 rounded-lg glassmorphism">
                  <div className="bg-brand/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Edite e personalize</h3>
                  <p className="text-gray-600 text-sm">Adicione destaques, textos e anotações para enriquecer seu tutorial</p>
                </div>
                
                <div className="text-center p-6 rounded-lg glassmorphism">
                  <div className="bg-brand/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Compartilhe facilmente</h3>
                  <p className="text-gray-600 text-sm">Compartilhe seus tutoriais com links ou exporte para diferentes formatos</p>
                </div>
              </div>
            </div>
          )}
          
          {isRecording && (
            <div className="my-8 flex flex-col items-center justify-center">
              <div className="mb-8">
                <RecordingStatus />
              </div>
              
              <div>
                <RecordButton />
              </div>
            </div>
          )}
          
          {recordedBlob && !isRecording && (
            <div className="mb-16">
              <VideoPreview />
              
              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={() => setShowTitleDialog(true)}
                  className="bg-brand hover:bg-brand-dark"
                >
                  Salvar tutorial
                </Button>
              </div>
            </div>
          )}
          
          {!isRecording && (
            <div className="mt-16">
              <TutorialsList />
            </div>
          )}
        </div>
      </main>
      
      <Dialog open={showTitleDialog} onOpenChange={setShowTitleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Salvar tutorial</DialogTitle>
            <DialogDescription>
              Dê um título para seu tutorial para facilitar seu acesso posteriormente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do tutorial</Label>
              <Input
                id="title"
                value={tutorialTitle}
                onChange={(e) => setTutorialTitle(e.target.value)}
                placeholder="Ex: Como criar um workspace no Notion"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowTitleDialog(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveTutorial}
              className="bg-brand hover:bg-brand-dark"
              disabled={!tutorialTitle}
            >
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
