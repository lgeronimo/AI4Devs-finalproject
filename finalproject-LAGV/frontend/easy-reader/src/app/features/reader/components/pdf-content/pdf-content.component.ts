import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfService } from '../../services/pdf.service';
import { Router } from '@angular/router';
import { ReadingMode } from '@shared/types/reading.types';
import { map, Subject, takeUntil } from 'rxjs';
declare const pdfjsLib: any;

@Component({
  selector: 'app-pdf-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf-content.component.html',
  styleUrls: ['./pdf-content.component.scss']
})
export class PdfContentComponent implements OnInit, AfterViewInit {
  @ViewChild('pdfContainer') containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('pdfCanvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private pdfService = inject(PdfService);
  private pdfDoc: any = null;
  private pageRendering = false;
  private pageNumPending: number | null = null;
  private scale = 3.0;
  private ctx!: CanvasRenderingContext2D;
  private destroy$ = new Subject<void>();

  currentPage = 1;
  totalPages = 0;
  documentTitle: string = '';
  currentPageText: string = '';
  readingMode: ReadingMode | null = null;
  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    // Configurar el worker de PDF.js
    // pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.mjs';

    this.pdfService.viewerState$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(state => {
      this.readingMode = state.config.readingMode;
      this.documentTitle = state.title;
    });
  }

  ngOnInit(): void {
    const currentUrl = this.pdfService.getCurrentUrl();
    if (currentUrl) {
      this.loadPdf(currentUrl);
    }
    
    // Suscribirse a las solicitudes de cambio de página
    this.pdfService.nextPage$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      console.log('nextPage Automatic');
      if (this.readingMode === 'textToSpeech' && this.currentPage < this.totalPages) {
        this.nextPage(false);
      } else if (this.readingMode === 'voiceCommands') {
        this.nextPage(false);
      }
    });

    // Suscribirse a las solicitudes de página anterior
    this.pdfService.previousPage$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      console.log('previousPage Automatic');
      if (this.readingMode === 'voiceCommands' && this.currentPage > 1) {
        this.previousPage(false);
      }
    });
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadPdf(url: string): Promise<void> {
    try {
      this.pdfDoc = await pdfjsLib.getDocument(url).promise;
      this.totalPages = this.pdfDoc.numPages;
      await this.renderPage(this.currentPage);
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  }

  private async renderPage(pageNumber: number, detonationManual: boolean = true): Promise<void> {
    this.pageRendering = true;

    try {
      const page = await this.pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale: this.scale });

      const canvas = this.canvasRef.nativeElement;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: this.ctx,
        viewport: viewport
      };

      const renderTask = page.render(renderContext);
      await renderTask.promise;
      

      if (this.readingMode === 'textToSpeech') {
        // Extraer el texto de la página actual
        const textContent = await page.getTextContent();
        this.currentPageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        // Actualizar el servicio con el texto actual
        this.pdfService.setCurrentPageText(this.currentPageText, detonationManual);
      }

      this.pageRendering = false;
      
      if (this.pageNumPending !== null) {
        await this.renderPage(this.pageNumPending);
        this.pageNumPending = null;
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      this.pageRendering = false;
    }
  }

  private async queueRenderPage(pageNumber: number, detonationManual: boolean = true): Promise<void> {
    if (this.pageRendering) {
      this.pageNumPending = pageNumber;
    } else {
      await this.renderPage(pageNumber, detonationManual);
    }
  }

  async previousPage(detonationManual: boolean = true): Promise<void> {
    if (this.currentPage <= 1) return;
    
    this.currentPage--;

    if (this.cdr) {
      this.cdr.detectChanges();
    }

    await this.queueRenderPage(this.currentPage, detonationManual);
  }

  async nextPage(detonationManual: boolean = true): Promise<void> {
    if (this.currentPage >= this.totalPages) return;
    this.currentPage++;

    if (this.cdr) {
      this.cdr.detectChanges();
    }

    await this.queueRenderPage(this.currentPage, detonationManual);
  }

  closeDocument() {
    // Limpiar el PDF del servicio
    this.pdfService.clearPdf();
    // Navegar de regreso a la página de inicio
    this.router.navigate(['/reader']);
  }
}