
import React, { useRef, useEffect } from 'react';
import { useRecording } from '@/context/RecordingContext';
import { Button } from '@/components/ui/button';
import { Share2, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const VideoPreview: React.FC = () => {
  const { recordedBlob, resetRecording } = useRecording();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (recordedBlob && videoRef.current) {
      const videoURL = URL.createObjectURL(recordedBlob);
      videoRef.current.src = videoURL;
      
      return () => {
        URL.revokeObjectURL(videoURL);
      };
    }
  }, [recordedBlob]);

  const handleShare = () => {
    if (navigator.share && recordedBlob) {
      const file = new File([recordedBlob], 'gravacao.webm', { type: recordedBlob.type });
      navigator.share({
        title: 'Minha Gravação',
        files: [file]
      }).catch(error => {
        console.error('Error sharing:', error);
        toast.error('Não foi possível compartilhar o vídeo');
      });
    } else {
      toast.info('Compartilhamento não disponível no seu navegador');
    }
  };

  const handleDownload = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tutorial-${new Date().toISOString().split('T')[0]}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Vídeo salvo com sucesso');
    }
  };

  const handleDiscard = () => {
    resetRecording();
    toast.info('Gravação descartada');
  };

  if (!recordedBlob) {
    return null;
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="rounded-xl overflow-hidden shadow-md bg-white border border-gray-100">
        <video 
          ref={videoRef} 
          controls
          className="w-full h-auto"
          autoPlay
        />
        
        <div className="p-4 flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-lg font-medium">Gravação concluída</h3>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDiscard}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Descartar</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              <span>Compartilhar</span>
            </Button>
            
            <Button
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2 bg-brand hover:bg-brand-dark"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
