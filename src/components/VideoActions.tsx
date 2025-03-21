
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Download, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface VideoActionsProps {
  recordedBlob: Blob;
  isGeneratingArticle: boolean;
  onDiscard: () => void;
  onCreateArticle: () => void;
  articleCost: number;
}

const VideoActions: React.FC<VideoActionsProps> = ({
  recordedBlob,
  isGeneratingArticle,
  onDiscard,
  onCreateArticle,
  articleCost
}) => {
  const handleShare = () => {
    if (navigator.share && recordedBlob) {
      const file = new File([recordedBlob], 'recording.webm', { type: recordedBlob.type });
      navigator.share({
        title: 'My Recording',
        files: [file]
      }).catch(error => {
        console.error('Error sharing:', error);
        toast.error('Unable to share the video');
      });
    } else {
      toast.info('Sharing not available in your browser');
    }
  };

  const handleDownload = () => {
    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tutorial-${new Date().toISOString().split('T')[0]}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Video saved successfully');
  };

  return (
    <div className="flex items-center flex-wrap gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onDiscard}
        className="flex items-center gap-2"
      >
        <Trash2 className="h-4 w-4" />
        <span>Discard</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="flex items-center gap-2"
      >
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onCreateArticle}
        disabled={isGeneratingArticle}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        <span>
          {isGeneratingArticle 
            ? 'Creating article...' 
            : `Create article (${articleCost} credits)`}
        </span>
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
  );
};

export default VideoActions;
