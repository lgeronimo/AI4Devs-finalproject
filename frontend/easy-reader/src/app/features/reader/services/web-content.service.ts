import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebContentService {
  private urlSubject = new BehaviorSubject<string>('');
  public url$ = this.urlSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Valida y prepara una URL para ser mostrada en un iframe
   * @param url La URL a validar y preparar
   * @returns La URL validada
   */
  async validateUrl(url: string): Promise<string> {
    try {
      // Aseguramos que la URL tenga el formato correcto
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      // En una implementación real, podríamos verificar si la URL es accesible
      // Para este ejemplo, simplemente la devolvemos
      this.urlSubject.next(url);
      return url;
    } catch (error) {
      console.error('Error validating URL:', error);
      throw new Error('No se pudo validar la URL proporcionada');
    }
  }
} 