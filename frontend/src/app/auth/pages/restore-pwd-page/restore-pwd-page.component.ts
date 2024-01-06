import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Md5 } from 'md5-typescript';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-restore-pwd-page',
  templateUrl: './restore-pwd-page.component.html',
  styleUrls: ['./restore-pwd-page.component.css']
})
export class RestorePwdPageComponent implements OnInit {

  formRestorePwd: any
  token: string

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.token = this.router.parseUrl(this.router.url).queryParamMap['params']['token']
    if (!this.token) window.location.assign('/auth/log-in');
    this.formRestorePwd = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email]),
      contrasenia: new FormControl('', [Validators.required]),
    })
  }

  get correo() {
    return this.formRestorePwd.get('correo')
  }

  get contrasenia() {
    return this.formRestorePwd.get('contrasenia')
  }

  restorePwd() {
    this.formRestorePwd.value.contrasenia = Md5.init(this.formRestorePwd.value.contrasenia)
    this.authService.restorePwd(this.formRestorePwd.value, this.token).subscribe()
    window.location.assign('/auth/log-in')
  }

}
