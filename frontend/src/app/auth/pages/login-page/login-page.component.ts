import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  formSignIn: any

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  getHeaders(token: string) {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    }
  }

  ngOnInit() {
    this.formSignIn = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email]),
      contrasenia: new FormControl('', [Validators.required]),
    })
  }

  get correo() {
    return this.formSignIn.get('correo')
  }

  get contrasenia() {
    return this.formSignIn.get('contrasenia')
  }

  signIn() {
    this.authService.login(this.formSignIn.value).subscribe((res) => {
      localStorage.setItem('identity_user', JSON.stringify(res))
    },
      (error) => {
        this.toastr.error(error.error.mensaje, 'Error!');
      }
    )
  }

}
