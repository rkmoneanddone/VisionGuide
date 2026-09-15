export type OcrSource = {
  uri: string;
  width?: number;
  height?: number;
};

export type OcrBlock = {
  text: string;
  confidence?: number;
};

export type OcrResult = {
  text: string;
  blocks: OcrBlock[];
  language?: string;
};

/**
 * Vendor-neutral OCR boundary.
 * A concrete implementation can use on-device ML Kit first and a cloud
 * implementation later without changing screens or document logic.
 */
export interface OcrService {
  recognize(source: OcrSource): Promise<OcrResult>;
}
