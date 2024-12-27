import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/productInteface';
import { ProductService } from '../../services/product/product.service';
@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent {
  // Usar la interfaz Product para tipar el producto
  product: Product = {
    name: '',
    price: 0,
    description: '',
    available: true,
    category_id: 1,
    images: [],
  };

  // Lista de categorías (esto puede venir de una API)
  categories = [
    { id: 1, name: 'Camisetas' },
    { id: 2, name: 'Pantalones' },
    { id: 3, name: 'Zapatos' },
  ];

  constructor(private productService: ProductService) {}

  // Crear producto usando FormData
  createProduct() {
    const formData = new FormData();

    // Agregar los datos del producto al FormData
    formData.append('name', this.product.name);
    formData.append('price', this.product.price.toString());
    formData.append('description', this.product.description);
    formData.append('available', this.product.available.toString());
    formData.append('category_id', this.product.category_id.toString());

    // Agregar las imágenes al FormData
    this.product.images.forEach((file) => {
      formData.append('images', file); // El nombre 'images' debe coincidir con el backend
    });

    // Enviar los datos al servicio
    this.productService.createProduct(formData).subscribe(
      (response) => {
        console.log('Producto creado satisfactoriamente:', response);
        this.resetForm(); // Limpiar el formulario después de enviar
      },
      (error) => {
        console.error('Error al crear producto', error);
      }
    );
  }

  // Manejar la selección de archivos
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.product.images = Array.from(input.files); // Convertir FileList a array
    }
  }

  // Método para limpiar el formulario
  resetForm() {
    this.product = {
      name: '',
      price: 0,
      description: '',
      available: true,
      category_id: 1,
      images: [],
    };
  }
}
