import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UploadFile, PdfViewerState, PdfConfig, ReadingMode } from '@shared/types/reading.types';

declare const pdfjsLib: any;

const DEFAULT_PDF_CONFIG: PdfConfig = {
  scrollSpeed: 1,
  readingMode: 'manual',
  isReading: false
};

const INITIAL_STATE: PdfViewerState = {
  isLoaded: false,
  currentPage: 1,
  totalPages: 0,
  scale: 1,
  config: DEFAULT_PDF_CONFIG
};

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private currentFile = new BehaviorSubject<UploadFile | null>(null);
  private viewerState = new BehaviorSubject<PdfViewerState>(INITIAL_STATE);
  private pdfUrlSubject = new BehaviorSubject<string | null>(null);

  // Observables públicos
  currentFile$ = this.currentFile.asObservable();
  viewerState$ = this.viewerState.asObservable();
  pdfUrl$ = this.pdfUrlSubject.asObservable();

  constructor() {}

  // Métodos para el manejo de archivos
  uploadFile(file: File): void {
    const url = URL.createObjectURL(file);
    this.pdfUrlSubject.next(url);

    const uploadFile: UploadFile = {
      name: file.name,
      size: this.formatFileSize(file.size),
      progress: 0,
      status: 'uploading',
      file: file
    };
    
    this.currentFile.next(uploadFile);
    this.simulateUpload(uploadFile);
  }

  getCurrentUrl(): string | null {
    return this.pdfUrlSubject.value;
  }

  removeFile(): void {
    const currentUrl = this.pdfUrlSubject.value;
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }
    this.currentFile.next(null);
    this.resetState();
  }

  // Métodos para el control del visor
  updateConfig(config: Partial<PdfConfig>): void {
    const currentState = this.viewerState.value;
    this.viewerState.next({
      ...currentState,
      config: { ...currentState.config, ...config }
    });
  }

  setReadingMode(mode: ReadingMode): void {
    this.updateConfig({
      readingMode: mode,
      isReading: mode === 'manual'
    });
  }

  setScrollSpeed(speed: number): void {
    this.updateConfig({ scrollSpeed: speed });
  }

  initializeViewer(): void {
    const currentState = this.viewerState.value;
    this.viewerState.next({
      ...currentState,
      isLoaded: true
    });
  }

  // Métodos privados de utilidad
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private simulateUpload(file: UploadFile): void {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress <= 100) {
        const updatedFile = { ...file, progress };
        this.currentFile.next(updatedFile);
      } else {
        clearInterval(interval);
        const completedFile = { ...file, progress: 100, status: 'completed' as const };
        this.currentFile.next(completedFile);
        // this.initializeViewer(completedFile.file);
      }
    }, 50);
  }

  private resetState(): void {
    this.viewerState.next(INITIAL_STATE);
  }

  async extractTextFromPdf(): Promise<string> {
    try {
      const currentFile = this.currentFile.value;
      if (!currentFile?.file) {
        throw new Error('No hay archivo PDF cargado');
      }

      const arrayBuffer = await currentFile.file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => 'str' in item ? item.str : '')
          .join(' ');
        
        fullText += pageText + '\n';
        console.log(fullText);
      }

      return fullText.trim();
    } catch (error) {
      console.error('Error al extraer texto del PDF:', error);
      throw error;
    }
  }
} 