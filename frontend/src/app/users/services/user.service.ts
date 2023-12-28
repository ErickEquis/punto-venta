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

  getUsers(options: any): Observable<any> {
    return this.http.get<Users[]>(`${this.url}`, options)
  }

  // getUserId(id: number, options: any): Observable<any>{
  //   return this.http.get<Users[]>(`${this.url}${id}`, options)
  // }

  deleteUser(id: number, options: any): Observable<any> {
    return this.http.delete<Users[]>(`${this.url}${id}`, options)
  }

}
