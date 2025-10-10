import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCorrectionComponent } from './details-correction.component';

describe('DetailsCorrectionComponent', () => {
  let component: DetailsCorrectionComponent;
  let fixture: ComponentFixture<DetailsCorrectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsCorrectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
