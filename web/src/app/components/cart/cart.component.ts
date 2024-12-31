import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartStatusService } from '../../services/cart-status/cart-status.service';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  isOpen = false; // Estado local
  items: any[] = [];
  isLoading = true;
  private cartStatusSubscription!: Subscription;

  constructor(
    private cartStatusService: CartStatusService,
    private CartService: CartService
  ) {}

  ngOnInit(): void {
    // Escuchar cambios en cartId$
    this.CartService.cartId$.subscribe((cartId) => {
      if (cartId) {
        this.getItems();
      }
    });

    // Escuchar cambios en el estado del carrito
    this.cartStatusSubscription = this.cartStatusService.isOpen$.subscribe(
      (status) => {
        this.isOpen = status;
      }
    );
  }

  getItems() {
    this.isLoading = true; // Iniciar el estado de carga
    this.CartService.getCartItems().subscribe(
      (data) => {
        this.items = data;
        this.isLoading = false; // Finaliza la carga
      },
      (error) => {
        console.error('Error fetching items:', error);
        this.isLoading = false; // Finaliza la carga, incluso si hay error
      }
    );
  }

  removeItem(item: any) {
    this.CartService.removeItem(item.id);
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
