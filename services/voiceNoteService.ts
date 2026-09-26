/**
 * Voice Note Speech Recognition Service Abstraction for SmartShetkari.
 * 
 * Provides speech-to-text functionality for farm diary notes:
 * - Uses Web Speech Recognition API if available in web browser.
 * - Uses a simulated audio-to-text transcription engine for Expo native preview environments.
 * - Modularly structured so native speech engines (e.g., @react-native-voice/voice) can be connected later.
 */

export interface VoiceNoteCallbacks {
  onStart?: () => void;
  onResult?: (transcript: string) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

class VoiceNoteService {
  private recognition: any = null;
  private isListening: boolean = false;
  private simulatedTimer: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = true;
          this.recognition.interimResults = true;
          this.recognition.lang = 'en-IN'; // Default to Indian English / Marathi supported accent
        } catch (e) {
          console.warn('[voiceNoteService] Web Speech API initialization error:', e);
        }
      }
    }
  }

  public isSupported(): boolean {
    return true; // Supported via native simulation abstraction or browser speech API
  }

  public start(callbacks: VoiceNoteCallbacks): void {
    if (this.isListening) return;
    this.isListening = true;

    if (callbacks.onStart) callbacks.onStart();

    if (this.recognition) {
      try {
        let finalTranscript = '';
        this.recognition.onresult = (event: any) => {
          let currentStr = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentStr += event.results[i][0].transcript;
          }
          finalTranscript = currentStr;
          if (callbacks.onResult) callbacks.onResult(finalTranscript);
        };

        this.recognition.onerror = (event: any) => {
          console.warn('[voiceNoteService] Speech error:', event.error);
          if (callbacks.onError) callbacks.onError(event.error || 'Speech recognition error');
        };

        this.recognition.onend = () => {
          this.isListening = false;
          if (callbacks.onEnd) callbacks.onEnd();
        };

        this.recognition.start();
        return;
      } catch (err) {
        console.warn('[voiceNoteService] Error starting Web Speech API, falling back to simulated speech engine:', err);
      }
    }

    // Expo Native / Fallback Audio Simulation
    const samplePhrases = [
      'Today I applied DAP fertilizer to my wheat crop and inspected the drip line.',
      'Sprayed bio-pesticide on cotton crop to prevent aphid damage.',
      'Irrigated sugarcane field for 4 hours. Soil moisture level looks good.',
      'Harvested 2 quintals of tomatoes today for Pune market sale.',
      'Purchased organic fertilizer bags from Shree Agro Center.',
    ];

    const randomPhrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];

    let currentLength = 0;
    this.simulatedTimer = setInterval(() => {
      if (!this.isListening) {
        clearInterval(this.simulatedTimer);
        return;
      }

      currentLength += Math.floor(Math.random() * 8) + 4;
      if (currentLength >= randomPhrase.length) {
        currentLength = randomPhrase.length;
        if (callbacks.onResult) callbacks.onResult(randomPhrase);
        this.stop();
        if (callbacks.onEnd) callbacks.onEnd();
      } else {
        const chunk = randomPhrase.substring(0, currentLength);
        if (callbacks.onResult) callbacks.onResult(chunk);
      }
    }, 400);
  }

  public stop(): void {
    this.isListening = false;
    if (this.simulatedTimer) {
      clearInterval(this.simulatedTimer);
      this.simulatedTimer = null;
    }
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore stop error
      }
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const voiceNoteService = new VoiceNoteService();
