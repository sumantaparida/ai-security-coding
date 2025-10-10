import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayResultCiComponent } from './display-result-ci.component';

describe('DisplayResultCiComponent', () => {
  let component: DisplayResultCiComponent;
  let fixture: ComponentFixture<DisplayResultCiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayResultCiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayResultCiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
