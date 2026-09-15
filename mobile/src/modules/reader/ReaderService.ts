export type ReaderState = 'idle' | 'speaking' | 'paused' | 'stopped' | 'error';

export type SpeakOptions = {
  language?: string;
  rate?: number;
  pitch?: number;
};

/** Vendor-neutral text-to-speech contract. */
export interface ReaderService {
  speak(text: string, options?: SpeakOptions): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  stop(): Promise<void>;
  getState(): ReaderState;
}
