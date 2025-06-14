import { HttpHeaders } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/services/auth.service';
import { NotificacionesService } from 'src/app/point/notificaciones/services/notificaciones.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  ariaLabel: string;
}

@Component({
  selector: 'layout-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})

export class SidenavComponent implements OnInit {

  identityUser = JSON.parse(localStorage.getItem('identity_user'))
  options: any = {}
  count: number
  menuItems: MenuItem[] = [
    {
      label: 'Ventas',
      icon: 'home',
      route: '/point/product/home',
      ariaLabel: 'Ir a ventas'
    },
    {
      label: 'Inventario',
      icon: 'store',
      route: '/point/product/inventario',
      ariaLabel: 'Ir a inventario'
    },
    {
      label: 'Usuarios',
      icon: 'person',
      route: '/point/user/home',
      ariaLabel: 'Ir a usuarios'
    }
  ]
  isMenuCollapsed = true
  isMobile = window.innerWidth < 768
  isLightTheme = true

  constructor(
    private authService: AuthService,
    private notificacionesService: NotificacionesService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    this.countNotificaciones();
    this.isMobile = window.innerWidth < 768
    if (!this.isMobile) {
      this.isMenuCollapsed = false
    }
    const theme = localStorage.getItem('bs-theme') || 'light'
    this.isLightTheme = theme === 'light'
    document.documentElement.setAttribute('data-bs-theme', this.isLightTheme ? 'light' : 'dark')
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth < 768
    if (!this.isMobile) {
      this.isMenuCollapsed = false
    }
  }

  getHeaders(token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    })
    return headers
  }

  logout() {
    this.authService.signOut()
  }

  toggleMenu() {
    if (this.isMobile) {
      this.isMenuCollapsed = !this.isMenuCollapsed
    }
  }

  toggleTheme() {
    this.isLightTheme = !this.isLightTheme
    const theme = this.isLightTheme ? 'light' : 'dark'
    document.documentElement.setAttribute('data-bs-theme', theme)
    localStorage.setItem('bs-theme', theme)
  }

  countNotificaciones() {
    this.options.headers = this.identityUser ? this.getHeaders(this.identityUser.token) : null
    this.notificacionesService.countNotificaciones(this.options)
      .subscribe({
        next: (count) => { this.count = count },
        error: (error) => {
          if (error.status == 403) {
            setTimeout(() => {
              this.authService.signOut()
            }, 1500);
          }
          this.toastr.error(error.error.mensaje, 'Error!');
        }
      })
  }

}
