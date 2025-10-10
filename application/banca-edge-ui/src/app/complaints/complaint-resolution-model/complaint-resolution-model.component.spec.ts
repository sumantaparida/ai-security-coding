import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintResolutionModelComponent } from './complaint-resolution-model.component';

describe('ComplaintResolutionModalComponent', () => {
  let component: ComplaintResolutionModelComponent;
  let fixture: ComponentFixture<ComplaintResolutionModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintResolutionModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintResolutionModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
