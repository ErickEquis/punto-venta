import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Md5 } from 'md5-typescript';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-new-member',
  templateUrl: './new-member.component.html',
  styleUrls: ['./new-member.component.css']
})
export class NewMemberComponent implements OnInit {

  formMember: any
  token: any
  options: any = {}

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.formMember = new UntypedFormGroup({
      nombre: new UntypedFormControl('', [Validators.required]),
      correo: new UntypedFormControl('', [Validators.required, Validators.email]),
      contrasenia: new UntypedFormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]),
      confContrasenia: new UntypedFormControl(''),
    }, { validators: authService.confirmarPwd })
  }

  ngOnInit() {
    localStorage.removeItem("identity_user")
    this.token = this.router.parseUrl(this.router.url).queryParamMap['params']['token']
    if (!this.token) window.location.assign('/auth/log-in');
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
  get confContrasenia() {
    return this.formMember.get('confContrasenia')
  }

  createUser() {
    this.options.params = new HttpParams()
      .set('token', this.token)
    this.formMember.value.contrasenia = Md5.init(this.formMember.value.contrasenia)
    this.formMember.value.confContrasenia = null
    this.authService.signUpMember(this.formMember.value, this.options)
      .subscribe({
        next: (response) => {
          this.toastr.success('', response.mensaje);
          this.router.navigate(["/auth/log-in"])
        },
        error: error => { this.toastr.error('', error.error.mensaje); }
      })
  }

}
