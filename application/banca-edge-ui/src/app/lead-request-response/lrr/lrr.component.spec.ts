import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LrrComponent } from './lrr.component';
import { ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';

describe('LrrComponent', () => {
  let component: LrrComponent;
  let fixture: ComponentFixture<LrrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LrrComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{ CID: 1 }]),
          },
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LrrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
