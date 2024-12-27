import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CartStatusService } from '../../services/cart-status/cart-status.service';
import { CategoryService } from '../../services/category/category.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  categories: any[] = [];
  isMobileMenuOpen = false;
  isCategoriesMenuOpen = false;
  isUserMenuOpen = false;

  constructor(
    private cartStatusService: CartStatusService,
    private categoriesService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categoriesService.getAll().subscribe(
      (data) => {
        this.categories = data; // Asignar los productos obtenidos
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

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
