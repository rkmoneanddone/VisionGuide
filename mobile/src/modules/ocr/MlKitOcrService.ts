import MlkitOcr from 'rn-mlkit-ocr';
import {cleanOcrText} from './OcrTextCleaner';
import {rebuildTextFromLayout} from './OcrLayoutReader';

export interface OcrTextResult {
  text: string;
  rawText: string;
  removedNoise: string[];
}

export async function recognizeText(imageUri: string): Promise<OcrTextResult> {
  const result = await MlkitOcr.recognizeText(imageUri);
  const layout = rebuildTextFromLayout(result.text, result.blocks);
  const cleaned = cleanOcrText(layout.layoutText);
  return {
    text: cleaned.cleanText,
    rawText: layout.rawText,
    removedNoise: cleaned.removedLines,
  };
}
