import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of, Subject, tap } from 'rxjs';
import { AlertService } from '../alert/alert.service';
import { CookieService } from '../cookies/cookie.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  public authStatus$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private cookiesService: CookieService,
    private alertService: AlertService,
    private router: Router
  ) {}

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response) => {
        this.alertService.showAlert('Registro exitoso', 1);
        this.router.navigateByUrl('/');
      }),
      catchError((error) => {
        this.alertService.showAlert('Error en el inicio de sesión', 2);
        console.error(error);
        return of(null);
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response.token) {
            this.cookiesService.setToken(response.token);
            this.alertService.showAlert('Inicio de sesión exitoso', 1);
            this.router.navigateByUrl('/');
            this.authStatus$.next();
          }
        }),
        catchError((error) => {
          this.alertService.showAlert('Error en el inicio de sesión', 2);
          console.error(error);
          return of(null);
        })
      );
  }

  logout(): void {
    this.cookiesService.deleteToken();
    this.alertService.showAlert('Has cerrado sesión exitosamente', 1);
    this.router.navigateByUrl('/home');
    this.authStatus$.next();
    console.log(2);
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

  isLogged(): boolean {
    return !!this.cookiesService.getToken();
  }

  // Crear encabezados de autorización
  private createAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
