import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestNatureComponent } from './service-request-nature.component';

describe('ServiceRequestNatureComponent', () => {
  let component: ServiceRequestNatureComponent;
  let fixture: ComponentFixture<ServiceRequestNatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceRequestNatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRequestNatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
