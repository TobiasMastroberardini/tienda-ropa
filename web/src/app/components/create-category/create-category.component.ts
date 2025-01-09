import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category/category.service';
import { GoBackComponent } from '../go-back/go-back.component';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [FormsModule, GoBackComponent],
  templateUrl: './create-category.component.html',
  styleUrl: '../create-product/create-product.component.scss',
})
export class CreateCategoryComponent {
  category: any = {
    name: '',
    images: [],
  };

  categories: any[] = [];

  constructor(private categoryService: CategoryService) {}

  createCategory() {
    const formData = new FormData();
    formData.append('name', this.category.name);
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
