import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { GoBackComponent } from '../go-back/go-back.component';

@Component({
  selector: 'app-products-admin',
  standalone: true,
  imports: [CommonModule, GoBackComponent],
  templateUrl: './products-admin.component.html',
  styleUrl: './products-admin.component.scss',
})
export class ProductsAdminComponent implements OnInit {
  products: any[] = [];
  isLoading: boolean = true;
  currentPage: number = 1; // Página actual
  totalPages: number = 0; // Total de páginas
  limit: number = 10; // Número de productos por página
  productName: string = '';
  productTable = 'product-table';

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (Object.keys(queryParams).length === 0) {
        // No query parameters, fetch all products
        this.getAll();
      } else {
        // If there are query parameters, fetch products by filter
        const query = Object.keys(queryParams)
          .map((key) => `${key}${queryParams[key]}`)
          .join('&');
        this.getByFilter(query);
      }
    });
  }

  getAll() {
    this.productService.getAll().subscribe(
      (data) => {
        this.products = data; // Asignar los productos obtenidos
        this.isLoading = false; // Cambiar el estado de carga
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.isLoading = false; // Cambiar el estado de carga incluso en error
      }
    );
  }

  getByFilter(query: string) {
    this.productService.searchProducts(query).subscribe(
      (data) => {
        this.products = data; // Asignar los productos obtenidos
        this.isLoading = false; // Cambiar el estado de carga
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.isLoading = false; // Cambiar el estado de carga incluso en error
      }
    );
  }

  // Método para redirigir a la página de editar producto
  redirectToEditProduct(product: any): void {
    this.router.navigate([`/edit_product/${product.id}`]); // Ajusta la ruta según tu configuración de enrutamiento
  }

  // Método para eliminar un producto
  deleteProduct(product: any): void {
    if (
      confirm(
        `¿Estás seguro de que deseas eliminar el producto "${product.nombre}"?`
      )
    ) {
      this.productService.delete(product.id).subscribe(
        () => {
          this.getAll(); // Volver a cargar los productos después de eliminar
        },
        (error) => {
          console.error('Error al eliminar el producto', error);
        }
      );
    }
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.getAll(); // Recargar los productos para la página seleccionada
    }
  }
}
