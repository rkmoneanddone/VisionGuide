import MlkitOcr from 'rn-mlkit-ocr';

export interface OcrTextResult {
  text: string;
}

export async function recognizeText(imageUri: string): Promise<OcrTextResult> {
  const result = await MlkitOcr.recognizeText(imageUri);
  return {text: result.text.trim()};
}
