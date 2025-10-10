import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestModeComponent } from './service-request-mode.component';

describe('ServiceRequestModeComponent', () => {
  let component: ServiceRequestModeComponent;
  let fixture: ComponentFixture<ServiceRequestModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceRequestModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRequestModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
