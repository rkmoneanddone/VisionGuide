import Tts from 'react-native-tts';

export class TextToSpeechService {
  private initialized = false;

  private async initialize(): Promise<void> {
    if (this.initialized) return;
    await Tts.getInitStatus();
    Tts.setDefaultRate(0.48, true);
    this.initialized = true;
  }

  async speak(text: string, languageTag: string): Promise<void> {
    const value = text.trim();
    if (!value) throw new Error('There is no recognized text to read.');

    await this.initialize();
    await Tts.stop();
    try {
      await Tts.setDefaultLanguage(languageTag);
    } catch {
      // Let the device TTS engine use its available default voice when the
      // requested locale is not installed. The UI can still report the issue
      // through the speak() rejection if the engine cannot speak at all.
    }
    Tts.speak(value);
  }

  async stop(): Promise<void> {
    await this.initialize();
    await Tts.stop();
  }
}
