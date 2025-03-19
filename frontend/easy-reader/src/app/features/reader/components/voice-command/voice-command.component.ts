import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  private commands: Set<string> = new Set(['next', 'back', 'down', 'up', 'top', 'bottom']);

  ngOnInit(): void {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        console.log('onstart');
        this.isListening = true;
      };

      this.recognition.onend = () => {
        console.log('onend');
        this.isListening = false;
      };

      this.recognition.onresult = (event: any) => {
        const command = event.results[event.resultIndex][0].transcript.trim().toLowerCase();
        if (this.commands.has(command)) {
          this.handleCommand(command);
        } else {
          console.log(`Comando no reconocido: ${command}`);
        }
      };
    } else {
      console.error('Speech recognition not supported in this browser.');
    }
  }

  startListening(): void {
    if (this.recognition && !this.isListening) {
      this.recognition.start();
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  handleCommand(command: string): void {
    switch (command) {
      case 'next':
        console.log('next');
        break;
      case 'back':
        console.log('back');
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

  ngOnDestroy(): void {
    this.stopListening();
  }
} 