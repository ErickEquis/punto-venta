import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-pwd-page',
  templateUrl: './forgot-pwd-page.component.html',
  styleUrls: ['./forgot-pwd-page.component.css']
})
export class ForgotPwdPageComponent implements OnInit {

  formForgotPwd: any

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    localStorage.removeItem("identity_user")
    this.formForgotPwd = new UntypedFormGroup({
      correo: new UntypedFormControl('', [Validators.required, Validators.email]),
    })
  }

  get correo() {
    return this.formForgotPwd.get('correo')
  }

  forgotPwd() {
    this.authService.forgotPwd(this.formForgotPwd.value)
      .subscribe({
        next: response => {
          this.toastr.success('', response.mensaje);
          this.router.navigate(["/auth/log-in"])
        },
        error: error => { this.toastr.error('', error.error.mensaje); }
      })
  }

}
