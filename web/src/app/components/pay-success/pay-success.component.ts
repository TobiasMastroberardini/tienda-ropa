import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-pay-success',
  standalone: true,
  imports: [CommonModule, HomeComponent],
  templateUrl: './pay-success.component.html',
  styleUrl: './pay-success.component.scss',
})
export class PaySuccessComponent {
  @Input() isModalOpen: boolean = true;

  closeModal() {
    this.isModalOpen = false;
  }
}
