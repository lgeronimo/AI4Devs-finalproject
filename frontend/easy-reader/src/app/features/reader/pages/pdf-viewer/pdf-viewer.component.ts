import { Component, ViewChild, ElementRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReadingMode } from '@shared/types/reading.types';
import { PdfService } from '../../services/pdf.service';
import { PdfUploaderComponent } from '../../components/pdf-uploader/pdf-uploader.component';
import { PdfViewerState } from '@shared/types/reading.types';
import { PdfContentComponent } from '../../components/pdf-content/pdf-content.component';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [
    CommonModule,
    PdfUploaderComponent,
    PdfContentComponent
  ],
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent {
  private pdfService = inject(PdfService);
  private destroyRef = inject(DestroyRef);

  isReading = false;
  scrollSpeed = 1;
  pdfLoaded = false;
  viewerState: PdfViewerState | null = null;


  constructor() {
    this.pdfService.viewerState$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(state => {
        this.viewerState = state;
      });

    this.pdfService.pdfUrl$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(url => {
        this.pdfLoaded = !!url;
      });
  }

 
  onReadingModeChange(mode: ReadingMode): void {
  
  }

  onScrollSpeedChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.scrollSpeed = +input.value;
  }
}