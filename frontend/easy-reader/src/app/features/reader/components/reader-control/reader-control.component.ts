import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReaderMode, ReadingMode } from '@shared/types/reading.types';
import { ReaderModeService } from '@shared/services/reader-mode.service';
import { PdfService } from '../../services/pdf.service';
import { WebContentService } from '../../services/web-content.service';
import { map } from 'rxjs/operators';
import { VoiceReaderComponent } from '../voice-reader/voice-reader.component';

@Component({
  selector: 'app-reader-control',
  standalone: true,
  imports: [CommonModule, VoiceReaderComponent],
  templateUrl: './reader-control.component.html',
  styleUrls: ['./reader-control.component.scss']
})
export class ReaderControlComponent implements OnInit {

  private readergModeService = inject(ReaderModeService);
  private pdfService = inject(PdfService);
  private webContentService = inject(WebContentService);

  readerMode: ReaderMode;
  readingMode: ReadingMode | null = null;

  constructor() {
    this.readerMode = this.readergModeService.getMode();
  }

  ngOnInit() {
    if (this.readerMode === 'pdf') {
      this.pdfService.viewerState$.pipe(
        map(state => state.config.readingMode)
      ).subscribe(mode => this.readingMode = mode);
    } else {
      this.webContentService.viewerState$.pipe(
        map(state => state.config.readingMode)
      ).subscribe(mode => this.readingMode = mode);
    }
  }

  changeReadingMode() {
    // this.readergModeService.setMode(mode);
  }
} 