import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Md5 } from 'md5-typescript';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {

  formSignUp: any
  identityUser: any = JSON.parse(localStorage.getItem('identity_user'))

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.authService.checkSignIn(this.identityUser)
    this.formSignUp = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      correo: new FormControl('', [Validators.required, Validators.email]),
      contrasenia: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]),
    })
  }

  get nombre() {
    return this.formSignUp.get('nombre')
  }
  get correo() {
    return this.formSignUp.get('correo')
  }
  get contrasenia() {
    return this.formSignUp.get('contrasenia')
  }

  createUser() {
    this.formSignUp.value.contrasenia = Md5.init(this.formSignUp.value.contrasenia)
    this.authService.signUp(this.formSignUp.value).subscribe(
      (response) => {
        this.toastr.success(response.mensaje, '')
        window.location.assign('/point/home')
      },
      (error) => { this.toastr.error(error.mensaje, 'Error!'); }
    )
  }

}
