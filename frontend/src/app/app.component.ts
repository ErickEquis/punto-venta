import { Component} from '@angular/core';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{
  identityUser: any

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.identityUser = JSON.parse(localStorage.getItem('identity_user'))
    // this.authService.checkSignIn(this.identityUser);
  }

  signOut() {
    this.authService.signOut()
  }

}
