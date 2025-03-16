import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PdfService } from '../../services/pdf.service';

type ReadingMode = 'manual' | 'faceDetection' | 'accelerometer';

@Component({
  selector: 'app-reading-options',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reading-options.component.html',
  styleUrls: ['./reading-options.component.scss']
})
export class ReadingOptionsComponent implements OnInit {
  @Output() readingModeSelected = new EventEmitter<ReadingMode>();
  
  private pdfService = inject(PdfService);
  selectedMode: ReadingMode = 'manual';
  isMobileDevice = false;
  hasAccelerometer = false;

  ngOnInit() {
    this.checkDeviceType();
    this.checkDeviceCapabilities();
  }

  private checkDeviceType(): void {
    // Detecta si es un dispositivo móvil usando User Agent
    const userAgent = navigator.userAgent.toLowerCase();
    this.isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  }

  private checkDeviceCapabilities(): void {
    // Simplemente verificamos si el dispositivo tiene la API de DeviceMotion
    this.hasAccelerometer = 'DeviceMotionEvent' in window;
  }

  onModeChange(): void {
    // Guardamos la opción seleccionada
    this.pdfService.setReadingMode(this.selectedMode);
  }

  get showAccelerometerOption(): boolean {
    return this.isMobileDevice && this.hasAccelerometer;
  }

  get showUnsupportedMessage(): boolean {
    return this.isMobileDevice && !this.hasAccelerometer;
  }

  onContinue(): void {
    // Emitimos el modo seleccionado e inicializamos el visor
    this.readingModeSelected.emit(this.selectedMode);
    this.pdfService.initializeViewer();
  }
} 