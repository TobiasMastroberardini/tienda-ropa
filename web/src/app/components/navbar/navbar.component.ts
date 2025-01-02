import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartStatusService } from '../../services/cart-status/cart-status.service';
import { CategoryService } from '../../services/category/category.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  categories: any[] = [];
  isMobileMenuOpen = false;
  isCategoriesMenuOpen = false;
  isUserMenuOpen = false;
  @Output() searchQuery: EventEmitter<string> = new EventEmitter();
  query: string = '';

  constructor(
    private cartStatusService: CartStatusService,
    private categoriesService: CategoryService,
    private router: Router
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

  onSearch(): void {
    if (this.query) {
      this.router.navigate(['/products'], {
        queryParams: { query: `=${this.query}` },
      });
    }
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
