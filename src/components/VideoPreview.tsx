
import React, { useRef, useEffect } from 'react';
import { useRecording } from '@/context/RecordingContext';
import { useArticleGeneration } from '@/hooks/useArticleGeneration';
import InsufficientCreditsDialog from '@/components/InsufficientCreditsDialog';
import VideoActions from '@/components/VideoActions';
import GeneratedArticle from '@/components/GeneratedArticle';
import { toast } from 'sonner';

const VideoPreview: React.FC = () => {
  const { recordedBlob, resetRecording } = useRecording();
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    isGeneratingArticle,
    articleText,
    showInsufficientCreditsDialog,
    setShowInsufficientCreditsDialog,
    generateArticle,
    creditBalance,
    GENERATE_ARTICLE_COST
  } = useArticleGeneration();

  useEffect(() => {
    if (recordedBlob && videoRef.current) {
      const videoURL = URL.createObjectURL(recordedBlob);
      videoRef.current.src = videoURL;
      
      return () => {
        URL.revokeObjectURL(videoURL);
      };
    }
  }, [recordedBlob]);

  const handleDiscard = () => {
    resetRecording();
    toast.info('Recording discarded');
  };

  const handleCreateArticle = () => {
    if (recordedBlob) {
      generateArticle(recordedBlob);
    }
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
          <h3 className="text-lg font-medium">Recording completed</h3>
          
          <VideoActions
            recordedBlob={recordedBlob}
            isGeneratingArticle={isGeneratingArticle}
            onDiscard={handleDiscard}
            onCreateArticle={handleCreateArticle}
            articleCost={GENERATE_ARTICLE_COST}
          />
        </div>
        
        <GeneratedArticle articleText={articleText} />
      </div>

      <InsufficientCreditsDialog
        open={showInsufficientCreditsDialog}
        onOpenChange={setShowInsufficientCreditsDialog}
        creditBalance={creditBalance}
        requiredCredits={GENERATE_ARTICLE_COST}
      />
    </div>
  );
};

export default VideoPreview;
