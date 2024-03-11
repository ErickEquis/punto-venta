import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Md5 } from 'md5-typescript';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {

  formSignUp: any

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    localStorage.removeItem("identity_user")
    this.formSignUp = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      correo: new FormControl('', [Validators.required, Validators.email]),
      contrasenia: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]),
      confContrasenia: new FormControl('', [Validators.required]),
      nombre_equipo: new FormControl(''),
    },
      { validators: this.authService.confirmarPwd }
    )
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
  get confContrasenia() {
    return this.formSignUp.get('confContrasenia')
  }

  createUser() {
    this.formSignUp.value.contrasenia = Md5.init(this.formSignUp.value.contrasenia)
    this.authService.signUp(this.formSignUp.value)
      .subscribe(
        (response) => {
          this.toastr.success('', response.mensaje);
          this.router.navigate(["/auth/log-in"])
        },
        error => { this.toastr.error('', error.error.mensaje); }
      )
  }

}
