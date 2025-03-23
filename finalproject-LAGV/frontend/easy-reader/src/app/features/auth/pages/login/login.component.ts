import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  constructor(private router: Router) {}

  loginWithGoogle(): void {
    // Implementar autenticación con Google
    console.log('Login con Google');
    // Después de autenticar, navegar a home
    this.router.navigate(['/reader']);
  }

  continueWithoutAccount(): void {
    console.log('Continuando sin cuenta');
    this.router.navigate(['/reader']);
  }
} 