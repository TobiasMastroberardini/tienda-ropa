import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  // Variables para el formulario
  first_name: string = '';
  last_name: string = '';
  email: string = '';
  password: string = '';
  address: string = '';
  phone: string = '';
  city: string = '';

  constructor(private authService: AuthService) {}

  // Método que se llama cuando se envía el formulario
  onSubmit(): void {
    const userData = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      password: this.password,
      address: this.address,
      phone: this.phone,
      city: this.city,
    };

    // Llamamos al servicio para registrar al usuario
    this.authService.registerUser(userData).subscribe(
      (response) => {
        console.log('Usuario registrado exitosamente', response);
        // Aquí puedes redirigir a otra página o mostrar un mensaje
      },
      (error) => {
        console.error('Error al registrar el usuario', error);
        // Aquí puedes manejar el error (mostrar un mensaje de error al usuario)
      }
    );
  }
}
