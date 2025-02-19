import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert/alert.service';
import { AuthService } from '../../services/auth/auth.service';
import { CartStatusService } from '../../services/cart-status/cart-status.service';
import { CategoryService } from '../../services/category/category.service';
import { UserService } from '../../services/user/user.service';

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
  isLogged: boolean = false;
  isUserAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private cartStatusService: CartStatusService,
    private categoriesService: CategoryService,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setIsAdmin();
    this.categoriesService.getAll().subscribe(
      (data) => {
        this.categories = data; // Asignar los productos obtenidos
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  getIsAdmin(): boolean {
    return this.isUserAdmin;
  }

  setIsAdmin() {
    this.userService
      .isAdmin()
      .subscribe((isAdmin) => (this.isUserAdmin = isAdmin));
  }

  onSearch(query: string = ''): void {
    if (this.query) {
      this.router.navigate(['/products'], {
        queryParams: { query: `=${this.query}` },
      });
    } else if (query != '') {
      this.router.navigate(['/products'], {
        queryParams: { query: `=${query}` },
      });
    }
  }

  setIsLogged() {
    return this.authService.isLogged();
  }

  logout() {
    this.authService.logout();
  }

  openCart(): void {
    if (this.authService.isLogged()) {
      this.cartStatusService.toggleCart();
    } else if (!this.authService.isLogged()) {
      this.alertService.showAlert('Debes estar logeado para ver tu carrito', 3);
      this.router.navigate(['/login']);
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleCategoriesMenu(): void {
    this.isCategoriesMenuOpen = !this.isCategoriesMenuOpen;
  }

  toggleUserMenu(): void {
    this.setIsAdmin();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
}
