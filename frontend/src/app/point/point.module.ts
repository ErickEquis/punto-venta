import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PointRoutingModule } from './point-routing.module';
import { LayoutPointPageComponent } from './layout/layout-point-page/layout-point-page.component';
import { SidenavComponent } from './layout/components/sidenav/sidenav.component';

@NgModule({
  declarations: [LayoutPointPageComponent, SidenavComponent],
  imports: [
    CommonModule,
    PointRoutingModule,
  ]
})
export class PointModule { }
