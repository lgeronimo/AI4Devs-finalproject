import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfService } from '../../services/pdf.service';
import { Subject } from 'rxjs';

interface MicState {
  message: string;
  iconClass: string;
  iconColor: string;
  iconBackgroundColor?: string;
}

interface FeedbackState {
  messageLabel: string;
  message?: string;
  colorMessageLabel: string;
  colorMessage: string;
}


@Component({
  selector: 'app-voice-command',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voice-command.component.html',
  styleUrls: ['./voice-command.component.scss']
})
export class VoiceCommandComponent implements OnInit, OnDestroy {
  private recognition: any;
  private speechGrammarList: any;
  isListening: boolean = false;
  private commands: Set<string> = new Set(['sube', 'baja', 'inicio', 'final', 'siguiente', 'atrás']);
  private destroy$ = new Subject<void>();
  private pdfService = inject(PdfService);
  private cdr = inject(ChangeDetectorRef);
  private hasError: boolean = false;
  ; // Estado inicial

  micState: MicState = {
    message: 'Please authorize microphone access to proceed',
    iconClass: 'fa-microphone',
    iconColor: 'white',
    iconBackgroundColor: '#6366F1'
  };

  micStates: Record<string, MicState> = {
    default: this.micState,
    warmingUp: {
      message: 'Preparing voice recognition...',
      iconClass: 'fa-microphone',
      iconColor: 'white',
      iconBackgroundColor: '#FCD34D'
    },
    onstart: {
      message: 'Listening',
      iconClass: 'fa-microphone',
      iconColor: 'white',
      iconBackgroundColor: '#10B981'
    },
    onend: {
      message: 'Click to speak again',
      iconClass: 'fa-microphone-slash',
      iconColor: 'white',
      iconBackgroundColor: '#6B7280'
    },
    onerror: {
      message: 'Microphone access is required. Please enable it in your browser settings to continue.',
      iconClass: 'fa-microphone-slash',
      iconColor: 'white',
      iconBackgroundColor: '#EF4444'
    }
  };

  feedbackState: FeedbackState = {
    messageLabel: '',
    colorMessageLabel: '',
    colorMessage: ''
  };

  feedbackStates: Record<string, FeedbackState> = {
    default: this.feedbackState,
    success: {
      messageLabel: 'Executed successfully: ',
      colorMessageLabel: '#6B7280',
      colorMessage: '#10B981'
    },
    fail: {
      messageLabel: 'Invalid command: ',
      colorMessageLabel: '#6B7280',
      colorMessage: '#EF4444'
    }
  };

  ngOnInit(): void {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const SpeechGrammarList = (window as any).SpeechGrammarList || (window as any).webkitSpeechGrammarList;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.lang = 'es-MX';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      // Intentar usar gramática solo si está disponible
      if (SpeechGrammarList) {
        try {
          const grammar = `#JSGF V1.0; grammar commands; public <command> = ${Array.from(this.commands).join(' | ')} ;`;
          this.speechGrammarList = new SpeechGrammarList();
          this.speechGrammarList.addFromString(grammar, 1);
          this.recognition.grammars = this.speechGrammarList;
        } catch (error) {
          console.warn('Grammar list not supported:', error);
        }
      }

      this.recognition.onstart = () => {
        this.isListening = true;
        this.hasError = false;
        console.log('event: onstart');
        this.updateMicState('onstart');
      };

      this.recognition.onend = () => {
        if (!this.hasError) {
          this.isListening = false;
          console.log('event: onend');
          this.updateMicState('onend');
         /* setTimeout(() => {
            this.updateMicState('default');
            this.cdr.detectChanges();
          }, 2000);*/
        }
      };
      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        console.log('onresult');
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript.trim().toLowerCase();
          if (transcript && event.results[i].isFinal) {
            finalTranscript += transcript;
            if (this.commands.has(transcript)) {
              this.feedbackState = this.getFeedbackState('success', transcript);
              this.handleCommand(transcript);
              // Limpiar el mensaje después de 2 segundos
              setTimeout(() => {
                this.feedbackState = this.getFeedbackState('default');
                this.cdr.detectChanges();
              }, 2000);
            } else {
              this.feedbackState = this.getFeedbackState('fail', transcript);
              // Limpiar el mensaje de error después de 2 segundos
              setTimeout(() => {
                this.feedbackState = this.getFeedbackState('default');
                this.cdr.detectChanges();
              }, 2000);
            }
          }
        }
        this.cdr.detectChanges();
      };

      this.recognition.onerror = (event: any) => {
        console.log('event: onerror:', event);
        if (event.error === 'not-allowed') {
          this.hasError = true;
          this.recognition.abort();
          this.updateMicState('onerror');
        }
      };
    } else {
      console.log('event: no-speech');
      this.updateMicState('onerror');
    }
  }

  startListening(): void {
    if (this.recognition && !this.isListening) {
      this.updateMicState('warmingUp');
      setTimeout(() => {
        this.recognition.start();
      }, 1000);
    }
  }

  abortListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
      this.updateMicState('stopped');
    }
  }

  handleCommand(command: string): void {
    switch (command) {
      case 'siguiente':
        this.pdfService.requestNextPage();
        break;
      case 'anterior':
        console.log('down');
        break;
      case 'up':
        console.log('up');
        break;
      case 'top':
        console.log('top');
        break;
      case 'bottom':
        console.log('bottom');
        break;
      default:
        console.log(`Comando no reconocido: ${command}`);
    }
  }

  updateMicState(state: string): void {
    console.log('event: updateMicState', state);
    this.micState = this.micStates[state] || this.micStates["default"];
    this.cdr.detectChanges();
  }

  getFeedbackState(state: string, message?: string): FeedbackState {
    const feedbackState = this.feedbackStates[state];
    return {
      ...feedbackState,
      message: message
    };
  }

  ngOnDestroy(): void {
    this.abortListening();
    this.destroy$.next();
    this.destroy$.complete();
  }
} 