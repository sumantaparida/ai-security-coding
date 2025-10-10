import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComplaintComponent } from './home-complaint.component';

describe('HomeComplaintComponent', () => {
  let component: HomeComplaintComponent;
  let fixture: ComponentFixture<HomeComplaintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComplaintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
