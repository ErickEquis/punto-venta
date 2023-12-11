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

  getProdutos(descripcion: string = ''): Observable<Productos[]> {
    return this.http.get<Productos[]>(`${this.url}productos?descripcion=${descripcion}`)
  }

  getProductoId(id: number): Observable<Productos[]> {
    return this.http.get<Productos[]>(`${this.url}productos/${id}`)
  }

  createProducto(body: any) {
    return this.http.post<Productos[]>(`${this.url}productos`, body)
  }

  editProducto(id: number, body: any): Observable<Productos[]> {
    return this.http.patch<Productos[]>(`${this.url}productos/${id}`, body)
  }

  deleteProducto(id: number): Observable<Productos[]> {
    return this.http.delete<Productos[]>(`${this.url}productos/${id}`)
  }

}
