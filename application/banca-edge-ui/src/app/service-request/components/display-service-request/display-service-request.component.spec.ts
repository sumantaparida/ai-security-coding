import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayServiceRequestComponent } from './display-service-request.component';

describe('DisplayServiceRequestComponent', () => {
  let component: DisplayServiceRequestComponent;
  let fixture: ComponentFixture<DisplayServiceRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayServiceRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayServiceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
