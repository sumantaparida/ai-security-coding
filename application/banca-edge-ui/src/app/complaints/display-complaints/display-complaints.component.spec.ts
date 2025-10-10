import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayComplaintsComponent } from './display-complaints.component';

describe('DisplayComplaintsComponent', () => {
  let component: DisplayComplaintsComponent;
  let fixture: ComponentFixture<DisplayComplaintsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayComplaintsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
