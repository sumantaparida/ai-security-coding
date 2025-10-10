import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintAgainstComponent } from './complaint-against.component';

describe('ComplaintAgainstComponent', () => {
  let component: ComplaintAgainstComponent;
  let fixture: ComponentFixture<ComplaintAgainstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintAgainstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintAgainstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
