import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { LoaderService } from '../services/loader/loader.service'; // Un servicio para manejar el estado de carga
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private loaderService: LoaderService // Servicio para manejar el estado de carga
  ) {}

  canActivate(): Observable<boolean> | boolean {
    this.loaderService.setLoading(true); // Activar la pantalla de carga

    return this.userService.isAdmin().pipe(
      map((isAdmin: boolean) => {
        if (!isAdmin) {
          this.router.navigate(['/home']); // Redirige si no es admin
          return false;
        }
        return true;
      }),
      catchError((error) => {
        this.router.navigate(['/home']); // Redirige en caso de error
        return [false];
      }),
      finalize(() => {
        this.loaderService.setLoading(false); // Desactivar la pantalla de carga
      })
    );
  }
}
