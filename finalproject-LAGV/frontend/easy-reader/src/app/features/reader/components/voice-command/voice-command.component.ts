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

interface CommandGroups {
    next: Set<string>;
    previous: Set<string>;
    top: Set<string>;
    bottom: Set<string>;
    up: Set<string>;
    down: Set<string>;
}

interface LanguageCommands {
    [key: string]: CommandGroups;
}

const commandsByLanguage: LanguageCommands = {
    'es-MX': {
        next: new Set(['adelante', 'siguiente']),
        previous: new Set(['atrás', 'regresa']),
        top: new Set(['inicio']),
        bottom: new Set(['fin', 'final']),
        up: new Set(['sube', 'arriba']),
        down: new Set(['baja', 'abajo'])
    },
    'en-US': {
        next: new Set(['next', 'forward']),
        previous: new Set(['previous', 'back']),
        top: new Set(['top']),
        bottom: new Set(['bottom']),
        up: new Set(['up']),
        down: new Set(['down'])
    }
};

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
  private commands: Set<string> = new Set();
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

  private readonly commandActions = {
    next: () => this.pdfService.requestNextPage(),
    previous: () => this.pdfService.requestPreviousPage(),
    up: () => { /* Lógica para subir */ },
    down: () => { /* Lógica para bajar */ },
    top: () => { /* Lógica para ir al inicio */ },
    bottom: () => { /* Lógica para ir al final */ }
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

      const { grammar, commands } = this.initializeCommandsAndGrammar();
      this.commands = commands;

      // Intentar usar gramática solo si está disponible
      if (SpeechGrammarList) {
        try {
          console.log('grammar:', grammar);
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
        console.log('onresult');
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript.trim().toLowerCase();
          if (transcript && event.results[i].isFinal) {
            if (this.commands.has(transcript)) {
              this.updateFeedbackState('success', transcript, true);
            } else {
              this.updateFeedbackState('fail', transcript);
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
    }
  }

  handleCommand(command: string): void {
    const languageCommands = commandsByLanguage[this.recognition.lang];
    const actionType = Object.entries(languageCommands).find(([_, commands]) => commands.has(command))?.[0] as keyof typeof this.commandActions;
    if (actionType && this.commandActions[actionType]) {
        this.commandActions[actionType]();
    } else {
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
    console.log('feedbackState:' + state)
    return {
      ...feedbackState,
      message: message
    };
  }

  private updateFeedbackState(state: string, message: string, handleCommand: boolean = false): void {
    if (handleCommand) {
        this.handleCommand(message);
    }
    setTimeout(() => {
      this.feedbackState = this.getFeedbackState(state, message);
      this.cdr.detectChanges();
    }, 250);
    setTimeout(() => {
      this.feedbackState = this.getFeedbackState('default');
      this.cdr.detectChanges();
    }, 1800);
  }

  ngOnDestroy(): void {
    this.abortListening();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeCommandsAndGrammar(): { grammar: string, commands: Set<string> } {
    const currentLanguage = this.recognition.lang;
    const languageCommands = commandsByLanguage[currentLanguage];
    if (!languageCommands) {
        console.warn(`No commands defined for language: ${currentLanguage}`);
        return { grammar: '', commands: new Set() };
    }
    const allCommands = Object.values(languageCommands)
        .reduce<string[]>((acc, commandSet) => {
            return [...acc, ...Array.from<string>(commandSet)];
        }, []);
    const commands = new Set<string>(allCommands);
    const grammar = `#JSGF V1.0; grammar commands; public <command> = ${allCommands.join(' | ')} ;`;
    return { grammar, commands };
  }
} 