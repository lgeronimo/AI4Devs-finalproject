import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-url-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './url-viewer.component.html',
  styleUrls: ['./url-viewer.component.scss']
})
export class UrlViewerComponent implements OnChanges {
  @Input() url: string = '';
  safeUrl: SafeResourceUrl | null = null;
  
  constructor(private sanitizer: DomSanitizer) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['url'] && this.url) {
      // Sanitizamos la URL para el iframe
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    }
  }
} 