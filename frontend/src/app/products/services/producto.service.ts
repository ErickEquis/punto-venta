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

  getProdutos(descripcion: string = '', options: any): Observable<any> {
    return this.http.get<Productos[]>(`${this.url}?descripcion=${descripcion}`, options)
  }

  getProductoId(id: number, options: any): Observable<any> {
    return this.http.get<Productos[]>(`${this.url}/${id}`, options)
  }

  createProducto(body: any, options: any): Observable<any> {
    return this.http.post<Productos[]>(`${this.url}`, body, options)
  }

  editProducto(id: number, body: any, options: any): Observable<any> {
    return this.http.patch<Productos[]>(`${this.url}/${id}`, body, options)
  }

  deleteProducto(id: number, options: any): Observable<any> {
    return this.http.delete<Productos[]>(`${this.url}/${id}`, options)
  }

}
