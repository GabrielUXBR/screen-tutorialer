
import React, { useState } from 'react';
import { Mic, Video, Play, Square, Loader2, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRecording } from '@/context/RecordingContext';
import { toast } from 'sonner';

const RecordButton: React.FC = () => {
  const { 
    isRecording, 
    isPaused, 
    startRecording, 
    stopRecording, 
    pauseRecording, 
    resumeRecording
  } = useRecording();
  const [isLoading, setIsLoading] = useState(false);

  const handleRecordClick = async () => {
    if (isRecording) {
      if (isPaused) {
        resumeRecording();
      } else {
        pauseRecording();
      }
    } else {
      setIsLoading(true);
      try {
        await startRecording();
        toast.success('Recording started with webcam');
      } catch (error) {
        console.error('Error starting recording:', error);
        toast.error('Failed to start recording. Please check camera and screen share permissions.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStopClick = () => {
    stopRecording();
    toast.success('Recording completed');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Button 
          disabled
          className="h-16 w-16 rounded-full flex items-center justify-center shadow-md bg-gray-200"
        >
          <Loader2 className="h-8 w-8 text-gray-500 animate-spin" />
        </Button>
        <span className="text-sm text-gray-500">Requesting permissions...</span>
      </div>
    );
  }

  if (isRecording) {
    return (
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <Button 
            onClick={handleRecordClick}
            className={`h-16 w-16 rounded-full flex items-center justify-center shadow-md ${
              isPaused 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-amber-500 hover:bg-amber-600'
            } transition-all duration-300 active:scale-95`}
            aria-label={isPaused ? 'Resume recording' : 'Pause recording'}
          >
            {isPaused ? (
              <Play className="h-8 w-8 text-white" />
            ) : (
              <div className="h-8 w-8 rounded bg-white animate-pulse-record" />
            )}
          </Button>
          <span className="text-sm font-medium">
            {isPaused ? 'Resume' : 'Pause'}
          </span>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <Button 
            onClick={handleStopClick}
            className="h-16 w-16 rounded-full flex items-center justify-center shadow-md bg-brand hover:bg-brand-dark transition-all duration-300 active:scale-95"
            aria-label="Stop recording"
          >
            <Square className="h-8 w-8 text-white" fill="white" />
          </Button>
          <span className="text-sm font-medium">Stop</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Button 
        onClick={handleRecordClick}
        className="h-16 w-16 rounded-full flex items-center justify-center shadow-md bg-brand hover:bg-brand-dark transition-all duration-300 active:scale-95"
        aria-label="Start recording"
      >
        <div className="relative">
          <Video className="h-8 w-8 text-white absolute -left-5 opacity-80" />
          <Camera className="h-8 w-8 text-white absolute -right-5 opacity-80" />
        </div>
      </Button>
      <span className="text-sm font-medium">Start recording with webcam</span>
    </div>
  );
};

export default RecordButton;
