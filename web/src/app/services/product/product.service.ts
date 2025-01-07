import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { AlertService } from '../alert/alert.service';
import { CookieService } from '../cookies/cookie.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl = 'http://localhost:3000/api/products';

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private cookieService: CookieService
  ) {}

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

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap((response) => {
        console.log('Producto eliminado correctamente');
      }),
      catchError((error) => {
        console.log('Producto no eliminado');
        console.error(error);
        return of(null);
      })
    );
  }

  updateProduct(productId: number, productData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${productId}`, productData).pipe(
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
