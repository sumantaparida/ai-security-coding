import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoaderService } from '@app/_services/loader.service';

import { RecommendInsuranceComponent } from './recommend-insurance.component';
import { RecommendService } from '../../service/recommend-service'
import { of, ReplaySubject, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TouchSequence } from 'selenium-webdriver';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

class ActivatedRouteStub {
  private subject = new ReplaySubject<ParamMap>();

  constructor() {
    this.setParamMap({
      quoteId: '123465465',

    });
  }

  /** The mock paramMap observable */
  readonly params = this.subject.asObservable();

  /** Set the paramMap observables's next value */
  setParamMap(params) {
    this.subject.next(params);
  }
}

fdescribe('RecommendInsuranceComponent', () => {
  let component: RecommendInsuranceComponent;
  let fixture: ComponentFixture<RecommendInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecommendInsuranceComponent],
      imports: [HttpClientTestingModule, MatDialogModule,
        RouterTestingModule, ReactiveFormsModule, MatFormFieldModule, MatListModule, MatIconModule, MatFormFieldModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        }, { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('onInit should set the quote id', () => {
  //   const response = {}

  //   const showLoaderSpy = spyOn(TestBed.inject(LoaderService), 'showSpinner');

  //   spyOn(TestBed.inject(RecommendService), 'getQuoteById').and.callFake((reqBody) => {
  //     return of(response);
  //   });


  // });

  it('ngOnInit API call and store the response', () => {
    const response = {
      quoteId: '13131',
      numQuotesExpected: 1
    };
    const responseValue = { productQuote: [{ productId: 1, productName: 'Avaiva' }, { productId: 2, productName: 'LIC' }] };
    const showLoaderSpy = spyOn(TestBed.inject(LoaderService), 'showSpinner');

    spyOn(TestBed.inject(RecommendService), 'getQuoteById').and.callFake((reqBody) => {
      return of(response);
    });

    spyOn(TestBed.inject(RecommendService), 'getHealthQuote').and.callFake((reqBody) => {
      return of(responseValue);
    });

    component.ngOnInit();



    expect(component.quoteId).toEqual(response['quoteId']);
    expect(showLoaderSpy).toHaveBeenCalledTimes(2);
    expect(component.recommendationData).toBe(responseValue);


  });



  // it('onInit forEach', () => {
  //   const recommendationData = { productQuote: [{ productId: 1, productName: 'Avaiva' }, { productId: 2, productName: 'LIC' }] };


  //   component.ngOnInit();

  //   recommendationData.productQuote.forEach(index => {

  //     expect(component.quoteForm.get(`product-checkbox-${index}`)).toBeNull();


  //   });


  // });


  it('should call ngOnInit API call and store the response', () => {
    const response = {
      quoteId: '13131',
      numQuotesExpected: - 1
    };
    const responseValue = {};
    const showLoaderSpy = spyOn(TestBed.inject(LoaderService), 'showSpinner');



    spyOn(TestBed.inject(RecommendService), 'getQuoteById').and.callFake((reqBody) => {
      return of(response);
    });

    component.ngOnInit();

    expect(component.quoteId).toEqual(response['quoteId']);
    expect(showLoaderSpy).toHaveBeenCalledTimes(1);


  });

  it('OnInit should invoke API call Throw Error', () => {
    const response = {};

    const showLoaderSpy = spyOn(TestBed.inject(LoaderService), 'showSpinner');

    spyOn(TestBed.inject(RecommendService), 'getQuoteById').and.callFake(() => {
      return throwError(response);
    });

    component.ngOnInit();

    expect(showLoaderSpy).toHaveBeenCalledTimes(2);

  });

  it('OnInit should invoke API call Throw Error', () => {
    const response = {};

    const showLoaderSpy = spyOn(TestBed.inject(LoaderService), 'showSpinner');

    spyOn(TestBed.inject(RecommendService), 'getHealthQuote').and.callFake(() => {
      return throwError(response);
    });

    component.ngOnInit();

    expect(showLoaderSpy).toHaveBeenCalledTimes(1);

  });


  // it('onSubmit ', () => {
  //   const quoteForm = [{ controls: { a: '1', b: '2', c: '3' } }];

  //   component.onSubmit();

  //   expect(component.quoteForm.value).toBe(quoteForm);
  // });



  // it('onMoreDetails', () => {

  //   const i = '';

  //   component.moreDetails(i);

  //   expect(component.moreDetails).toHaveBeenCalledWith(i);
  // });



  it('onCheckbocChange IF', () => {
    const event = { checked: true }
    const enableBtnSpy = true;
    const flagSpy = false;

    component.onCheckboxChange(event);

    expect(component.enableBtn).toBe(enableBtnSpy);

  });

  it('onCheckbocChange ELSE', () => {
    const event = { checked: false }
    const enableBtnSpy = false;

    component.onCheckboxChange(event);

    expect(component.enableBtn).toBe(enableBtnSpy);

  });



});
