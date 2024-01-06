import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPwdPageComponent } from './forgot-pwd-page.component';

describe('ForgotPwdPageComponent', () => {
  let component: ForgotPwdPageComponent;
  let fixture: ComponentFixture<ForgotPwdPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPwdPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPwdPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
