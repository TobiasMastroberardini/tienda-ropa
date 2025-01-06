import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { CartStatusService } from '../../services/cart-status/cart-status.service';
import { CartService } from '../../services/cart/cart.service';
import { CardCartComponent } from '../card-cart/card-cart.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CardCartComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  isOpen = false; // Estado local
  items: any[] = [];
  isLoading = true;
  total = 0;
  private cartStatusSubscription!: Subscription;

  constructor(
    private cartStatusService: CartStatusService,
    private CartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Combina las suscripciones
    this.cartStatusSubscription = combineLatest([
      this.CartService.cartId$,
      this.cartStatusService.isOpen$,
    ]).subscribe(([cartId, status]) => {
      this.isOpen = status;
      if (cartId) this.getItems();
    });
    this.authService.authStatus$.subscribe(() => {
      this.clearCart();
    });
  }

  clearCart() {
    this.items = [];
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
    // Optimista: actualiza UI inmediatamente
    const itemIndex = this.items.findIndex((i) => i.id === item.id);
    if (itemIndex > -1) {
      this.items.splice(itemIndex, 1);
    }

    this.CartService.removeItem(item.id).subscribe({
      error: () => {
        // Revertir cambios en caso de error
        this.getItems();
      },
    });
  }

  ngOnDestroy(): void {
    // Desuscribirse cuando el componente se destruya
    this.cartStatusSubscription.unsubscribe();
  }

  toggleMenu(): void {
    // Usamos el servicio para alternar el estado
    this.cartStatusService.toggleCart();
  }

  handleCustomAction(item: any) {
    console.log('Acción personalizada recibida para el ítem:', item);
    // Aquí puedes llamar cualquier función de CartComponent
    this.removeItem(item);
  }

  calculateTotal(): void {
    this.total = this.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }
}
