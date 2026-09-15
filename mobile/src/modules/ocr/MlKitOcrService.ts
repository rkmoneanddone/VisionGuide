import MlkitOcr from 'rn-mlkit-ocr';
import {cleanOcrText} from './OcrTextCleaner';
import {rebuildTextFromLayout} from './OcrLayoutReader';
import {buildSemanticReading,DetectedDocumentType} from './DocumentSemanticReader';

export interface OcrTextResult {
  text: string;
  rawText: string;
  removedNoise: string[];
  documentType: DetectedDocumentType;
}

export async function recognizeText(imageUri: string): Promise<OcrTextResult> {
  const result = await MlkitOcr.recognizeText(imageUri);
  const layout = rebuildTextFromLayout(result.text, result.blocks);
  const cleaned = cleanOcrText(layout.layoutText);
  const semantic = buildSemanticReading(cleaned.cleanText);
  return {
    text: semantic.text || cleaned.cleanText,
    rawText: layout.rawText,
    removedNoise: cleaned.removedLines,
    documentType: semantic.type,
  };
}
