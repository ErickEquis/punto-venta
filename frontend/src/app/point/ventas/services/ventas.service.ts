import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Venta } from '../interfaces/venta';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private url: string

  constructor(private http: HttpClient) {
    this.url = `${environment.endpoint}ventas`
  }

  getVentas(options: any): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.url}`, options)
  }

  getVentaId(id: number, options: any): Observable<Venta> {
    return this.http.get<Venta>(`${this.url}/${id}`, options)
  }

  getTotalVentas(options: any): Observable<any> {
    return this.http.get<any>(`${this.url}-total`, options)
  }

  createVenta(body: any, options: any): Observable<Venta> {
    return this.http.post<Venta>(`${this.url}`, body, options)
  }

  editVenta(body: any, id: number, options: any): Observable<Venta> {
    return this.http.patch<Venta>(`${this.url}/${id}`, body, options)
  }

  deleteVenta(id: number, options: any): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`, options)
  }

  mayorVendedores(options: any): Observable<any> {
    return this.http.get<any>(`${this.url}-vendedores`, options)
  }

  historialVentas(id: number, options: any): Observable<any> {
    return this.http.get<any>(`${this.url}-historial/${id}`, options)
  }

}
