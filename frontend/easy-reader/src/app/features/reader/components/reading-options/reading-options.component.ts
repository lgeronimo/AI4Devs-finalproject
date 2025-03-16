import { Component, inject, OnInit } from '@angular/core';
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
  private pdfService = inject(PdfService);
  selectedMode: ReadingMode = 'manual';
  hasAccelerometer = false;
  isMobileDevice = false;

  ngOnInit() {
    this.checkDeviceType();
    if (this.isMobileDevice) {
      this.checkAccelerometer();
    }
  }

  private checkDeviceType(): void {
    // Detecta si es un dispositivo móvil usando User Agent
    const userAgent = navigator.userAgent.toLowerCase();
    this.isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  }

  private async checkAccelerometer(): Promise<void> {
    try {
      const permissionResult = await navigator.permissions.query({ name: 'accelerometer' as PermissionName });
      this.hasAccelerometer = permissionResult.state !== 'denied' && 'DeviceMotionEvent' in window;
    } catch {
      // Si falla la consulta de permisos, verificamos solo la disponibilidad del API
      this.hasAccelerometer = 'DeviceMotionEvent' in window;
    }
  }

  onModeChange(): void {
    this.pdfService.setReadingMode(this.selectedMode);
  }

  get showAccelerometerOption(): boolean {
    return this.isMobileDevice && this.hasAccelerometer;
  }

  get showUnsupportedMessage(): boolean {
    return this.isMobileDevice && !this.hasAccelerometer;
  }
} 