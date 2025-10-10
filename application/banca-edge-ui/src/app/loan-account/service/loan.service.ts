import { Injectable } from '@angular/core';
import { Observable, of, partition } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { AccountService } from '@app/_services/account.service';
import { TokenService } from '../../_services';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  constructor(private http: HttpClient) {}

  submitLoanDetails(loanDetails) {
    const headers = new HttpHeaders();
    return this.http.post(`${environment.apiUrl}/api/v1/attachment/getLoanDetails`, loanDetails);
  }

  submitBomLoanDetails(loanDetails) {
    const headers = new HttpHeaders();
    return this.http.post(`${environment.apiUrl}/api/v1/attachment/getLoanDetailsFromBank`, loanDetails);
  }

  addLoanDetails(addLoan) {
    return this.http.post(`${environment.apiUrl}/api/v1/attachment/addLoanDetails`, addLoan);
  }

  updateLoanDetails(updateLoan) {
    return this.http.post(`${environment.apiUrl}/api/v1/attachment/updateLoanDetails`, updateLoan);
  }

  getFromMaster(productId, masterName) {
    return this.http.get(`api/v1/master/getMasterCodes/${masterName}/${productId}`);
  }

  getFromMasterMoratorium(productId) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getMasterCodes/MoratoriumPeriod/${productId}`,
    );
  }

  getInputType(inputType, loanAccountNumber) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/attachment/addLoanDetails/${inputType}/${loanAccountNumber}`,
    );
  }

  getAllowedBranches() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getAllowedBranches`);
  }

  createLead(leads) {
    return this.http.post(`${environment.apiUrl}/api/v1/attachment/createLead`, leads);
  }

  editLoan(editLoan) {
    return this.http.post(`${environment.apiUrl}/api/v1/attachment/updateLoanDetails`, editLoan);
  }

  getCustomerfromBank(customerInfo) {
    return this.http.post(
      `${environment.apiUrl}/api/v1/customer/getCustomerfromBank`,
      customerInfo,
    );
  }
}
