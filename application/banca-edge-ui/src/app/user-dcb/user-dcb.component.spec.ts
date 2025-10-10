import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDcbComponent } from './user-dcb.component';

describe('UserDcbComponent', () => {
  let component: UserDcbComponent;
  let fixture: ComponentFixture<UserDcbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserDcbComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDcbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
