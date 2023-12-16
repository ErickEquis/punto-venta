import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserServices } from 'src/app/users/services/user.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {

  formSingUp: any

  constructor(private userService: UserServices) { }

  ngOnInit() {
    this.formSingUp = new FormGroup({
      nombre: new FormControl(''),
      correo: new FormControl(''),
      contrasenia: new FormControl(''),
    })
  }

  createUser() {
    this.userService.createUser(this.formSingUp.value).subscribe()
  }

}
