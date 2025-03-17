
import React from 'react';
import { useRecording } from '@/context/RecordingContext';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const RecordingStatus: React.FC = () => {
  const { isRecording, recordingDuration, isPaused } = useRecording();
  
  if (!isRecording) {
    return null;
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glassmorphism rounded-lg p-4 shadow-sm animate-slide-up">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isPaused ? (
                <Clock className="h-5 w-5 text-amber-500" />
              ) : (
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-red-500 rounded-full animate-ping opacity-75"></div>
                  <div className="relative h-5 w-5 bg-red-600 rounded-full"></div>
                </div>
              )}
              <span className="font-medium">
                {isPaused ? 'Gravação pausada' : 'Gravando...'}
              </span>
            </div>
            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
              {formatTime(recordingDuration)}
            </span>
          </div>
          
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="col-span-1 flex flex-col items-center p-2 rounded bg-white/80">
              <CheckCircle className="h-4 w-4 text-green-500 mb-1" />
              <span>Vídeo</span>
            </div>
            <div className="col-span-1 flex flex-col items-center p-2 rounded bg-white/80">
              <CheckCircle className="h-4 w-4 text-green-500 mb-1" />
              <span>Áudio</span>
            </div>
            <div className="col-span-1 flex flex-col items-center p-2 rounded bg-white/80">
              <CheckCircle className="h-4 w-4 text-green-500 mb-1" />
              <span>Sistema</span>
            </div>
            <div className="col-span-1 flex flex-col items-center p-2 rounded bg-white/80">
              {isPaused ? (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-500 mb-1" />
                  <span>Pausado</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500 mb-1" />
                  <span>Ativo</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordingStatus;
