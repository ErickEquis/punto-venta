import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioPageComponent } from './inventario-page.component';

describe('InventarioPageComponent', () => {
  let component: InventarioPageComponent;
  let fixture: ComponentFixture<InventarioPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventarioPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
