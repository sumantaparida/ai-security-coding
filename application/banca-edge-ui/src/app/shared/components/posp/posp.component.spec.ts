import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PospComponent } from './posp.component';

describe('ComponentsComponent', () => {
  let component: PospComponent;
  let fixture: ComponentFixture<PospComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PospComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PospComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
