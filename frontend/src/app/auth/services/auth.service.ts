import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url: string

  constructor(private http: HttpClient) {
    this.url = `${environment.endpoint}usuarios/`
  }

  getHeaders(token: string) {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    }
  }

  login(body: any): Observable<any> {
    return this.http.patch<any>(this.url, body)
  }

  signUp(body: any):Observable<any> {
    return this.http.post<any>(this.url, body)
  }

}
