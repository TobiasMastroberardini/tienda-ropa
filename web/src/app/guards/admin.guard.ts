import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | boolean {
    return this.userService.isAdmin().pipe(
      map((isAdmin: boolean) => {
        if (!isAdmin) {
          this.router.navigate(['/home']); // Redirige si no es admin
          return false;
        }
        return true;
      })
    );
  }
}
