
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface RecordingContextType {
  isRecording: boolean;
  isPaused: boolean;
  recordingDuration: number;
  recordedBlob: Blob | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  resetRecording: () => void;
}

const RecordingContext = createContext<RecordingContextType | undefined>(undefined);

export const RecordingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedDurationRef = useRef<number>(0);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    startTimeRef.current = Date.now() - (pausedDurationRef.current || 0);
    
    timerRef.current = window.setInterval(() => {
      if (!isPaused) {
        const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
        setRecordingDuration(elapsedTime);
      }
    }, 100);
  };
  
  const startRecording = async (): Promise<void> => {
    try {
      // Use the proper TypeScript types for getDisplayMedia
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      
      // Combine the streams
      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...micStream.getAudioTracks()
      ]);
      
      streamRef.current = combinedStream;
      
      const options = { mimeType: 'video/webm;codecs=vp9,opus' };
      const mediaRecorder = new MediaRecorder(combinedStream, options);
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      // Reset state
      setRecordedBlob(null);
      setRecordingDuration(0);
      pausedDurationRef.current = 0;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: 'video/webm'
        });
        setRecordedBlob(blob);
        setIsRecording(false);
        
        // Stop all tracks
        streamRef.current?.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        
        // Clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
      
      // Start recording
      mediaRecorder.start(100);
      setIsRecording(true);
      setIsPaused(false);
      startTimer();
      
      // Handle screen share cancellation
      screenStream.getVideoTracks()[0].onended = () => {
        stopRecording();
      };
      
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      pausedDurationRef.current = Date.now() - startTimeRef.current;
    }
  };
  
  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimeRef.current = Date.now() - pausedDurationRef.current;
    }
  };
  
  const resetRecording = () => {
    setRecordedBlob(null);
    setRecordingDuration(0);
    setIsRecording(false);
    setIsPaused(false);
    pausedDurationRef.current = 0;
  };
  
  return (
    <RecordingContext.Provider
      value={{
        isRecording,
        isPaused,
        recordingDuration,
        recordedBlob,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        resetRecording,
      }}
    >
      {children}
    </RecordingContext.Provider>
  );
};

export const useRecording = (): RecordingContextType => {
  const context = useContext(RecordingContext);
  
  if (context === undefined) {
    throw new Error('useRecording must be used within a RecordingProvider');
  }
  
  return context;
};
