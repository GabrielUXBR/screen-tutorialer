
import React, { useRef, useEffect } from 'react';
import { useRecording } from '@/context/RecordingContext';

const WebcamPreview: React.FC = () => {
  const { webcamStream, isRecording } = useRecording();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (webcamStream && videoRef.current) {
      videoRef.current.srcObject = webcamStream;
    }
  }, [webcamStream]);
  
  if (!isRecording || !webcamStream) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 shadow-lg rounded-lg overflow-hidden border-2 border-white">
      <video 
        ref={videoRef} 
        autoPlay 
        muted 
        className="w-40 h-auto"
      />
    </div>
  );
};

export default WebcamPreview;
