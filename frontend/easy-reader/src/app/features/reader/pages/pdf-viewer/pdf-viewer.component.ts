import { Component, ViewChild, ElementRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReadingMode } from '../../types/reader.types';
import { PdfService } from '../../services/pdf.service';
import { PdfUploaderComponent } from '../../components/pdf-uploader/pdf-uploader.component';
import { PdfViewerState } from '@shared/types/reading.types';

interface UploadFile {
  name: string;
  size: string;
  progress: number;
  status: 'uploading' | 'completed';
}

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [
    CommonModule,
    PdfUploaderComponent
  ],
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent {
  private pdfService = inject(PdfService);
  private destroyRef = inject(DestroyRef);

  currentReadingMode: ReadingMode = 'manual';
  isReading = false;
  scrollSpeed = 1;
  pdfLoaded = false;
  pdfFile: File | null = null;
  readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB en bytes
  uploadedFiles: UploadFile[] = [];
  isDragging = false;
  viewerState: PdfViewerState | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.pdfService.viewerState$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(state => {
        this.viewerState = state;
      });
  }

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


  removeFile(index: number) {
    this.uploadedFiles = [];
    this.fileInput.nativeElement.value = ''; // Limpiar el input file
  }
}