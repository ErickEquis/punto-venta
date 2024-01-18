import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddproductsComponent } from './modal-addproducts.component';

describe('ModalAddproductsComponent', () => {
  let component: ModalAddproductsComponent;
  let fixture: ComponentFixture<ModalAddproductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddproductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
