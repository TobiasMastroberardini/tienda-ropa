import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/productInteface';
import { ProductService } from '../../services/product/product.service';
import { LoaderComponent } from '../loader/loader.component';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, LoaderComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;

  constructor(
    private productService: ProductService,
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
}
