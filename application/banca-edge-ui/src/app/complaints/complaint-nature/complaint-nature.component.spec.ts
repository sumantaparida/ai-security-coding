import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintNatureComponent } from './complaint-nature.component';

describe('ComplaintNatureComponent', () => {
  let component: ComplaintNatureComponent;
  let fixture: ComponentFixture<ComplaintNatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintNatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintNatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
