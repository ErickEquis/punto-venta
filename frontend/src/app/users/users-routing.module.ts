import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutUsersPageComponent } from './pages/layout-users-page/layout-users-page.component';
import { HomeUsersPageComponent } from './pages/home-users-page/home-users-page.component';
import { EquipoPageComponent } from './pages/equipo-page/equipo-page.component';

const routes: Routes = [
  {
    path: '', component: LayoutUsersPageComponent,
    children: [
      {
        path: "home", component: HomeUsersPageComponent,
      },
      {
        path: "equipo", component: EquipoPageComponent,
      },
      {
        path: '**', redirectTo: 'home', pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
