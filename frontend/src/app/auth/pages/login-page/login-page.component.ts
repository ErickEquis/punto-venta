import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserServices } from 'src/app/users/services/user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  formSignIn: any

  constructor(private userService: UserServices) { }

  ngOnInit() {
    this.formSignIn = new FormGroup({
      correo: new FormControl(''),
      contrasenia: new FormControl(''),
    })
  }

  singIn() {
    console.log(this.formSignIn.value)
    this.userService.createSesion(this.formSignIn.value).subscribe()
  }

}
