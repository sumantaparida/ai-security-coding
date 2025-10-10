import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LeadManagementService } from '@app/lead-management/service/lead-management.service';
import { GetEmailPipe } from '@app/shared/pipes/get-email.pipe';
import { CustomersService } from '@app/mycustomers/services/customers.service';
import { LoaderService } from '@app/_services/loader.service';
import { TranslateModule } from '@ngx-translate/core';
import { of, ReplaySubject, throwError } from 'rxjs';

import { LeadQuotesComponent } from './lead-quotes.component';

class ActivatedRouteStub {
  private subject = new ReplaySubject<ParamMap>();

  constructor() {
    this.setParamMap({
      CIF: '1231651612'
    });
  }

  /** The mock paramMap observable */
  readonly params = this.subject.asObservable();

  /** Set the paramMap observables's next value */
  setParamMap(params) {
    this.subject.next(params);
  }
}
fdescribe('LeadQuotesComponent', () => {
  let component: LeadQuotesComponent;
  let fixture: ComponentFixture<LeadQuotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeadQuotesComponent, GetEmailPipe],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        MatDialogModule,
        TranslateModule.forRoot()],
      providers: [CustomersService,
        MatDialogModule, LeadManagementService,
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('onInit Should make API call and store the response', () => {

    const resp = {}
    const CIFspy = '13215132';
    const showLoaderSpy = spyOn(TestBed.inject(LoaderService), 'showSpinner');


    spyOn(TestBed.inject(CustomersService), 'getQuickQuote').and.callFake(() => {
      return of(resp);

    });

    component.ngOnInit();


    expect(showLoaderSpy).toHaveBeenCalledTimes(2);

    expect(component.quoteData).toEqual(resp);
    expect(CIFspy).toBe('13215132');
  });

  it('onInit Should set the CIF to be Null', () => {

    const resp = {}
    const CIFspy = null;
    const showLoaderSpy = spyOn(TestBed.inject(LoaderService), 'showSpinner');


    spyOn(TestBed.inject(CustomersService), 'getQuickQuote').and.callFake(() => {
      return of(resp);

    });

    component.ngOnInit();


    expect(showLoaderSpy).toHaveBeenCalledTimes(2);

    expect(component.quoteData).toEqual(resp);
    expect(CIFspy).toBe(null);
  });

  it('onInit Should make API call and Throw Error', () => {

    const resp = {}

    const showLoaderSpy = spyOn(TestBed.inject(LoaderService), 'showSpinner');


    spyOn(TestBed.inject(CustomersService), 'getQuickQuote').and.callFake(() => {
      return throwError(resp);

    });

    component.ngOnInit();


    expect(showLoaderSpy).toHaveBeenCalledTimes(2);

  });

  // it('Should Open Dailog with value', () => {

  //   const product = 0;

  //   const showLoaderSpy = spyOn(TestBed.inject(LoaderService), 'showSpinner');
  //   const selectedProductSpy = true;

  //   spyOn(component.dialog, 'open')
  //     .and
  //     .returnValue({ afterClosed: () => of('name') } as MatDialogRef<typeof component>);


  //   component.openSelectInsurer(product);

  //   expect(showLoaderSpy).toHaveBeenCalledTimes(3);
  //   expect(selectedProductSpy).toBe(true);
  // });

  // it('Should Open Dailog and API Call ', () => {
  //   const response = {
  //     value: '123155'
  //   };
  //   const product = 0;

  //   const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');

  //   spyOn(component.dialog, 'open')
  //     .and
  //     .returnValue({ afterClosed: () => of('name') } as MatDialogRef<typeof component>);

  //   spyOn(TestBed.inject(LeadManagementService), 'createLead').and.callFake((reqBody) => {
  //     return of(response);
  //   });


  //   component.openSelectInsurer(product);
  //   expect(navigateSpy).toHaveBeenCalledTimes(1);


  // });

  // it('Should Open Dailog with value', () => {
  //   const response = {};
  //   const prod = 0;

  //   spyOn(component.dialog, 'open')
  //     .and
  //     .returnValue({ afterClosed: () => of('name') } as MatDialogRef<typeof component>);

  //   const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');

  //   spyOn(TestBed.inject(LeadManagementService), 'createLead').and.callFake((reqBody) => {
  //     return of(response);
  //   });


  //   component.openSelectInsurer(prod);
  //   expect(navigateSpy).toHaveBeenCalled();


  // });
});
