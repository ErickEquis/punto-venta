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
    this.url = `${environment.endpoint}productos`
  }

  getProdutos(descripcion: string = ''): Observable<Productos[]> {
    return this.http.get<Productos[]>(`${this.url}?descripcion=${descripcion}`)
  }

  getProductoId(id: number): Observable<Productos[]> {
    return this.http.get<Productos[]>(`${this.url}/${id}`)
  }

  createProducto(body: any): Observable<Productos[]> {
    return this.http.post<Productos[]>(`${this.url}`, body)
  }

  editProducto(id: number, body: any): Observable<Productos[]> {
    return this.http.patch<Productos[]>(`${this.url}/${id}`, body)
  }

  deleteProducto(id: number): Observable<Productos[]> {
    return this.http.delete<Productos[]>(`${this.url}/${id}`)
  }

}
