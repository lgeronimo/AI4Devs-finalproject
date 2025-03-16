import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WebContentService } from '../../services/web-content.service';

@Component({
  selector: 'app-url-reader',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './url-reader.component.html',
  styleUrls: ['./url-reader.component.scss']
})
export class UrlReaderComponent implements OnInit {
  @Output() urlValidated = new EventEmitter<string>();
  urlForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private webContentService: WebContentService
  ) { }

  ngOnInit(): void {
    this.urlForm = this.fb.group({
      url: ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]]
    });
  }

  async loadUrl(): Promise<void> {
    if (this.urlForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const url = this.urlForm.get('url')?.value;

    try {
      const validatedUrl = await this.webContentService.validateUrl(url);
      this.urlValidated.emit(validatedUrl);
    } catch (error) {
      this.errorMessage = 'No se pudo cargar la URL. Verifica que sea válida e intenta nuevamente.';
      console.error('Error loading URL:', error);
    } finally {
      this.isLoading = false;
    }
  }
} 