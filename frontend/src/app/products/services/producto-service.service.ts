import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Productos } from '../interfaces/productos';

@Injectable({
  providedIn: 'root'
})

export class ProductoService {

  private url: string

  constructor(private http: HttpClient) {
    this.url = environment.endpoint
  }

  getProdutos(): Observable<Productos[]> {
    return this.http.get<Productos[]>(`${this.url}`)
  }

  getProductoId(id: number): Observable<Productos[]> {
    return this.http.get<Productos[]>(`${this.url}${id}`)
  }

  deleteProducto(id: number): Observable<Productos[]> {
    return this.http.delete<Productos[]>(`${this.url}${id}`)
  }

}
