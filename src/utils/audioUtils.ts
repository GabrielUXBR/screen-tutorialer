
/**
 * Utility functions for audio extraction and processing
 */

export const extractAudioFromVideo = async (videoBlob: Blob): Promise<Blob> => {
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
