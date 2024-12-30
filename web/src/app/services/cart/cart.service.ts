import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartUrl = 'http://localhost:3000/api/carts';
  itemsUrl = 'http://localhost:3000/api/items';

  public userId$ = new BehaviorSubject<string | null>(null);
  cartId: number = -1;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadUserIdFromUserService();
  }

  setUserId(id: string) {
    this.userId$.next(id);
  }

  private loadUserIdFromUserService(): void {
    this.authService.getUserLogged().subscribe((user) => {
      if (user) {
        this.setUserId(user.id);
      }
    });
  }

  getCartByUserId() {
    const userId = this.userId$.getValue(); // Accediendo al valor del BehaviorSubject
    if (!userId) {
      console.error('User ID is not available');
      return;
    }

    return this.http.get<any>(`${this.cartUrl}/user/${userId}`).pipe(
      tap((cart) => {
        if (cart) {
          this.cartId = cart.id; // Asumiendo que la respuesta contiene un 'id'
        }
      })
    );
  }

  getCartItems() {
    return this.http.get<any>(`${this.itemsUrl}/cart/${this.cartId}`);
  }

  removeItem(id: number) {
    return this.http.delete(`${this.itemsUrl}/${id}`);
  }
}
