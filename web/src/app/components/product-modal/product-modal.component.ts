import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss',
})
export class ProductModalComponent {
  product: any | null = null; // Aquí almacenaremos el producto
  isLoading = true; // Para mostrar un indicador de carga mientras se obtiene el producto

  constructor(
    private route: ActivatedRoute, // Para acceder a los parámetros de la URL
    private productService: ProductService // Para obtener el producto
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const productId = params['id']; // Obtener la ID del producto desde la URL
      this.loadProduct(productId); // Llamar a la función para cargar el producto
    });
  }

  loadProduct(id: string) {
    this.productService.getById(id).subscribe(
      (data) => {
        this.product = data;
        this.isLoading = false; // El producto se ha cargado
      },
      (error) => {
        console.error('Error al obtener el producto:', error);
        this.isLoading = false; // Si hay error, detener la carga
      }
    );
  }
}
