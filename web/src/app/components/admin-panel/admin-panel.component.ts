import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
})
export class AdminPanelComponent implements OnInit {
  name: string = '';
  private userSubscription: Subscription | undefined;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Llamamos a getUserName() y nos suscribimos al observable
    this.userSubscription = this.userService
      .getUserName()
      .subscribe((userName) => {
        this.name = userName; // Asignamos el nombre del usuario
      });
  }

  ngOnDestroy(): void {
    // Limpiamos la suscripción cuando el componente se destruye
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
