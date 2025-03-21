import React, { useRef, useEffect, useState } from 'react';
import { useRecording } from '@/context/RecordingContext';
import { useCredits } from '@/context/CreditsContext';
import { Button } from '@/components/ui/button';
import { Share2, Download, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

const VideoPreview: React.FC = () => {
  const { recordedBlob, resetRecording } = useRecording();
  const { creditBalance, spendCredits } = useCredits();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [articleText, setArticleText] = useState<string | null>(null);
  const [showInsufficientCreditsDialog, setShowInsufficientCreditsDialog] = useState(false);
  const navigate = useNavigate();

  const GENERATE_ARTICLE_COST = 1000;
  const WEBHOOK_URL = "https://primary-production-8633.up.railway.app/webhook/1476628f-0a95-4486-b267-4e3ccf88560f";

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
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tutorial-${new Date().toISOString().split('T')[0]}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Video saved successfully');
    }
  };

  const handleDiscard = () => {
    resetRecording();
    toast.info('Recording discarded');
  };

  const extractAudioFromVideo = async (videoBlob: Blob): Promise<Blob> => {
    try {
      const mediaSource = new MediaSource();
      const url = URL.createObjectURL(mediaSource);
      
      const audioContext = new AudioContext();
      
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(videoBlob);
      
      await new Promise((resolve) => {
        videoElement.onloadedmetadata = resolve;
        videoElement.load();
      });
      
      const source = audioContext.createMediaElementSource(videoElement);
      
      const destination = audioContext.createMediaStreamDestination();
      
      source.connect(destination);
      
      const mediaRecorder = new MediaRecorder(destination.stream);
      const audioChunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      const audioData = await new Promise<Blob>((resolve) => {
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          resolve(audioBlob);
        };
        
        videoElement.play();
        mediaRecorder.start();
        
        videoElement.onended = () => {
          mediaRecorder.stop();
          videoElement.onended = null;
        };
        
        setTimeout(() => {
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
          }
        }, videoElement.duration * 1000 || 3000);
      });
      
      URL.revokeObjectURL(url);
      videoElement.remove();
      
      return audioData;
    } catch (error) {
      console.error('Error extracting audio:', error);
      throw new Error('Failed to extract audio from video');
    }
  };

  const sendAudioToWebhook = async (audioBlob: Blob): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
      
      toast.info('Sending audio to transcription service...');
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.transcript || data.text || 'No transcript returned from service';
    } catch (error) {
      console.error('Error sending audio to webhook:', error);
      throw new Error('Failed to send audio to transcription service');
    }
  };

  const handleCreateArticle = async () => {
    if (!recordedBlob) return;

    if (!spendCredits(GENERATE_ARTICLE_COST)) {
      setShowInsufficientCreditsDialog(true);
      return;
    }

    try {
      setIsGeneratingArticle(true);
      toast.info('Starting video transcription...');
      toast.info(`${GENERATE_ARTICLE_COST} credits were used`);

      const audioBlob = await extractAudioFromVideo(recordedBlob);
      
      const transcript = await sendAudioToWebhook(audioBlob);
      
      toast.info('Creating article based on transcription...');
      const article = await generateArticleFromTranscript(transcript);
      
      setArticleText(article);
      toast.success('Article created successfully!');
    } catch (error) {
      console.error('Error creating article:', error);
      toast.error('Unable to create the article: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsGeneratingArticle(false);
    }
  };

  const generateArticleFromTranscript = async (transcript: string): Promise<string> => {
    return `# Tutorial Article\n\n${transcript}\n\n## Key Points\n\n- Important points from the tutorial would be highlighted here\n- These would normally be generated by an AI service\n- The content is based on the actual transcript\n\n## Summary\n\nThis tutorial covered several important aspects of the topic. The full transcript is provided above.`;
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
          
          <div className="flex items-center flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDiscard}
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
              onClick={handleCreateArticle}
              disabled={isGeneratingArticle}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              <span>
                {isGeneratingArticle 
                  ? 'Creating article...' 
                  : `Create article (${GENERATE_ARTICLE_COST} credits)`}
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
        </div>
        
        {articleText && (
          <div className="p-4 mt-2 border-t border-gray-100">
            <h4 className="text-lg font-medium mb-2">Generated Article</h4>
            <div className="bg-gray-50 p-4 rounded-md whitespace-pre-line">
              {articleText}
            </div>
          </div>
        )}
      </div>

      <Dialog open={showInsufficientCreditsDialog} onOpenChange={setShowInsufficientCreditsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insufficient credits</DialogTitle>
            <DialogDescription>
              You don't have enough credits to generate an article.
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
                <p className="text-xl font-bold">{GENERATE_ARTICLE_COST} credits</p>
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

export default VideoPreview;
