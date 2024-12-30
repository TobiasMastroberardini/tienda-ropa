import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { AlertService } from '../alert/alert.service';
import { CookieService } from '../cookies/cookie.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(
    private http: HttpClient,
    private cookiesService: CookieService,
    private alertService: AlertService
  ) {}

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response.token) {
            this.cookiesService.setToken(response.token);
            this.alertService.showAlert('Inicio de sesión exitoso');
          }
        }),
        catchError((error) => {
          this.alertService.showAlert('Error en el inicio de sesión');
          console.error(error);
          return of(null);
        })
      );
  }

  logout(): void {
    this.cookiesService.deleteToken();
    this.alertService.showAlert('Has cerrado sesión exitosamente'); // Notificación de cierre de sesión
  }

  // Obtener el usuario logueado
  getUserLogged(): Observable<any> {
    const token = this.cookiesService.getToken();
    if (!token) {
      console.error('No hay token disponible');
      return of(null);
    }

    const headers = this.createAuthHeaders(token);
    return this.http.get<any>(`${this.apiUrl}/token`, { headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener usuario:', error);
        return of(null);
      })
    );
  }

  // Crear encabezados de autorización
  private createAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
