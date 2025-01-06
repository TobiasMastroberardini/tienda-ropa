import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AlertService } from '../alert/alert.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartUrl = 'http://localhost:3000/api/carts';
  itemsUrl = 'http://localhost:3000/api/cart_items';

  public userId$ = new BehaviorSubject<string | null>(null);
  public cartId$ = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.loadUserIdFromAuthService(); // Suscribirse a los cambios de sesión
    this.authService.authStatus$.subscribe(() => {
      this.loadUserIdFromAuthService();
    });
  }

  private setUserId(id: string) {
    this.userId$.next(id);
  }

  private setCartId(id: string) {
    this.cartId$.next(id);
  }
  private loadUserIdFromAuthService(): void {
    this.authService
      .getUserLogged()
      .pipe(
        tap((user) => {
          if (user) {
            this.setUserId(user.id);
            this.getCartIdByUserId();
          } else {
            this.setUserId('');
            this.setCartId('');
          }
        }),
        catchError((error) => {
          console.error('Error fetching user:', error);
          return of(null); // Retorna un valor por defecto en caso de error
        })
      )
      .subscribe();
  }

  getCartIdByUserId(): void {
    const userId = this.userId$.getValue();
    if (!userId) {
      console.error('User ID is not available');
      return;
    }

    this.http
      .get<{ id: number; userId: string }>(`${this.cartUrl}/user/${userId}`)
      .pipe(
        tap((cart) => {
          if (cart && cart.id) {
            this.setCartId(cart.id.toString());
            console.log('Cart ID successfully retrieved:', cart.id);
          } else {
            console.log('No cart available or cart ID is missing');
          }
        }),
        catchError((error) => {
          console.error('Error fetching cart:', error);
          return of(null);
        })
      )
      .subscribe(); // Aquí se suscribe para ejecutar la llamada HTTP
  }

  getCartItems() {
    const cartId = this.cartId$.getValue();
    if (!cartId) {
      console.error('Cart ID is not available');
      return of([]); // Retorna un arreglo vacío si el ID del carrito no está disponible
    }

    return this.http.get<any[]>(`${this.itemsUrl}/cart/${cartId}`).pipe(
      catchError((error) => {
        console.error('Error fetching items:', error);
        return of([]); // Retorna un arreglo vacío en caso de error
      })
    );
  }

  removeItem(id: number) {
    console.log('llega aca al service:', id);

    return this.http.delete(`${this.itemsUrl}/${id}`).pipe(
      tap(() => {
        this.alertService.showAlert('Producto eliminado del carrito', 1); // Alerta de éxito
      }),
      catchError((error) => {
        console.error('Error removing item:', error);
        this.alertService.showAlert(
          'Error al eliminar producto del carrito',
          2
        ); // Alerta de error
        return of(null); // Retorna un valor por defecto en caso de error
      })
    );
  }

  addToCart(product_id: number, quantity: number) {
    const cart_id = this.cartId$.getValue();
    if (!cart_id) {
      console.error('Cart ID is not available');
      this.alertService.showAlert('Carrito no disponible', 2); // Mostrar alerta si no hay ID de carrito
      return of({ error: 'Cart ID not found' }); // Retorna un observable con error
    }

    const item = { product_id, quantity, cart_id };
    return this.http.post(`${this.itemsUrl}`, item).pipe(
      tap(() => this.alertService.showAlert('Producto agregado al carrito', 1)),
      catchError((error) => {
        console.error('Error al agregar producto al carrito:', error);
        this.alertService.showAlert('Error al agregar producto al carrito', 2);
        return of({ error: 'Failed to add item to cart' }); // Retorna un observable con error
      })
    );
  }
}
