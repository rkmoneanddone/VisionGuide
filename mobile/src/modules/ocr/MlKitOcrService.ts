import MlkitOcr from 'rn-mlkit-ocr';
import {cleanOcrText} from './OcrTextCleaner';

export interface OcrTextResult {
  text: string;
  rawText: string;
  removedNoise: string[];
}

export async function recognizeText(imageUri: string): Promise<OcrTextResult> {
  const result = await MlkitOcr.recognizeText(imageUri);
  const cleaned = cleanOcrText(result.text);
  return {
    text: cleaned.cleanText,
    rawText: cleaned.rawText,
    removedNoise: cleaned.removedLines,
  };
}
