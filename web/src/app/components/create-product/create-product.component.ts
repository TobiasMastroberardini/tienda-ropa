import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss',
})
export class CreateProductComponent {
  product = {
    name: '',
    price: '',
    description: '',
    available: true,
    category_id: 1,
    images: [] as File[],
  };

  categories = [
    { id: 1, name: 'Camisetas' },
    { id: 2, name: 'Pantalones' },
    { id: 3, name: 'Zapatos' },
  ]; // Aquí puedes obtener las categorías desde la API si es necesario

  constructor(private productService: ProductService) {}

  onFileChange(event: any): void {
    // Asignar las imágenes seleccionadas al array `images`
    if (event.target.files) {
      this.product.images = Array.from(event.target.files);
    }
  }

  submit(): void {
    const productData = {
      name: this.product.name,
      price: this.product.price,
      description: this.product.description,
      available: this.product.available,
      category_id: this.product.category_id,
      images: this.product.images.map((image) => ({ image_url: image.name })), // Transformar al formato esperado
    };

    this.productService.create(productData).subscribe({
      next: (response) => {
        console.log('Producto creado:', response);
        alert('Producto creado con éxito');
      },
      error: (error) => {
        console.error('Error al crear el producto:', error);
        alert('Hubo un error al crear el producto');
      },
    });
  }
}
