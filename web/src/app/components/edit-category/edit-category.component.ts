import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category/category.service';
import { GoBackComponent } from '../go-back/go-back.component';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [GoBackComponent, FormsModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.scss',
})
export class EditCategoryComponent implements OnInit {
  category: any = {};

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('id');
    if (categoryId) {
      const id = parseInt(categoryId, 10); // Convertir a número
      this.categoryService.getById(id).subscribe({
        next: (data) => {
          if (data) {
            this.category = data; // Precarga los datos del producto
          } else {
            console.error('Categoria no encontrado');
            this.router.navigate(['/products_admin']); // Redirige si no se encuentra el producto
          }
        },
        error: (err) => {
          console.error('Error al obtener la categoria:', err);
          this.router.navigate(['/products_admin']); // Maneja errores
        },
      });
    } else {
      console.error('ID de la categoria no válido');
      this.router.navigate(['/products_admin']); // Redirige si no hay ID válido
    }
  }

  updateCategory() {
    const formData = new FormData();
    formData.append('name', this.category.name);
    this.category.images.forEach((file: string | Blob) => {
      formData.append('images', file); // El nombre 'images' debe coincidir con el backend
    });

    // Enviar los datos al servicio
    this.categoryService.create(formData).subscribe(
      (response) => {
        console.log('Categoria creada satisfactoriamente:', response);
        this.resetForm(); // Limpiar el formulario después de enviar
      },
      (error) => {
        console.error('Error al crear categoria', error);
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
