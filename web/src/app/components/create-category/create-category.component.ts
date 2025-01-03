import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category/category.service';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-category.component.html',
  styleUrl: '../create-product/create-product.component.scss',
})
export class CreateCategoryComponent {
  // Usar la interfaz Product para tipar el producto
  category: any = {
    name: '',
    images: [],
  };

  // Lista de categorías (esto puede venir de una API)
  categories: any[] = [];

  constructor(private categoryService: CategoryService) {}

  // Crear producto usando FormData
  createCategory() {
    const formData = new FormData();

    // Agregar los datos del producto al FormData
    formData.append('name', this.category.name);

    // Agregar las imágenes al FormData
    this.category.images.forEach((file: string | Blob) => {
      formData.append('images', file); // El nombre 'images' debe coincidir con el backend
    });

    // Enviar los datos al servicio
    this.categoryService.create(formData).subscribe(
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
      this.category.images = Array.from(input.files); // Convertir FileList a array
    }
  }

  // Método para limpiar el formulario
  resetForm() {
    this.category = {
      name: '',
      images: [],
    };
  }
}
