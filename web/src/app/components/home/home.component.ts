import { Component } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import { CategoriesComponent } from '../categories/categories.component';
import { ProductListComponent } from '../product-list/product-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductListComponent, CarouselComponent, CategoriesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
