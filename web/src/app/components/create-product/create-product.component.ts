import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent {
  // Propiedades de producto
  name: string = '';
  price: number | null = null;
  description: string = '';
  available: boolean = true; // Ejemplo: true = disponible, false = no disponible
  category_id: number = 1; // Para manejar la categoría seleccionada
  images: File[] = []; // Almacena las imágenes seleccionadas

  // Lista de categorías
  categories = [
    { id: 1, name: 'Camisetas' },
    { id: 2, name: 'Pantalones' },
    { id: 3, name: 'Zapatos' },
  ]; // Aquí puedes obtener las categorías desde la API si es necesario

  constructor(private productService: ProductService) {}

  createProduct() {
    const formData = new FormData();

    // Agregar los datos del producto al FormData
    formData.append('name', this.name);
    formData.append('price', this.price?.toString() || '0');
    formData.append('description', this.description);
    formData.append('available', this.available.toString());
    formData.append('category_id', this.category_id.toString());

    // Agregar las imágenes al FormData
    this.images.forEach((file) => {
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.images = Array.from(input.files); // Convertir FileList a array
    }
  }

  // Método para limpiar el formulario
  resetForm() {
    this.name = '';
    this.price = null;
    this.description = '';
    this.available = true;
    this.category_id = 1;
    this.images = [];
  }
}
