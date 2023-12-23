import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../services/auth.service';
import { Md5 } from 'md5-typescript';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  formSignIn: any
  identityUser: any = JSON.parse(localStorage.getItem('identity_user'))

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.authService.checkSignIn(this.identityUser)
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
    this.formSignIn.value.contrasenia = Md5.init(this.formSignIn.value.contrasenia)
    this.authService.login(this.formSignIn.value).subscribe((res) => {
      localStorage.setItem('identity_user', JSON.stringify(res))
      window.location.assign('/point/home')
    },
      (error) => {
        this.toastr.error(error.error.mensaje, 'Error!');
      }
    )
  }

}
