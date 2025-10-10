import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeServiceRequestComponent } from './home-service-request.component';

describe('HomeServiceRequestComponent', () => {
  let component: HomeServiceRequestComponent;
  let fixture: ComponentFixture<HomeServiceRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeServiceRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeServiceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
