
/**
 * Utility functions for audio extraction and processing
 */

export const extractAudioFromVideo = async (videoBlob: Blob): Promise<Blob> => {
  try {
    console.log('Starting audio extraction from video, blob size:', videoBlob.size);
    console.log('Video blob type:', videoBlob.type);
    
    // For direct testing, if the webhook is failing with the extracted audio
    // we can try to just send the original video blob as many webhooks can handle it
    if (videoBlob.type.includes('audio') || videoBlob.type.includes('video')) {
      console.log('Using original blob for audio processing');
      return videoBlob;
    }
    
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
    
    const mediaRecorder = new MediaRecorder(destination.stream, {
      mimeType: 'audio/webm;codecs=opus'
    });
    const audioChunks: Blob[] = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        console.log('Audio chunk received, size:', event.data.size);
        audioChunks.push(event.data);
      }
    };
    
    const audioData = await new Promise<Blob>((resolve) => {
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        console.log('Audio extraction complete, blob size:', audioBlob.size);
        resolve(audioBlob);
      };
      
      videoElement.play();
      mediaRecorder.start();
      
      videoElement.onended = () => {
        mediaRecorder.stop();
        videoElement.onended = null;
      };
      
      // Set a reasonable timeout in case the video doesn't end
      setTimeout(() => {
        if (mediaRecorder.state !== 'inactive') {
          console.log('Stopping media recorder after timeout');
          mediaRecorder.stop();
        }
      }, videoElement.duration * 1000 || 3000);
    });
    
    URL.revokeObjectURL(url);
    videoElement.remove();
    
    return audioData;
  } catch (error) {
    console.error('Error extracting audio:', error);
    // Return the original blob as a fallback
    console.log('Using original video blob as fallback');
    return videoBlob;
  }
};
