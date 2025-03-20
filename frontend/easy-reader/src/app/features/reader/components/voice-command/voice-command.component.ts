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

@Component({
  selector: 'app-voice-command',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voice-command.component.html',
  styleUrls: ['./voice-command.component.scss']
})
export class VoiceCommandComponent implements OnInit, OnDestroy {
  private recognition: any;
  isListening: boolean = false;
  private commands: Set<string> = new Set(['next', 'down', 'up', 'top', 'bottom']);
  private destroy$ = new Subject<void>();
  private pdfService = inject(PdfService);
  private cdr = inject(ChangeDetectorRef);
  private hasError: boolean = false;

  micState: MicState = {
    message: 'Please authorize microphone access to proceed',
    iconClass: 'fa-microphone', 
    iconColor: 'white',
    iconBackgroundColor: '#6366F1'
  };

  micStates: Record<string, MicState> = {
    default: this.micState,
    onstart: {
      message: 'Listening...',
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

  ngOnInit(): void {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false; 

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
              this.handleCommand(transcript);
            } else {
              console.log(`Comando no reconocido: ${transcript}`);
            }
          }
        }
        // this.updateMicState('stopped');
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
      this.recognition.start();
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
      case 'next':
        this.pdfService.requestNextPage();
        break;
      case 'down':
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

  ngOnDestroy(): void {
    this.abortListening();
    this.destroy$.next();
    this.destroy$.complete();
  }
} 