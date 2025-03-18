import { Component, OnInit, OnDestroy, Input, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfService } from '../../services/pdf.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-voice-reader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voice-reader.component.html',
  styleUrls: ['./voice-reader.component.scss']
})
export class VoiceReaderComponent implements OnInit, OnDestroy {
  
  private pdfService = inject(PdfService);
  private subscription: Subscription = new Subscription();
  
  // Propiedades para la síntesis de voz
  speechSynthesis: SpeechSynthesis = window.speechSynthesis;
  speechUtterance: SpeechSynthesisUtterance | null = null;
  isReading: boolean = false;
  isPaused: boolean = false;

  // Propiedades de configuración
  text: string = '';
  rate: number = 1;
  pitch: number = 1;
  volume: number = 1;

  // Callbacks opcionales
  onReadingStarted?: () => void;
  onReadingEnded?: () => void;
  onReadingStopped?: () => void;
  onReadingPaused?: () => void;
  onReadingResumed?: () => void;
  onReadingError?: (event: SpeechSynthesisErrorEvent) => void;

  availableVoices: SpeechSynthesisVoice[] = [];
  currentVoice: SpeechSynthesisVoice | null = null;
  isModalOpen: boolean = false;
  
  constructor(private cdr: ChangeDetectorRef) {
    this.loadVoices();
  }

  ngOnInit() {
    // Verificar que la API esté disponible en el navegador
    if (!('speechSynthesis' in window)) {
      console.error('La API de síntesis de voz no está disponible en este navegador');
      // Puedes mostrar un mensaje al usuario aquí
    }
    
    // Suscribirse a los cambios de texto de la página actual
    this.subscription.add(
      this.pdfService.currentPageText$.subscribe(pageText => {
        this.text = pageText.text;
        console.log('text', this.text);
        


        if (this.speechSynthesis) {
          // Cancelar la síntesis de voz actual
          this.speechSynthesis.cancel();
        
        }

        if (pageText.detonationManual) {
          this.stopReading();
        } else {
          setTimeout(() => { 
            this.startReading();
          }, 1000);
        }


      /* if (this.isReading && !this.isPaused) {
          this.startReading();
       } */
      })
    );

    // Manejar cuando las voces se cargan de forma asíncrona
    if (window.speechSynthesis) {
      speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  ngOnDestroy() {
    // Limpiar suscripciones al destruir el componente
    this.subscription.unsubscribe();
    
    // Detener cualquier lectura en curso
    debugger
    if (this.isReading) {
      this.stopReading();
    }
  }

  startReading() {
    // Cancelar cualquier lectura previa si existe


    this.isReading = true;
    this.isPaused = false;

    this.cdr.detectChanges();

    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
    
    // Verificar si hay texto para leer
    if (!this.text || this.text.trim() === '') {
      this.text= 'La página no tiene texto para leer';
    }
    
    // Crear una nueva instancia de SpeechSynthesisUtterance
    this.speechUtterance = new SpeechSynthesisUtterance(this.text);
    
    // Configurar propiedades de la voz
    this.speechUtterance.lang = 'es-ES'; // Idioma español
    this.speechUtterance.rate = this.rate || 1; // Velocidad de lectura
    this.speechUtterance.pitch = this.pitch || 1; // Tono de voz
    this.speechUtterance.volume = this.volume || 1; // Volumen
    
    // Asignar la voz seleccionada si existe
    if (this.currentVoice) {
      this.speechUtterance.voice = this.currentVoice;
    }
    
    // Asignar eventos para controlar el progreso de la lectura
    this.speechUtterance.onstart = () => {
      this.isReading = true;
      // Opcional: notificar que comenzó la lectura
      console.log('Comenzó la lectura');
      if (this.onReadingStarted) {
        this.onReadingStarted();
      }
    };
    
    this.speechUtterance.onend = () => {
      // Las funciones flecha mantienen el contexto 'this'
      this.isReading = false;
      this.isPaused = false;
      
      // Opcional: notificar que terminó la lectura
      console.log('Terminó la lectura: ', this.text);
      if (this.onReadingEnded) {
        this.onReadingEnded();
      }
      
      // Solicitar cambio a la siguiente página cuando termine la lectura
      this.pdfService.requestNextPage();
      
      // Forzar la detección de cambios
      this.cdr.detectChanges();
    };
    
    this.speechUtterance.onerror = (event) => {
      if (event.error === 'interrupted') {
        console.log('La síntesis de voz fue interrumpida, esto es normal al detenerla manualmente');
        // No es necesario hacer nada más, ya que stopReading() ya actualiza los estados
      } else {
        // Para otros errores, mantener el comportamiento original
        console.error('Error en la síntesis de voz:', event);
        this.isReading = false;
        this.isPaused = false;
        
        // Opcional: notificar que hubo un error en la lectura
        if (this.onReadingError) {
          this.onReadingError(event);
        }
      }
      
      // Asegurarse de que los cambios de estado se detecten
      if (this.cdr) {
        this.cdr.detectChanges();
      }
    };
    
    // Iniciar la lectura
    if (this.speechSynthesis && this.speechUtterance) {
      this.speechSynthesis.speak(this.speechUtterance);
    }
  }

 
  playPause() {
    debugger
    if (this.isReading && !this.isPaused) {
      // Si está leyendo y no está pausado, pausar la lectura
      this.isPaused = true;
      
      // Pausar la síntesis de voz
      if (this.speechSynthesis) {
        this.speechSynthesis.pause();
        console.log('Lectura pausada');
        
        // Opcional: notificar que se pausó la lectura
        if (this.onReadingPaused) {
          this.onReadingPaused();
        }
      }
    } else if (this.isReading && this.isPaused) {
      // Si está pausado, reanudar la lectura
      this.isPaused = false;
      
      // Reanudar la síntesis de voz
      if (this.speechSynthesis) {
        this.speechSynthesis.resume();
        console.log('Lectura reanudada');
        
        // Opcional: notificar que se reanudó la lectura
        if (this.onReadingResumed) {
          this.onReadingResumed();
        }
      }
    } else {
      // Si no está leyendo, iniciar la lectura
      this.startReading();
    }
    
    // Asegurarse de que los cambios de estado se detecten
    if (this.cdr) {
      this.cdr.detectChanges();
    }
  }

  stopReading() {
    if (this.speechSynthesis) {
      // Cancelar la síntesis de voz actual
      this.speechSynthesis.cancel();
      
      // Actualizar estados
      this.isReading = false;
      this.isPaused = false;
      
      console.log('Lectura detenida manualmente');
      
      // Opcional: notificar que se detuvo la lectura
      if (this.onReadingStopped) {
        this.onReadingStopped();
      }
    }
  }


  private loadVoices() {
    if (window.speechSynthesis) {
      this.availableVoices = window.speechSynthesis.getVoices();
      // Seleccionar voz en español por defecto si está disponible
      this.currentVoice = this.availableVoices.find(voice => voice.lang.startsWith('es')) || this.availableVoices[0];
      
    }
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  onVoiceChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.currentVoice = this.availableVoices.find(voice => voice.name === select.value) || null;
  }

} 