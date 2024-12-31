import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartUrl = 'http://localhost:3000/api/carts';
  itemsUrl = 'http://localhost:3000/api/cart_items';

  public userId$ = new BehaviorSubject<string | null>(null);
  public cartId$ = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadUserIdFromAuthService();
  }

  private setUserId(id: string) {
    this.userId$.next(id);
  }

  private setCartId(id: number) {
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
            this.setCartId(cart.id);
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
    return this.http.delete(`${this.itemsUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error removing item:', error);
        return of(null); // Retorna un valor por defecto en caso de error
      })
    );
  }
}
