import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostalCode } from '@app/interface/Customer';
import { environment } from '@environments/environment';
import { payload } from '../models/form-data';
import { interval, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenService } from '@app/_services/token.service';
import { Validators } from '@angular/forms';
import { maxvalueVal } from '@app/shared/validators/maxValue.validator';

@Injectable({
  providedIn: 'root',
})
export class ComprehensiveInsuranceSystemService {
  token;

  private IntervalTimer: Subscription;

  private successResponse: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient,
    private tokenService: TokenService 
    ) {}
  insurerAppilcationData
  getDropdownFromMaster(master: string, lob: string, productType: string, insurerId: string, cisNumber: string) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getCISMasterCodes/${master}/${lob}/${productType}/${insurerId}/${cisNumber}`,
    );
  }

  getCityAndState(pincode: string) {
    return this.http.get<PostalCode>(`${environment.apiUrl}/api/v1/master/getPinData/${pincode}`);
  }

  getCustomerById(customerId) {
    return this.http.get(`${environment.apiUrl}/api/v1/customer/getCustomerById/${customerId}`);
  }
  getCustomerByIdCis(customerId,orgCode) {
    return this.http.get(`${environment.apiUrl}/api/v1/customer/getCustomerByIdForConsent/${customerId}/${orgCode}`);
  }

    validateInsurerApplication(insurerCode,appNo){
      return this.http.get(`${environment.apiUrl}/api/v1/lms/getProposalValidation/KB/${insurerCode}/${appNo}`)
    }
  getCisApplication(cisId) {
    return this.http.get<typeof payload>(
      `${environment.apiUrl}/api/v1/lms/getCISApplicationByAppNo/${cisId}`,
    );
  }

  getConsentCisApplication(token){
    return  this.http.get<typeof payload>(
      `${environment.apiUrl}/api/v1/policy/getCisConsentApplication/${token}`, {
        observe: 'response',
      })
      .pipe(map((apiuser) => {
        console.log(apiuser)
          const authHeader = apiuser.headers.get('Authorization');
          if (authHeader?.indexOf('Bearer ') > -1) {
            this.token = authHeader.substring(7, authHeader.length);
          } else {
            // throwError('Invalid user or password');
          }

          this.tokenService.token = this.token;
          console.log('auth headers', authHeader);
          return apiuser.body;
        }),
      );
  }
  checkCustomerKYC(body){
    return this.http.post(`${environment.apiUrl}/api/v1/customer/checkCustomerKyc`, body);
  }
  submitApplication(body) {
    return this.http.post(`${environment.apiUrl}/api/v1/lms/submitCISApplication`, body);
  }
  submitCisConsent(body,token) {
    return this.http.post(`${environment.apiUrl}/api/v1/lms/submitCisConsent/${token}`, body);
  }
  submitCisApplication(leadId,body) {
    return this.http.post(`${environment.apiUrl}/api/v1/lms/submitBreakInApp/${leadId}`, body);
  }

  updateApplication(body) {
    return this.http.post(`${environment.apiUrl}/api/v1/lms/updateCISApplication`, body);
  }

  sendOtp(otpPayload) {
    return this.http.post(`${environment.apiUrl}/api/v1/policy/sendOtp`, otpPayload);
  }

  validateOtp(otpPayload) {
    return this.http.post(`${environment.apiUrl}/api/v1/lms/validateOtp`, otpPayload);
  }

  sendLeadDataToInsurer(appNo) {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/sendLeadDataToInsurer/${appNo}`);
  }

  checkProposalResponse(appNo) {
    let clock = 0;
    const timerCountInterval = setInterval(() => {
      clock += 3000;
    }, 3000);
    this.IntervalTimer = interval(3000).subscribe(() => {
        this.http
          .get(`${environment.apiUrl}/api/v1/lms/checkProposalResponse/${appNo}`)
          .subscribe(
            (res) => {
               if (res.hasOwnProperty('statusCode') && res['statusCode']  === 1) {
                console.log('inside status 1',res)
                clearInterval(timerCountInterval);
                this.IntervalTimer.unsubscribe();
                this.successResponse.next(res);
              } else if(res.hasOwnProperty('statusCode') && res['statusCode']  === 0){
                console.log('inside status 0',res)
                clearInterval(timerCountInterval);
                this.IntervalTimer.unsubscribe();
                this.successResponse.next(res);
              }
              if (clock >= 40000) {
                console.log('inside clock')
                

                clearInterval(timerCountInterval);
                this.IntervalTimer.unsubscribe();
                this.successResponse.next({
                  status: 'failure',
                  message: 'Request timed out. Please try after sometime.',
                });
              }
            },
            (error) => {
              clearInterval(timerCountInterval);
              this.IntervalTimer.unsubscribe();
              this.successResponse.next({ status: 'failure', message: error?.error?.message });
            },
          );
    });
    return this.successResponse.asObservable();
  }

  getDropdownAndFormatToStandards(url) {
    return this.http.get(`${environment.apiUrl}/${url}`);
  }

  getMetadata(body) {
    return this.http.post(`${environment.apiUrl}/api/v1/master/cisProposalData`, body);
  }
  getConsentMetadata(body) {
    return this.http.post(`${environment.apiUrl}/api/v1/master/cisConsentProposalData`, body);
  }

  resendConsent(leadId){
    return this.http.get(`${environment.apiUrl}/api/v1/policy/resendConsent/${leadId}`)
  }

  getPremiumFromProposalNumber(lob,insuranceId,val) {
    return this.http.get(`${environment.apiUrl}api/v1/policy/getInsurerDataByProposal/${lob}/${insuranceId}/${val}`)
  }

   getValidatorsArray(formData): any[] {
    const validatorsArray = [];
    Object.keys(formData.validators).forEach((validatorKey) => {
      if (validatorKey === 'required') {
        validatorsArray.push(Validators.required);
      } else if (validatorKey === 'minLength') {
        validatorsArray.push(Validators.minLength(formData.validators.minLength));
      } else if (validatorKey === 'maxLength') {
        validatorsArray.push(Validators.maxLength(formData.validators.maxLength));
      } else if (validatorKey === 'min') {
        validatorsArray.push(Validators.min(formData.validators.min));
      } else if (validatorKey === 'max') {
        validatorsArray.push(Validators.max(formData.validators.max));
      } else if (validatorKey === 'email' && formData.validators[validatorKey]) {
        validatorsArray.push(Validators.email);
      } else if (validatorKey === 'pattern') {
        validatorsArray.push(Validators.pattern(formData.validators.pattern));
      } else if (validatorKey === 'maxValue') {
        validatorsArray.push(maxvalueVal(formData.validators[validatorKey]));
      }
    });
    return validatorsArray;
  }
}
