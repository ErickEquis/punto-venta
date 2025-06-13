import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../services/auth.service';
import { Md5 } from 'md5-typescript';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  formSignIn: any
  showPassword = false

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.removeSesion();
    this.formSignIn = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email]),
      contrasenia: new FormControl('', [Validators.required]),
    })
  }

  removeSesion() {
    localStorage.getItem("identity_user") ? localStorage.removeItem("identity_user") : null;
  }

  get correo() {
    return this.formSignIn.get('correo')
  }

  get contrasenia() {
    return this.formSignIn.get('contrasenia')
  }

  togglePassword() {
    this.showPassword = !this.showPassword
  }

  signIn() {
    this.formSignIn.value.contrasenia = Md5.init(this.formSignIn.value.contrasenia);
    this.authService.login(this.formSignIn.value).subscribe({
      next: (res) => {
        localStorage.setItem('identity_user', JSON.stringify(res))
        window.location.assign('/point/product/home')
      },
      error: (error) => { this.toastr.error('', error.error.mensaje); }
    })
  }

}
