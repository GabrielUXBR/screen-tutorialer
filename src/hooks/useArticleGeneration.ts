
import { useState } from 'react';
import { toast } from 'sonner';
import { useCredits } from '@/context/CreditsContext';
import { extractAudioFromVideo } from '@/utils/audioUtils';
import { sendAudioToWebhook, generateArticleFromTranscript } from '@/services/transcriptionService';

export const GENERATE_ARTICLE_COST = 1000;

export const useArticleGeneration = () => {
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [articleText, setArticleText] = useState<string | null>(null);
  const [showInsufficientCreditsDialog, setShowInsufficientCreditsDialog] = useState(false);
  const { creditBalance, spendCredits } = useCredits();

  const generateArticle = async (recordedBlob: Blob) => {
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

  return {
    isGeneratingArticle,
    articleText,
    showInsufficientCreditsDialog,
    setShowInsufficientCreditsDialog,
    generateArticle,
    creditBalance,
    GENERATE_ARTICLE_COST
  };
};
