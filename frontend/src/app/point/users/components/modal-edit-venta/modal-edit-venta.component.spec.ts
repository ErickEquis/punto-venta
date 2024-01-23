import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditVentaComponent } from './modal-edit-venta.component';

describe('ModalEditVentaComponent', () => {
  let component: ModalEditVentaComponent;
  let fixture: ComponentFixture<ModalEditVentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
