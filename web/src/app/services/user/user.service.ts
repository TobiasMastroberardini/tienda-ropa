import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CookieService } from '../cookies/cookie.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api/user';

  constructor(
    private cookiesService: CookieService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Comprobar si el usuario está logueado
  isLogged(): boolean {
    return !!this.cookiesService.getToken();
  }

  isAdmin(): Observable<boolean> {
    return this.authService.getUserLogged().pipe(
      map((user) => user?.rol === 1),
      catchError((error) => {
        console.error('Error al verificar si es admin:', error);
        return of(false);
      })
    );
  }

  // Recuperar la contraseña
  recoverPassword(email: string): Observable<any> {
    return this.http
      .post(
        `${this.baseUrl}/recover-password`,
        { email },
        this.createJsonHeaders()
      )
      .pipe(
        catchError((error) => {
          console.error('Error al recuperar la contraseña:', error);
          return of(null);
        })
      );
  }

  // Cambiar la contraseña
  changePassword(data: { newPassword: string }): Observable<any> {
    const token = this.cookiesService.getToken();
    if (!token) {
      console.error('No estás autenticado');
      return of(null);
    }

    return this.authService.getUserLogged().pipe(
      switchMap((user) => {
        if (!user) {
          console.error('No se pudo obtener el usuario');
          return of(null);
        }

        const dataWithUserId = { id: user.id, newPassword: data.newPassword };
        const headers = this.createAuthHeaders(token);

        // Realiza la solicitud HTTP y la devuelve
        return this.http.post(
          `${this.baseUrl}/change-password`,
          dataWithUserId,
          { headers }
        );
      }),
      catchError((error) => {
        console.error('Error al cambiar la contraseña:', error);
        return of(null);
      })
    );
  }

  getUserName(): Observable<string> {
    return this.authService.getUserLogged().pipe(
      map((user) => user?.name || ''), // Extrae el nombre del usuario o una cadena vacía si no existe
      catchError((error) => {
        console.error('Error al obtener el nombre del usuario:', error);
        return of(''); // Devuelve una cadena vacía en caso de error
      })
    );
  }

  // Crear encabezados de autorización
  private createAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Crear encabezados JSON para peticiones
  private createJsonHeaders(): { headers: HttpHeaders } {
    return { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  }
}
