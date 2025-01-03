import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiUrl = 'http://localhost:3000/api/categories';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  create(categoryData: FormData): Observable<any> {
    console.log('esta es la data: ', categoryData);
    return this.http.post<any>(this.apiUrl, categoryData).pipe(
      tap((response) => {
        console.log('Categoria agregada correctamente');
      }),
      catchError((error) => {
        console.log('Categoria no agregada');
        console.error(error);
        return of(null);
      })
    );
  }
}
