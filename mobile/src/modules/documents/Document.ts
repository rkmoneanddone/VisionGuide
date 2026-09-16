export type DocumentSourceType = 'camera' | 'gallery' | 'file';

export type VisionDocument = {
  id: string;
  ownerId: string;
  title: string;
  extractedText: string;
  sourceType: DocumentSourceType;
  language?: string;
  createdAt: string;
  updatedAt: string;
};
