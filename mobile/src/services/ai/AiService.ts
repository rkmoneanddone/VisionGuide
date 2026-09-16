import type {ScanModeId} from '../../modules/scan/scanModes';

export type AiTask =
  | 'understand'
  | 'translate'
  | 'summarize'
  | 'explain'
  | 'extract';

export interface AiRequest {
  task: AiTask;
  text: string;
  scanMode: ScanModeId;
  sourceLanguage?: string;
  targetLanguage?: string;
  options?: Readonly<Record<string, unknown>>;
}

export interface AiResponse {
  text: string;
  detectedLanguage?: string;
  structuredData?: Readonly<Record<string, unknown>>;
}

/**
 * Client-side contract for VisionGuide's trusted backend AI gateway.
 *
 * The mobile app must not call arbitrary AI providers with provider secrets.
 * Firebase/Cloud Functions selects the active server-side provider adapter.
 */
export interface AiService {
  execute(request: AiRequest): Promise<AiResponse>;
}
