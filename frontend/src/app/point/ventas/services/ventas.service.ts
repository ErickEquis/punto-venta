import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
    private url: string

  constructor(private http: HttpClient) {
    this.url = `${environment.endpoint}ventas`
  }

  getVentas(options: any): Observable<any> {
    return this.http.get<any>(`${this.url}`, options)
  }

  getVentaId(id: number, options: any): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`, options)
  }

  getTotalVentas(options: any): Observable<any> {
    return this.http.get<any>(`${this.url}-total`, options)
  }

  createVenta(body: any, options: any): Observable<any> {
    return this.http.post<any>(`${this.url}`, body, options)
  }



}
