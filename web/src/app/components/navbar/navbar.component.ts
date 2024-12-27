import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartStatusService } from '../../services/cart-status/cart-status.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isMobileMenuOpen = false;
  isCategoriesMenuOpen = false;
  isUserMenuOpen = false;

  constructor(private cartStatusService: CartStatusService) {}

  openCart(): void {
    this.cartStatusService.openCart();
  }
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleCategoriesMenu(): void {
    this.isCategoriesMenuOpen = !this.isCategoriesMenuOpen;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
}
