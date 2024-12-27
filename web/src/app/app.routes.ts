import { Routes } from '@angular/router';
import { CategoriesComponent } from './components/categories/categories.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'products',
    component: ProductListComponent,
  },
  {
    path: 'new',
    component: CreateProductComponent,
  },
  {
    path: 'categories',
    component: CategoriesComponent,
  },
];
