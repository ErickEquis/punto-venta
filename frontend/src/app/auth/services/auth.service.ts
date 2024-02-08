import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

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

  login(body: any): Observable<any> {
    console.log(this.url)
    return this.http.patch<any>(this.url, body)
  }

  signUp(body: any):Observable<any> {
    return this.http.post<any>(this.url, body)
  }

  signUpMember(body: any, options: any):Observable<any> {
    return this.http.post<any>(`${this.url}new-member`, body, options)
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

  restorePwd(body: any, options: any):Observable<any> {
    return this.http.patch<any>(`${this.url}restore-pwd`, body, options)
  }

  confirmarPwd (control: AbstractControl): ValidationErrors | null {
    return control.value.contrasenia === control.value.confContrasenia
    ? null
    : { PasswordNoMatch: true };
  }

}
