import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Md5 } from 'md5-typescript';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-member',
  templateUrl: './new-member.component.html',
  styleUrls: ['./new-member.component.css']
})
export class NewMemberComponent implements OnInit {

  formMember: any
  token: any

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.formMember = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      correo: new FormControl('', [Validators.required, Validators.email]),
      contrasenia: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]),
    })
  }

  ngOnInit() {
    localStorage.removeItem("identity_user")
    this.token = this.router.parseUrl(this.router.url).queryParamMap['params']['token']
  }

  get nombre() {
    return this.formMember.get('nombre')
  }
  get correo() {
    return this.formMember.get('correo')
  }
  get contrasenia() {
    return this.formMember.get('contrasenia')
  }

  createUser() {
    this.formMember.value.contrasenia = Md5.init(this.formMember.value.contrasenia)
    this.authService.signUpMember(this.formMember.value, this.token)
      .subscribe(
        (response) => {
          this.toastr.success(response.mensaje, '')
          window.location.assign('/auth/sign-in')
        },
        (error) => { this.toastr.error(error.mensaje, 'Error!'); }
      )
  }

}
