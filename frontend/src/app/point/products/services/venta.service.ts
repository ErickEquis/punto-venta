import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private url: string

  constructor(private http: HttpClient) {
    this.url = `${environment.endpoint}ventas`
  }

  venta(body: any, options: any): Observable<any> {
    return this.http.post<any>(`${this.url}`, body, options)
  }

}
