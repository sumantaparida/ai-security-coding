import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectInsurerModelCisComponent } from './select-insurer-model-cis.component';

describe('SelectInsurerModelCisComponent', () => {
  let component: SelectInsurerModelCisComponent;
  let fixture: ComponentFixture<SelectInsurerModelCisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectInsurerModelCisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectInsurerModelCisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
