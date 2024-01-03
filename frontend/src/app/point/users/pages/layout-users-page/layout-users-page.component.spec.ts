import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutUsersPageComponent } from './layout-users-page.component';

describe('LayoutUsersPageComponent', () => {
  let component: LayoutUsersPageComponent;
  let fixture: ComponentFixture<LayoutUsersPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutUsersPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutUsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
