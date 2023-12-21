import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Users } from '../interfaces/users';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServices {

  url: string

  constructor(private http: HttpClient) {
    this.url = `${environment.endpoint}usuarios/`
  }

  getUsers(): Observable<Users[]>{
    return this.http.get<Users[]>(`${this.url}`)
  }

  getUserId(id: number): Observable<Users[]>{
    return this.http.get<Users[]>(`${this.url}${id}`)
  }

  createUser(body: any): Observable<Users> {
    return this.http.post<Users>(`${this.url}`, body)
  }

  createSesion(body: any): Observable<Users> {
    return this.http.put<Users>(`${this.url}`, body)
  }

}
