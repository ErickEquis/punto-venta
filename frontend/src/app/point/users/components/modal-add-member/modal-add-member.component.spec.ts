import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddMemberComponent } from './modal-add-member.component';

describe('ModalAddMemberComponent', () => {
  let component: ModalAddMemberComponent;
  let fixture: ComponentFixture<ModalAddMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
