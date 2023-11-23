import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})

export class ProductoServiceService {

  private url: string = environment.endpoint

  constructor(private http: HttpClient) {
    this.url = environment.endpoint
  }

  getProdutos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url)
  }

}
