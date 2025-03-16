import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReadingMode } from '../../types/reader.types';
import { WebContentService } from '../../services/web-content.service';
import { UrlReaderComponent } from '../../components/url-reader/url-reader.component';
import { UrlViewerComponent } from '../../components/url-viewer/url-viewer.component';
import  {WebViewerState} from '@shared/types/reading.types';


@Component({
  selector: 'app-web-viewer',
  standalone: true,
  imports: [
    CommonModule,
    UrlReaderComponent,
    UrlViewerComponent
  ],
  templateUrl: './web-viewer.component.html',
  styleUrls: ['./web-viewer.component.scss']
})
export class WebViewerComponent {
  private webContentService = inject(WebContentService);
  private destroyRef = inject(DestroyRef);

  isReading = false;
  scrollSpeed = 1;
  webUrl: string = '';
  viewerState: WebViewerState | null = null;

  constructor() {
    this.webContentService.viewerState$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(state => {
        this.viewerState = state;
      });
  }


  onReadingModeChange(mode: ReadingMode): void {
    // Implementar lógica para cambio de modo de lectura
  }

  onScrollSpeedChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.scrollSpeed = +input.value;
  }
} 