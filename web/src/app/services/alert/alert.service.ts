import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Alert {
  message: string | null;
  state: number; // 1 para éxito, 2 para error, -1 para ningún estado
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertSubject = new BehaviorSubject<Alert>({
    message: null,
    state: -1,
  });
  alert$ = this.alertSubject.asObservable();

  showAlert(message: string, state: number) {
    this.alertSubject.next({ message, state });
    setTimeout(() => this.clearAlert(), 3000); // Oculta la alerta después de 3 segundos
  }

  clearAlert() {
    this.alertSubject.next({ message: null, state: -1 });
  }
}
