import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyrenewalsComponent } from './myrenewals.component';
import { ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';

describe('MyrenewalsComponent', () => {
  let component: MyrenewalsComponent;
  let fixture: ComponentFixture<MyrenewalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyrenewalsComponent],
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
    fixture = TestBed.createComponent(MyrenewalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
