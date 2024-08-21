import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Md5 } from 'md5-typescript';

import { AuthService } from '../../services/auth.service';
import { HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-restore-pwd-page',
  templateUrl: './restore-pwd-page.component.html',
  styleUrls: ['./restore-pwd-page.component.css']
})
export class RestorePwdPageComponent implements OnInit {

  formRestorePwd: any
  token: string
  options: any = {}

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    localStorage.removeItem("identity_user")
    this.token = this.router.parseUrl(this.router.url).queryParamMap['params']['token']
    if (!this.token) window.location.assign('/auth/log-in');
    this.formRestorePwd = new UntypedFormGroup({
      correo: new UntypedFormControl('', [Validators.required, Validators.email]),
      contrasenia: new UntypedFormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]),
      confContrasenia: new UntypedFormControl('', [Validators.required]),
    }, { validators: this.authService.confirmarPwd })
  }

  get correo() {
    return this.formRestorePwd.get('correo')
  }

  get contrasenia() {
    return this.formRestorePwd.get('contrasenia')
  }

  get confContrasenia() {
    return this.formRestorePwd.get('confContrasenia')
  }

  restorePwd() {
    this.options.params = new HttpParams()
      .set('token', this.token)
    this.formRestorePwd.value.contrasenia = Md5.init(this.formRestorePwd.value.contrasenia)
    this.formRestorePwd.value.confContrasenia = null
    this.authService.restorePwd(this.formRestorePwd.value, this.options)
      .subscribe({
        next:
          response => {
            this.toastr.success('', response.mensaje);
            this.router.navigate(["/auth/log-in"])
          },
        error: error => { this.toastr.error('', error.error.mensaje); }
      })
  }

}
