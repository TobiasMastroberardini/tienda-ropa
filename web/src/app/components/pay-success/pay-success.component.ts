import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-pay-success',
  standalone: true,
  imports: [CommonModule, HomeComponent],
  templateUrl: './pay-success.component.html',
  styleUrl: './pay-success.component.scss',
})
export class PaySuccessComponent {
  isModalOpen: boolean = true;

  constructor(private router: Router) {}

  closeModal() {
    this.isModalOpen = false;
    this.router.navigate(['/home']);
  }
}
