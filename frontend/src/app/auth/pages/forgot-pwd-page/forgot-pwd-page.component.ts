import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';

@Component({
  selector: 'app-forgot-pwd-page',
  templateUrl: './forgot-pwd-page.component.html',
  styleUrls: ['./forgot-pwd-page.component.css'],
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective]
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
