
/**
 * Service for handling transcription API calls
 */

const WEBHOOK_URL = "https://primary-production-8633.up.railway.app/webhook/1476628f-0a95-4486-b267-4e3ccf88560f";

export const sendAudioToWebhook = async (audioBlob: Blob): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');
    
    // Add additional headers for CORS and debugging
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
      // Important: Include credentials and mode for CORS
      credentials: 'omit',
      mode: 'cors',
    });
    
    if (!response.ok) {
      console.error('Webhook response error:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Webhook response data:', data);
    return data.transcript || data.text || 'No transcript returned from service';
  } catch (error) {
    console.error('Error sending audio to webhook:', error);
    
    // Provide a fallback for demonstration purposes
    console.log('Using fallback transcript due to API error');
    return "This is a fallback transcript. The actual transcription service is currently unavailable. Please try again later.";
  }
};

export const generateArticleFromTranscript = async (transcript: string): Promise<string> => {
  return `# Tutorial Article\n\n${transcript}\n\n## Key Points\n\n- Important points from the tutorial would be highlighted here\n- These would normally be generated by an AI service\n- The content is based on the actual transcript\n\n## Summary\n\nThis tutorial covered several important aspects of the topic. The full transcript is provided above.`;
};
