import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditproductoVentaComponent } from './modal-editproducto-venta.component';

describe('ModalEditproductoVentaComponent', () => {
  let component: ModalEditproductoVentaComponent;
  let fixture: ComponentFixture<ModalEditproductoVentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditproductoVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditproductoVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
