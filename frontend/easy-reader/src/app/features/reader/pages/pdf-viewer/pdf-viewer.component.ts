import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadingMode } from '../../types/reader.types';

interface UploadFile {
  name: string;
  size: string;
  progress: number;
  status: 'uploading' | 'completed';
}

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent {
  currentReadingMode: ReadingMode = 'manual';
  isReading = false;
  scrollSpeed = 1;
  pdfLoaded = false;
  pdfFile: File | null = null;
  readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB en bytes
  uploadedFiles: UploadFile[] = [];
  isDragging = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        this.pdfFile = file;
        this.pdfLoaded = true;
      } else {
        // TODO: Agregar un servicio de notificaciones para mostrar errores
        alert('Por favor, selecciona un archivo PDF válido');
      }
    }
  }

  onReadingModeChange(mode: ReadingMode): void {
    this.currentReadingMode = mode;
    this.isReading = mode !== 'manual';
  }

  onScrollSpeedChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.scrollSpeed = +input.value;
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      // Solo procesar el primer archivo
      this.handleFile(files[0]);
    }
  }

  onFileInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  openFileDialog() {
    this.fileInput.nativeElement.click();
  }

  private handleFile(file: File) {
    // Si ya hay un archivo, lo removemos
    if (this.uploadedFiles.length > 0) {
      this.uploadedFiles = [];
    }

    // Validar tipo de archivo
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed');
      return;
    }

    // Validar tamaño
    if (file.size > this.MAX_FILE_SIZE) {
      alert('File size exceeds 5MB limit');
      return;
    }

    // Agregar archivo a la lista
    this.uploadedFiles = [{
      name: file.name,
      size: this.formatFileSize(file.size),
      progress: 0,
      status: 'uploading'
    }];

    // Simular carga
    this.simulateUpload(0);
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private simulateUpload(fileIndex: number) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress <= 100) {
        this.uploadedFiles[fileIndex].progress = progress;
      } else {
        clearInterval(interval);
        this.uploadedFiles[fileIndex].status = 'completed';
      }
    }, 500);
  }

  removeFile(index: number) {
    this.uploadedFiles = [];
    this.fileInput.nativeElement.value = ''; // Limpiar el input file
  }
}