import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  create(formData: any): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}
