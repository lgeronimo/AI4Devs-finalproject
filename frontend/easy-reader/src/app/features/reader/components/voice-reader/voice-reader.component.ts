import { Component, OnInit, OnDestroy, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfService } from '../../services/pdf.service';
import { WebContentService } from '../../services/web-content.service';

@Component({
  selector: 'app-voice-reader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voice-reader.component.html',
  styleUrls: ['./voice-reader.component.scss']
})
export class VoiceReaderComponent implements OnInit, OnDestroy {
  @Input() contentType: 'pdf' | 'web' = 'pdf';
  
  private pdfService = inject(PdfService);
  private webContentService = inject(WebContentService);
  
  // Propiedades para la síntesis de voz
  private speechSynthesis: SpeechSynthesis;
  private speechUtterance: SpeechSynthesisUtterance | null = null;
  
  // Estado del lector
  isReading: boolean = false;
  isPaused: boolean = false;
  currentVoice: SpeechSynthesisVoice | null = null;
  availableVoices: SpeechSynthesisVoice[] = [];
  
  // Configuración
  volume: number = 1.0;
  rate: number = 1.0;
  pitch: number = 1.0;
  
  constructor() {
    this.speechSynthesis = window.speechSynthesis;
  }
  
  ngOnInit(): void {
    // Cargar las voces disponibles
    this.loadVoices();
    
    // Agregar un listener para cuando las voces estén disponibles
    if (this.speechSynthesis.onvoiceschanged !== undefined) {
      this.speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
  }
  
  ngOnDestroy(): void {
    this.stopReading();
  }
  
  private loadVoices(): void {
    this.availableVoices = this.speechSynthesis.getVoices();
    
    // Seleccionar una voz predeterminada (preferiblemente en español)
    if (this.availableVoices.length > 0) {
      const spanishVoice = this.availableVoices.find(voice => 
        voice.lang.includes('es') || voice.name.includes('Spanish')
      );
      
      this.currentVoice = spanishVoice || this.availableVoices[0];
    }
  }
  
  private async extractTextFromPdf(): Promise<string> {
    debugger
    

    try {
      // Obtener el texto del PDF actual
      const text = await this.pdfService.extractTextFromPdf();
      return text || "El PDF no contiene texto extraíble.";
    } catch (error) {
      console.error('Error al extraer texto del PDF:', error);
      return "Error al extraer el texto del PDF.";
    }
  }
  
  async startReading(): Promise<void> {
    if (this.isReading && !this.isPaused) {
      return;
    }
    
    if (this.isPaused) {
      this.resumeReading();
      return;
    }
    
    try {
      // Obtener el texto a leer según el tipo de contenido
      let textToRead = '';
      if (this.contentType === 'pdf') {
        textToRead = await this.extractTextFromPdf();
      } else {
        textToRead = this.extractTextFromWeb();
      }
      
      if (!textToRead) {
        console.error('No se pudo extraer texto para leer');
        return;
      }
      
      // Configurar la síntesis de voz
      this.speechUtterance = new SpeechSynthesisUtterance(textToRead);
      
      if (this.currentVoice) {
        this.speechUtterance.voice = this.currentVoice;
      }
      
      this.speechUtterance.volume = this.volume;
      this.speechUtterance.rate = this.rate;
      this.speechUtterance.pitch = this.pitch;
      
      // Eventos de la síntesis de voz
      this.speechUtterance.onstart = () => {
        this.isReading = true;
        this.isPaused = false;
      };
      
      this.speechUtterance.onend = () => {
        this.isReading = false;
        this.isPaused = false;
      };
      
      this.speechUtterance.onerror = (event) => {
        console.error('Error en la síntesis de voz:', event);
        this.isReading = false;
        this.isPaused = false;
      };
      
      // Iniciar la lectura
      this.speechSynthesis.speak(this.speechUtterance);
    } catch (error) {
      console.error('Error al iniciar la lectura:', error);
    }
  }
  
  pauseReading(): void {
    if (this.isReading && !this.isPaused) {
      this.speechSynthesis.pause();
      this.isPaused = true;
    }
  }
  
  resumeReading(): void {
    if (this.isReading && this.isPaused) {
      this.speechSynthesis.resume();
      this.isPaused = false;
    }
  }
  
  stopReading(): void {
    this.speechSynthesis.cancel();
    this.isReading = false;
    this.isPaused = false;
  }
  
  changeVoice(voice: SpeechSynthesisVoice): void {
    this.currentVoice = voice;
    
    // Si está leyendo, reiniciar la lectura con la nueva voz
    if (this.isReading) {
      const wasPaused = this.isPaused;
      this.stopReading();
      this.startReading();
      
      if (wasPaused) {
        this.pauseReading();
      }
    }
  }
  
  setVolume(value: number): void {
    this.volume = Math.max(0, Math.min(1, value));
    this.updateSpeechSettings();
  }
  
  setRate(value: number): void {
    this.rate = Math.max(0.5, Math.min(2, value));
    this.updateSpeechSettings();
  }
  
  setPitch(value: number): void {
    this.pitch = Math.max(0, Math.min(2, value));
    this.updateSpeechSettings();
  }
  
  private updateSpeechSettings(): void {
    if (this.speechUtterance) {
      this.speechUtterance.volume = this.volume;
      this.speechUtterance.rate = this.rate;
      this.speechUtterance.pitch = this.pitch;
      
      // Si está leyendo, reiniciar la lectura con la nueva configuración
      if (this.isReading) {
        const wasPaused = this.isPaused;
        const currentPosition = this.speechSynthesis.speaking ? 
          this.speechUtterance.text.length / 2 : 0; // Estimación aproximada
        
        this.stopReading();
        this.startReading();
        
        if (wasPaused) {
          this.pauseReading();
        }
      }
    }
  }
  
  private extractTextFromWeb(): string {
    // Intentar obtener el texto de la página web a través del iframe
    const iframe = document.getElementById('web-content-iframe') as HTMLIFrameElement;
    debugger
    if (!iframe || !iframe.contentDocument) {
      return "No se pudo acceder al contenido de la página web.";
    }
    
    // Extraer texto del cuerpo del documento
    const body = iframe.contentDocument.body;
    if (!body) {
      return "No se pudo encontrar el contenido de la página web.";
    }
    
    // Función recursiva para extraer texto de los nodos
    const extractTextFromNode = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent?.trim() || '';
      }
      
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        
        // Ignorar elementos ocultos o de navegación
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') {
          return '';
        }
        
        // Ignorar ciertos elementos que no suelen contener texto relevante
        const tagName = element.tagName.toLowerCase();
        if (['script', 'style', 'noscript', 'iframe', 'svg'].includes(tagName)) {
          return '';
        }
        
        // Extraer texto de los nodos hijos
        let text = '';
        for (let i = 0; i < node.childNodes.length; i++) {
          text += ' ' + extractTextFromNode(node.childNodes[i]);
        }
        
        return text;
      }
      
      return '';
    };
    
    const extractedText = extractTextFromNode(body).replace(/\s+/g, ' ').trim();
    return extractedText || "No se pudo extraer texto de la página web.";
  }

  onVolumeChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    // this.setVolume(value);
  }

  onRateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    // this.setRate(value);
  }

  onPitchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    // this.setPitch(value);
  }

  onVoiceChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedVoice = this.availableVoices.find(
      voice => voice.name === selectElement.value
    );
    
    if (selectedVoice) {
      this.changeVoice(selectedVoice);
    }
  }
} 