import { Component} from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{
  identity_user: any = []

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.identity_user = JSON.parse(localStorage.getItem('identity_user'))
  }

  signOut() {
    this.authService.signOut()
  }

}
