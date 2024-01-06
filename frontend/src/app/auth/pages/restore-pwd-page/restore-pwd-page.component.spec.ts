import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestorePwdPageComponent } from './restore-pwd-page.component';

describe('RestorePwdPageComponent', () => {
  let component: RestorePwdPageComponent;
  let fixture: ComponentFixture<RestorePwdPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestorePwdPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestorePwdPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
