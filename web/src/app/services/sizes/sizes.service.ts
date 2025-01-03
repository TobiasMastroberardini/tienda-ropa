import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SizesService {
  apiUrl = 'http://localhost:3000/api/sizes';

  constructor(private http: HttpClient) {}

  getByProductId(id: number) {
    return this.http.get<any[]>(`${this.apiUrl}/product/${id}`);
  }
}
