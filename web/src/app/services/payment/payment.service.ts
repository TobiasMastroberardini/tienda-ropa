import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/api/payments';
  public userId$ = new BehaviorSubject<string | null>(null); // Permitir null

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.getUserLogged().subscribe((user) => {
      if (user) {
        this.setUserId(user.id); // Establecer el userId en el BehaviorSubject
      }
    });
  }

  setUserId(id: string): void {
    this.userId$.next(id); // Asegúrate de que el id sea un string
  }

  createPayment(): Observable<any> {
    const body = { user_id: this.userId$.value };
    console.log(body);
    return this.http.post<any>(`${this.apiUrl}/new`, body);
  }
}
