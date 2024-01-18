import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditproductsComponent } from './modal-editproducts.component';

describe('ModalEditproductsComponent', () => {
  let component: ModalEditproductsComponent;
  let fixture: ComponentFixture<ModalEditproductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditproductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
