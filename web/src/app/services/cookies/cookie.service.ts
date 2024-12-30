import { Injectable } from '@angular/core';
import { CookieService as NgxCookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  constructor(private cookies: NgxCookieService) {}

  setToken(token: string): void {
    this.cookies.set('token', token);
  }

  getToken(): string {
    return this.cookies.get('token');
  }

  deleteToken(): void {
    this.cookies.delete('token');
  }
}
