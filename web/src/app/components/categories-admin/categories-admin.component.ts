import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category/category.service';
import { GoBackComponent } from '../go-back/go-back.component';

@Component({
  selector: 'app-categories-admin',
  standalone: true,
  imports: [CommonModule, GoBackComponent],
  templateUrl: './categories-admin.component.html',
  styleUrl: './categories-admin.component.scss',
})
export class CategoriesAdminComponent implements OnInit {
  categories: any[] = [];
  productName: string = '';
  categoryList = 'category-list';

  constructor(
    private categoriesService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams['nombre']) {
        const name = queryParams['nombre'];
        this.productName = name;
        this.fetchByFilter(`nombre=${name}`); // Filtra por nombre
      } else {
        this.loadCategories(); // Si no hay filtros, obtener todos los productos
      }
    });
  }

  // Método para cargar los productos desde el servicio
  loadCategories(): void {
    this.categoriesService.getAll().subscribe(
      (data) => {
        this.categories = data; // Asignar los productos a la variable de clase
      },
      (error) => {
        console.error('Error al cargar las categorias', error);
      }
    );
  }

  fetchByFilter(filter: string): void {
    this.categoriesService.getByFilter(filter).subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching filtered categories', error);
      }
    );
  }
  // Método para redirigir a la página de editar categoria
  redirectToEditCategory(category: any): void {
    this.router.navigate([`/edit-category/${category.id}`]); // Ajusta la ruta según tu configuración de enrutamiento
  }

  // Método para eliminar un producto
  delete(category: any): void {
    if (
      confirm(
        `¿Estás seguro de que deseas eliminar la categoria "${category.nombre}"?`
      )
    ) {
      this.categoriesService.delete(category.id).subscribe(
        () => {
          this.loadCategories(); // Volver a cargar las categorias después de eliminar
        },
        (error) => {
          console.error('Error al eliminar la categoria', error);
        }
      );
    }
  }
}
