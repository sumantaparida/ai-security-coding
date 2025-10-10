import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitLinkComponent } from './unit-link.component';

describe('UnitLinkComponent', () => {
  let component: UnitLinkComponent;
  let fixture: ComponentFixture<UnitLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
