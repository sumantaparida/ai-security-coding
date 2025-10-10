import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GetEmailPipe } from '@app/loan-account/pipes/get-email.pipe';
import { RecommendService } from '@app/loan-account/service/recommend-service';
import { LoaderService } from '@app/_services/loader.service';
import { of, throwError } from 'rxjs';
import { LoanDetailsComponent } from './loan-details.component';

fdescribe('LoanDetailsComponent', () => {
  let component: LoanDetailsComponent;
  let fixture: ComponentFixture<LoanDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        MatDialogModule],
      declarations: [LoanDetailsComponent, GetEmailPipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('OnClick should Enable the LoaderService and API call with valid info', () => {
    const response = {
      responseCode: 0,
      numQuotesExpected: 1,
      quoteId: 'p0982-piiow-123mdsl12'
    };
    spyOn(TestBed.inject(RecommendService), 'recommendInsuranceDetails').and.callFake((reBody) => {
      return of(response);
    });
    const loaderService = spyOn(TestBed.inject(LoaderService), 'showSpinner');
    const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');

    component.applicationDetails = {
      loanAccountNo: '123456789'
    };


    component.inputType = '1';
    component.onRecommendClick();

    expect(loaderService).toHaveBeenCalledTimes(2);
    expect(navigateSpy).toHaveBeenCalledWith(['group-credit', 'loan-quote', 'p0982-piiow-123mdsl12']);

  });

  it('Should call the API with Error Message', () => {
    const loaderService = spyOn(TestBed.inject(LoaderService), 'showSpinner');
    const openErrorModalSpy = spyOn(component, 'openErrorModal');

    component.inputType = '1';
    component.applicationDetails = {
      loanAccountNo: '123456789'
    };

    const response = {
      responseCode: 400,
      numQuotesExpected: 0,
      responseMessage: 'Error fetching quote'
    };

    spyOn(TestBed.inject(RecommendService), 'recommendInsuranceDetails').and.callFake((reBody) => {
      return of(response);
    });

    component.onRecommendClick();

    expect(loaderService).toHaveBeenCalledTimes(2);
    expect(openErrorModalSpy).toHaveBeenCalledWith('Error fetching quote');

  });

  it('Should throw Error upon failing the API call', () => {
    const loaderService = spyOn(TestBed.inject(LoaderService), 'showSpinner');
    const openErrorModalSpy = spyOn(component, 'openErrorModal');

    component.inputType = '1';
    component.applicationDetails = {
      loanAccountNo: '123456789'
    };

    const response = {
      responseMessage: 'Unable to fetch the data'
    };

    spyOn(TestBed.inject(RecommendService), 'recommendInsuranceDetails').and.callFake((reBody) => {
      return throwError(response);
    });

    component.onRecommendClick();

    expect(loaderService).toHaveBeenCalledTimes(2);
    expect(openErrorModalSpy).toHaveBeenCalledWith('Unable to fetch the data');

  });


  it('ngOnChanges should set control type currentLoanType to 1', () => {
    const changes = {
      loanTypeMaster: [{
        id: '1',
        value: 'Car-loan'
      }]
    };
    component.applicationDetails = {
      loanType: '1'
    };
    component.loanTypeMaster = [{ id: '1', value: 'Car Loan' }, { id: '2', value: 'Bike Loan' }];

    // Action
    component.ngOnChanges(changes);

    // Accept
    expect(component.currentLoanType).toEqual({ id: '1', value: 'Car Loan' });
  });

  it('ngOnChanges should not set currentLoanType to 1', () => {
    const changes = {};

    // Action
    component.ngOnChanges(changes);

    // Accept
    expect(component.currentLoanType).toEqual(undefined);
  });

  it('Should open the Error Model', () => {
    const openSpy = spyOn(TestBed.inject(MatDialog), 'open');
    const message = 'Error fetching quote';
    component.openErrorModal(message);
    expect(openSpy).toHaveBeenCalled();
  });


});
