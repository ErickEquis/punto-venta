import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url: string

  constructor(
    private http: HttpClient,
  ) {
    this.url = `${environment.endpoint}auth/`
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

  signOut() {
    localStorage.removeItem('identity_user')
    window.location.assign('/point/home')
  }

  checkSignIn(identity_user?: any) {
    if (!identity_user) {
      window.location.assign('/auth/log-in')
    }
  }

  forgotPwd(body: any):Observable<any> {
    return this.http.put<any>(`${this.url}forgot-pwd`, body)
  }

  restorePwd(body: any, query: string):Observable<any> {
    return this.http.patch<any>(`${this.url}restore-pwd?token=${query}`, body)
  }

}
