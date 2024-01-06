import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-pwd-page',
  templateUrl: './forgot-pwd-page.component.html',
  styleUrls: ['./forgot-pwd-page.component.css']
})
export class ForgotPwdPageComponent implements OnInit {

  formForgotPwd: any

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.formForgotPwd = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email]),
    })
  }

  get correo() {
    return this.formForgotPwd.get('correo')
  }

  forgotPwd() {
    this.authService.forgotPwd(this.formForgotPwd.value).subscribe()
  }

}
