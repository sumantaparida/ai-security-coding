import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayEditUnitLinkedComponent } from './display-edit-unit-linked.component';

describe('DisplayEditUnitLinkedComponent', () => {
  let component: DisplayEditUnitLinkedComponent;
  let fixture: ComponentFixture<DisplayEditUnitLinkedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayEditUnitLinkedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayEditUnitLinkedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
