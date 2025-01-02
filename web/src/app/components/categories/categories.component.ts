import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  categories: any[] = [];

  isLoading = true;

  constructor(
    private categoriesServices: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoriesServices.getAll().subscribe(
      (data) => {
        this.categories = data; // Asignar los productos obtenidos
        this.isLoading = false; // Cambiar el estado de carga
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.isLoading = false; // Cambiar el estado de carga incluso en error
      }
    );
  }

  onSearch(query: string): void {
    this.router.navigate(['/products'], {
      queryParams: { query: `=${query}` },
    });
  }
}
