import { Component, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfService } from '../../services/pdf.service';

declare const pdfjsLib: any;

@Component({
  selector: 'app-pdf-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf-content.component.html',
  styleUrls: ['./pdf-content.component.scss']
})
export class PdfContentComponent implements AfterViewInit {
  @ViewChild('pdfContainer') containerRef!: ElementRef<HTMLDivElement>;

  private pdfService = inject(PdfService);
  private pdfDoc: any;
  private scale = 1.5;
  pageNumbers: number[] = [];

  ngAfterViewInit() {
    const currentUrl = this.pdfService.getCurrentUrl();
    if (currentUrl) {
      this.loadPdf(currentUrl);
    }
  }

  private async loadPdf(url: string) {
    try {
      this.pdfDoc = await pdfjsLib.getDocument(url).promise;
      this.pageNumbers = Array.from({ length: this.pdfDoc.numPages }, (_, i) => i + 1);
      
      // Esperar a que Angular actualice la vista con los elementos canvas
      setTimeout(() => {
        this.renderAllPages();
      }, 100);
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  }

  private async renderAllPages() {
    for (const pageNum of this.pageNumbers) {
      try {
        const page = await this.pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: this.scale });
        
        const canvas = document.getElementById('page-' + pageNum) as HTMLCanvasElement;
        if (!canvas) {
          console.error(`Canvas element for page ${pageNum} not found`);
          continue;
        }
        
        const context = canvas.getContext('2d');
        if (!context) {
          console.error(`Could not get 2D context for canvas on page ${pageNum}`);
          continue;
        }
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
      } catch (error) {
        console.error(`Error rendering page ${pageNum}:`, error);
      }
    }
  }

  getContainer(): HTMLElement {
    return this.containerRef.nativeElement;
  }
}