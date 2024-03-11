import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    this.formForgotPwd = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email]),
    })
  }

  get correo() {
    return this.formForgotPwd.get('correo')
  }

  forgotPwd() {
    this.authService.forgotPwd(this.formForgotPwd.value)
      .subscribe(
        response => {
          this.toastr.success('', response.mensaje);
          this.router.navigate(["/auth/log-in"])
        },
        error => { this.toastr.error('', error.error.mensaje); }
      )
  }

}
