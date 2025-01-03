import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart/cart.service';
import { ProductService } from '../../services/product/product.service';
import { SizesService } from '../../services/sizes/sizes.service';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss',
})
export class ProductModalComponent {
  product: any | null = null;
  sizes: any[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private sizeService: SizesService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const productId = params['id'];
      this.loadProduct(productId);
    });
  }

  loadProduct(id: string) {
    this.productService.getById(id).subscribe(
      (data) => {
        this.product = data;
        this.isLoading = false; // El producto se ha cargado
        this.loadSizes();
      },
      (error) => {
        console.error('Error al obtener el producto:', error);
        this.isLoading = false; // Si hay error, detener la carga
      }
    );
  }

  loadSizes() {
    this.sizeService.getByProductId(this.product.id).subscribe((data) => {
      this.sizes = data;
    });
  }

  addToCart(productId: number) {
    console.log('Se envía desde el componente');

    this.cartService.addToCart(productId, 1).subscribe(
      (response) => {
        if (response) {
          console.log('Producto añadido al carrito:', response);
        }
      },
      (error) => {
        console.error('Error al añadir producto al carrito:', error);
      }
    );
  }
}
