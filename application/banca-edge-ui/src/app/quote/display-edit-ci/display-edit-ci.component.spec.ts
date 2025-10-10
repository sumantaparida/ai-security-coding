import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayEditCiComponent } from './display-edit-ci.component';

describe('DisplayEditCiComponent', () => {
  let component: DisplayEditCiComponent;
  let fixture: ComponentFixture<DisplayEditCiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayEditCiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayEditCiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
