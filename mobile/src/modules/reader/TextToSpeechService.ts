import {NativeModules, Platform} from 'react-native';

type VisionGuideTtsNativeModule = {
  speak(text: string, languageTag: string): Promise<boolean>;
  stop(): Promise<boolean>;
};

const nativeTts = NativeModules.VisionGuideTts as VisionGuideTtsNativeModule | undefined;

export class TextToSpeechService {
  private getModule(): VisionGuideTtsNativeModule {
    if (Platform.OS !== 'android' || !nativeTts) {
      throw new Error('Text to speech is not available on this device yet.');
    }
    return nativeTts;
  }

  async speak(text: string, languageTag: string): Promise<void> {
    const value = text.trim();
    if (!value) throw new Error('There is no recognized text to read.');
    await this.getModule().speak(value, languageTag);
  }

  async stop(): Promise<void> {
    if (Platform.OS === 'android' && nativeTts) {
      await nativeTts.stop();
    }
  }
}
