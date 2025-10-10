import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayResultUnitLinkedComponent } from './display-result-unit-linked.component';

describe('DisplayResultUnitLinkedComponent', () => {
  let component: DisplayResultUnitLinkedComponent;
  let fixture: ComponentFixture<DisplayResultUnitLinkedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayResultUnitLinkedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayResultUnitLinkedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
