import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  onLogin(): void {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password).subscribe(
        (response) => {
          console.log('Login successful', response);
          // Aquí puedes manejar la respuesta, como guardar el token en el localStorage, redirigir, etc.
        },
        (error) => {
          console.error('Login failed', error);
          // Maneja el error aquí, por ejemplo, mostrando un mensaje de error
        }
      );
    } else {
      console.log('Por favor, ingresa tu email y contraseña');
    }
  }
}
