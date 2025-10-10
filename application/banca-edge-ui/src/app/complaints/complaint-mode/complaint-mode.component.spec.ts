import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintModeComponent } from './complaint-mode.component';

describe('ComplaintModeComponent', () => {
  let component: ComplaintModeComponent;
  let fixture: ComponentFixture<ComplaintModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
