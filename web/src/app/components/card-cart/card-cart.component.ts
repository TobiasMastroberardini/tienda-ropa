import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-card-cart',
  standalone: true,
  imports: [],
  templateUrl: './card-cart.component.html',
  styleUrl: './card-cart.component.scss',
})
export class CardCartComponent {
  @Input() item: any;
  @Output() customAction: EventEmitter<any> = new EventEmitter(); // Emisor del evento

  constructor(private cartService: CartService, private cart: CartComponent) {}

  remove() {
    // Emitir el evento hacia el componente padre
    this.customAction.emit(this.item);
  }

  incrementQuantity(item: any): void {
    item.quantity++; // Incrementa la cantidad en el objeto
    this.updateItemQuantity(item); // Actualiza la cantidad en el servicio
    this.cart.calculateTotal();
  }

  decrementQuantity(item: any): void {
    if (item.quantity > 1) {
      // Evitar que la cantidad sea menor que 1
      item.quantity--; // Decrementa la cantidad en el objeto
      this.updateItemQuantity(item); // Actualiza la cantidad en el servicio
      this.cart.calculateTotal();
    }
  }

  updateQuantity(item: any, event: Event): void {
    // Verifica que event.target no sea null y es del tipo HTMLInputElement
    const inputElement = event.target as HTMLInputElement;

    if (inputElement && inputElement.value) {
      // Verificamos que inputElement y inputElement.value sean válidos
      const quantity = parseInt(inputElement.value, 10);

      if (quantity > 0) {
        item.quantity = quantity; // Actualiza la cantidad en el objeto
        this.updateItemQuantity(item); // Llama al método para actualizar en el servicio
      }
    }
  }

  updateItemQuantity(item: any): void {
    this.cartService
      .updateQuantity(item.id, item.quantity)
      .subscribe((response) => {});
  }
}
