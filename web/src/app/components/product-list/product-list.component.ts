import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/productInteface';
import { ProductService } from '../../services/product/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
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
}
