import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {

  formSingUp: any

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.formSingUp = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      correo: new FormControl('', [Validators.required, Validators.email]),
      contrasenia: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]),
    })
  }

  get nombre() {
    return this.formSingUp.get('nombre')
  }
  get correo() {
    return this.formSingUp.get('correo')
  }
  get contrasenia() {
    return this.formSingUp.get('contrasenia')
  }

  createUser() {
    // this.authService.signUp(this.formSingUp.value).subscribe()
    console.log(this.contrasenia)
  }

}
