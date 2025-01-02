import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  // Método para buscar productos en base al query
  searchProducts(query: string): Observable<any> {
    console.log(query);
    return this.http.get<any[]>(`${this.apiUrl}/search?${query}`);
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}`);
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
