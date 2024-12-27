import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartStatusService } from '../../services/cart-status/cart-status.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  isOpen = false; // Estado local

  private cartStatusSubscription!: Subscription;

  constructor(private cartStatusService: CartStatusService) {}

  ngOnInit(): void {
    // Suscribirse al estado del carrito
    this.cartStatusSubscription = this.cartStatusService.isOpen$.subscribe(
      (status) => {
        this.isOpen = status;
      }
    );
  }

  ngOnDestroy(): void {
    // Desuscribirse cuando el componente se destruya
    this.cartStatusSubscription.unsubscribe();
  }

  toggleMenu(): void {
    // Usamos el servicio para alternar el estado
    this.cartStatusService.toggleCart();
  }
}
