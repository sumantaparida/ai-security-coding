import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestAgainstComponent } from './service-request-against.component';

describe('ServiceRequestAgainstComponent', () => {
  let component: ServiceRequestAgainstComponent;
  let fixture: ComponentFixture<ServiceRequestAgainstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceRequestAgainstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRequestAgainstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
