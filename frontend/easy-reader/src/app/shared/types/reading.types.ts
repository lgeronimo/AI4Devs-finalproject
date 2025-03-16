export type ReadingMode = 'faceDetection' | 'accelerometer' | 'manual';

export interface UploadFile {
  name: string;
  size: string;
  progress: number;
  status: UploadStatus;
  file: File;
}

export type UploadStatus = 'uploading' | 'completed' | 'error';

export interface PdfConfig {
  scrollSpeed: number;
  readingMode: ReadingMode;
  isReading: boolean;
}

export interface PdfViewerState {
  isLoaded: boolean;
  currentPage: number;
  totalPages: number;
  scale: number;
  config: PdfConfig;
}


export interface WebViewerState {
  isLoaded: boolean;
  config: WebConfig;
}

export interface WebConfig {
  scrollSpeed: number;
  readingMode: ReadingMode;
  isReading: boolean;
}
