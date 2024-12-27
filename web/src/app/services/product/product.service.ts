import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Product } from '../../models/productInteface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getById(id: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/${id}`);
  }

  createProduct(productData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, productData).pipe(
      tap((response) => {
        console.log('Producto agregado correctamente');
      }),
      catchError((error) => {
        console.log('Producto no agregado');
        console.error(error);
        return of(null);
      })
    );
  }
}
