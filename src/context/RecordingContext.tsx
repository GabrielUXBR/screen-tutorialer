
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

// Define a Tutorial type for our app
export interface Tutorial {
  id: string;
  title: string;
  date: string;
  duration: string;
  thumbnail: string | null;
  videoBlob?: Blob;
}

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
  tutorials: Tutorial[];
  addTutorial: (title: string, blob: Blob) => void;
  webcamStream: MediaStream | null;
}

const RecordingContext = createContext<RecordingContextType | undefined>(undefined);

export const RecordingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [tutorials, setTutorials] = useState<Tutorial[]>(() => {
    // Initialize from localStorage if available
    const savedTutorials = localStorage.getItem('tutorials');
    return savedTutorials ? JSON.parse(savedTutorials) : [
      {
        id: '1',
        title: 'How to create a workspace in Notion',
        duration: '10:23',
        date: '2023-05-15',
        thumbnail: '/lovable-uploads/abd9b1c6-68af-4383-a3e7-fec5c6c66d1e.png',
      },
      {
        id: '2',
        title: 'How to remove clients from the list',
        duration: '05:47',
        date: '2023-05-12',
        thumbnail: null,
      },
      {
        id: '3',
        title: 'Creating products',
        duration: '08:19',
        date: '2023-05-10',
        thumbnail: null,
      }
    ];
  });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const webcamVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedDurationRef = useRef<number>(0);
  
  // Save tutorials to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tutorials', JSON.stringify(tutorials));
  }, [tutorials]);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
      }
      if (canvasStreamRef.current) {
        canvasStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [webcamStream]);
  
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const addTutorial = (title: string, blob: Blob) => {
    const newTutorial: Tutorial = {
      id: Date.now().toString(),
      title,
      date: new Date().toISOString().split('T')[0],
      duration: formatDuration(recordingDuration),
      thumbnail: null,
      // We don't store the videoBlob in localStorage, but it could be referenced here
      // for a real app that stores videos in a backend service
    };
    
    setTutorials(prev => [newTutorial, ...prev]);
  };
  
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

  // Function to create a composite canvas with screen capture and webcam
  const setupCompositeCanvas = (screenStream: MediaStream, webcamStream: MediaStream) => {
    // Create canvas element if it doesn't exist
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
      const canvas = canvasRef.current;
      
      // Set canvas size to match the screen capture resolution
      const videoTrack = screenStream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();
      canvas.width = settings.width || 1920;
      canvas.height = settings.height || 1080;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      
      // Create video elements for screen and webcam
      const screenVideo = document.createElement('video');
      screenVideo.srcObject = screenStream;
      screenVideo.play();
      
      const webcamVideo = document.createElement('video');
      webcamVideo.srcObject = webcamStream;
      webcamVideo.play();
      webcamVideoRef.current = webcamVideo;
      
      // Start drawing both video sources onto the canvas
      const drawFrame = () => {
        if (!ctx || !canvas) return;
        
        // Draw the screen capture to fill the entire canvas
        ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
        
        // Draw the webcam video in the corner (picture-in-picture)
        const webcamWidth = canvas.width / 5; // 20% of canvas width
        const webcamHeight = (webcamWidth * webcamVideo.videoHeight) / webcamVideo.videoWidth;
        const padding = 20; // Padding from corner
        
        ctx.drawImage(
          webcamVideo,
          canvas.width - webcamWidth - padding,
          canvas.height - webcamHeight - padding,
          webcamWidth,
          webcamHeight
        );
        
        // Add a border around the webcam video
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          canvas.width - webcamWidth - padding,
          canvas.height - webcamHeight - padding,
          webcamWidth,
          webcamHeight
        );
        
        requestAnimationFrame(drawFrame);
      };
      
      drawFrame();
      
      // Get a stream from the canvas
      canvasStreamRef.current = canvas.captureStream(30); // 30 FPS
      
      // Add audio tracks from both sources to the canvas stream
      screenStream.getAudioTracks().forEach(track => {
        canvasStreamRef.current?.addTrack(track);
      });
      
      webcamStream.getAudioTracks().forEach(track => {
        canvasStreamRef.current?.addTrack(track);
      });
      
      return canvasStreamRef.current;
    }
    
    return null;
  };
  
  const startRecording = async (): Promise<void> => {
    try {
      // Get screen capture stream
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      
      // Get webcam stream
      const webcamStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      // Save webcam stream to state for preview
      setWebcamStream(webcamStream);
      
      // Create a composite stream with both screen and webcam
      const compositeStream = setupCompositeCanvas(screenStream, webcamStream);
      
      // Use the composite stream for recording, fallback to screen capture if something goes wrong
      streamRef.current = compositeStream || screenStream;
      
      const options = { mimeType: 'video/webm;codecs=vp9,opus' };
      const mediaRecorder = new MediaRecorder(streamRef.current, options);
      
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
        
        if (webcamStream) {
          webcamStream.getTracks().forEach(track => track.stop());
          setWebcamStream(null);
        }
        
        if (canvasStreamRef.current) {
          canvasStreamRef.current.getTracks().forEach(track => track.stop());
          canvasStreamRef.current = null;
        }
        
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
    
    // Stop webcam if it's still running
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
      setWebcamStream(null);
    }
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
        tutorials,
        addTutorial,
        webcamStream,
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
