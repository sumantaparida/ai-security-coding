import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingTraditionalComponent } from './saving-traditional.component';

describe('SavingTraditionalComponent', () => {
  let component: SavingTraditionalComponent;
  let fixture: ComponentFixture<SavingTraditionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavingTraditionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingTraditionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
