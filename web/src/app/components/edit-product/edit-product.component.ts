import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category/category.service';
import { ProductService } from '../../services/product/product.service';
import { GoBackComponent } from '../go-back/go-back.component';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [FormsModule, CommonModule, GoBackComponent],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss',
})
export class EditProductComponent implements OnInit {
  product: any = {};
  categorias: any[] = [];
  selectedImages: File[] = []; // Para almacenar las imágenes seleccionadas

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoriesService: CategoryService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      const id = parseInt(productId, 10); // Convertir a número
      this.productService.getById(productId).subscribe({
        next: (data) => {
          if (data) {
            this.product = data; // Precarga los datos del producto
          } else {
            console.error('Producto no encontrado');
            this.router.navigate(['/products_admin']); // Redirige si no se encuentra el producto
          }
        },
        error: (err) => {
          console.error('Error al obtener el producto:', err);
          this.router.navigate(['/products_admin']); // Maneja errores
        },
      });
    } else {
      console.error('ID del producto no válido');
      this.router.navigate(['/products_admin']); // Redirige si no hay ID válido
    }

    // Obtener categorías disponibles
    this.categoriesService.getAll().subscribe({
      next: (data) => (this.categorias = data),
      error: (err) => console.error('Error al obtener categorías:', err),
    });
  }

  // Método para manejar la selección de imágenes
  onImageSelect(event: any): void {
    this.selectedImages = Array.from(event.target.files); // Asignar las imágenes seleccionadas
  }

  onSubmit(): void {
    console.log('El producto: ', this.product);

    // Crear un FormData para enviar datos del producto y las imágenes
    const formData = new FormData();

    // Datos del producto (sin imágenes)
    formData.append('id', this.product.id.toString());
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price.toString());
    formData.append('category_id', this.product.category_id.toString());
    formData.append('available', this.product.available); // Asegúrate que el backend acepta '1'/'0'

    this.selectedImages.forEach((image) => {
      formData.append('images', image, image.name); // 'images' es el nombre del campo de archivos
    });

    console.log('El FormData: ', formData);
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    // Si no se ha seleccionado ninguna imagen, se procede con el producto sin imágenes
    this.productService
      .updateProduct(this.product.id, formData) // Asegúrate de pasar this.selectedImages
      .subscribe(
        () => {
          alert('Producto actualizado exitosamente');
          this.router.navigate(['/products_admin']);
        },
        (error) => {
          console.error('Error al actualizar producto:', error);
          alert('Hubo un error al actualizar el producto.');
        }
      );
  }
}
