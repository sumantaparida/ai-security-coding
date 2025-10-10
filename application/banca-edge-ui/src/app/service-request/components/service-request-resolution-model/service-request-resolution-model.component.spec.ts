import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestResolutionModelComponent } from './service-request-resolution-model.component';

describe('ServiceRequestResolutionModalComponent', () => {
  let component: ServiceRequestResolutionModelComponent;
  let fixture: ComponentFixture<ServiceRequestResolutionModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceRequestResolutionModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRequestResolutionModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
