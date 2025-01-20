import { Routes } from '@angular/router';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { CategoriesAdminComponent } from './components/categories-admin/categories-admin.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CreateCategoryComponent } from './components/create-category/create-category.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { EditCategoryComponent } from './components/edit-category/edit-category.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PaySuccessComponent } from './components/pay-success/pay-success.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductModalComponent } from './components/product-modal/product-modal.component';
import { ProductsAdminComponent } from './components/products-admin/products-admin.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AdminGuard } from './guards/admin.guard';

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
    path: 'success',
    component: PaySuccessComponent,
  },
  {
    path: 'products',
    component: ProductListComponent,
  },
  {
    path: 'create_product',
    component: CreateProductComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'create_category',
    component: CreateCategoryComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'categories',
    component: CategoriesComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'modal/:id',
    component: ProductModalComponent,
  },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'products_admin',
    component: ProductsAdminComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'edit_product/:id',
    component: EditProductComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'categories_admin',
    component: CategoriesAdminComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'edit-category/:id',
    component: EditCategoryComponent,
    canActivate: [AdminGuard],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
