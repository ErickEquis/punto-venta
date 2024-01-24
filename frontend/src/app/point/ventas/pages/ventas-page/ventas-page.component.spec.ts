import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasPageComponent } from './ventas-page.component';

describe('VentasPageComponent', () => {
  let component: VentasPageComponent;
  let fixture: ComponentFixture<VentasPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
