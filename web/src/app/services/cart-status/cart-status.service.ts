import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartStatusService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  constructor() {}

  openCart() {
    this.isOpenSubject.next(true);
  }

  closeCart() {
    this.isOpenSubject.next(false);
  }

  toggleCart() {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }
}
