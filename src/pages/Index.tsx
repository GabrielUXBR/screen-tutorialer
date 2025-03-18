
import React, { useState } from 'react';
import Header from '@/components/Header';
import RecordButton from '@/components/RecordButton';
import RecordingStatus from '@/components/RecordingStatus';
import VideoPreview from '@/components/VideoPreview';
import TutorialsList from '@/components/TutorialsList';
import { useRecording } from '@/context/RecordingContext';
import { useCredits } from '@/context/CreditsContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { isRecording, recordedBlob, addTutorial, resetRecording } = useRecording();
  const { creditBalance, spendCredits } = useCredits();
  const [showTitleDialog, setShowTitleDialog] = useState(false);
  const [tutorialTitle, setTutorialTitle] = useState('');
  const [showInsufficientCreditsDialog, setShowInsufficientCreditsDialog] = useState(false);
  const navigate = useNavigate();

  const SAVE_TUTORIAL_COST = 500;

  const handleSaveTutorial = () => {
    if (spendCredits(SAVE_TUTORIAL_COST)) {
      // Add the tutorial to our list
      if (recordedBlob) {
        addTutorial(tutorialTitle, recordedBlob);
      }
      
      toast.success(`Tutorial "${tutorialTitle}" saved successfully!`);
      toast.info(`${SAVE_TUTORIAL_COST} credits have been used`);
      setShowTitleDialog(false);
      setTutorialTitle('');
      resetRecording(); // Clear the recording after saving
    } else {
      setShowTitleDialog(false);
      setShowInsufficientCreditsDialog(true);
    }
  };

  const handleTryToSave = () => {
    if (creditBalance < SAVE_TUTORIAL_COST) {
      setShowInsufficientCreditsDialog(true);
    } else {
      setShowTitleDialog(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {!isRecording && !recordedBlob && (
            <div className="mb-16 text-center">
              <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create amazing tutorials
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                Record your screen, add explanations, and share knowledge with your colleagues and clients.
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
                  <h3 className="text-lg font-medium mb-2">Record your screen</h3>
                  <p className="text-gray-600 text-sm">Capture your screen with audio to create step-by-step tutorials</p>
                </div>
                
                <div className="text-center p-6 rounded-lg glassmorphism">
                  <div className="bg-brand/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Edit and customize</h3>
                  <p className="text-gray-600 text-sm">Add highlights, text, and annotations to enhance your tutorial</p>
                </div>
                
                <div className="text-center p-6 rounded-lg glassmorphism">
                  <div className="bg-brand/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Share easily</h3>
                  <p className="text-gray-600 text-sm">Share your tutorials with links or export to different formats</p>
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
                  onClick={handleTryToSave}
                  className="bg-brand hover:bg-brand-dark"
                >
                  Save tutorial ({SAVE_TUTORIAL_COST} credits)
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
            <DialogTitle>Save tutorial</DialogTitle>
            <DialogDescription>
              Give your tutorial a title to easily access it later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tutorial title</Label>
              <Input
                id="title"
                value={tutorialTitle}
                onChange={(e) => setTutorialTitle(e.target.value)}
                placeholder="E.g., How to create a workspace in Notion"
              />
            </div>
            <div className="text-sm text-gray-500 flex items-center justify-between">
              <span>Cost:</span>
              <span className="font-medium">{SAVE_TUTORIAL_COST} credits</span>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowTitleDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveTutorial}
              className="bg-brand hover:bg-brand-dark"
              disabled={!tutorialTitle}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showInsufficientCreditsDialog} onOpenChange={setShowInsufficientCreditsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insufficient credits</DialogTitle>
            <DialogDescription>
              You don't have enough credits to save this tutorial.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-brand/5 rounded-md flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Current balance</p>
                <p className="text-xl font-bold">{creditBalance} credits</p>
              </div>
              <div>
                <p className="text-sm font-medium">Required</p>
                <p className="text-xl font-bold">{SAVE_TUTORIAL_COST} credits</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => {
                setShowInsufficientCreditsDialog(false);
                navigate('/credits');
              }}
              className="bg-brand hover:bg-brand-dark"
            >
              Add credits
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowInsufficientCreditsDialog(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
