import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfService } from '../../services/pdf.service';
import { Router } from '@angular/router';
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

  currentPage = 1;
  totalPages = 0;
  documentTitle: string = 'Documento PDF';

  constructor(private router: Router) {
    // Configurar el worker de PDF.js
    // pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.mjs';
  }

  ngOnInit(): void {
    const currentUrl = this.pdfService.getCurrentUrl();
    if (currentUrl) {
      this.loadPdf(currentUrl);
    }
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
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

  private async renderPage(pageNumber: number): Promise<void> {
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

  private async queueRenderPage(pageNumber: number): Promise<void> {
    if (this.pageRendering) {
      this.pageNumPending = pageNumber;
    } else {
      await this.renderPage(pageNumber);
    }
  }

  async previousPage(): Promise<void> {
    if (this.currentPage <= 1) return;
    
    this.currentPage--;
    await this.queueRenderPage(this.currentPage);
  }

  async nextPage(): Promise<void> {
    if (this.currentPage >= this.totalPages) return;
    
    this.currentPage++;
    await this.queueRenderPage(this.currentPage);
  }

  closeDocument() {
    // Navegar de regreso a la página de inicio
    this.router.navigate(['/reader']);
  }
}