import { Injectable } from '@angular/core';
import  {Observable,of,  partition} from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Customer, PostalCode } from '@interface/Customer';
import { IndividualCustomer } from '@interface/Customer';
import { BusinessCustomer } from '@interface/Customer';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { environment } from '@environments/environment';
import { AccountService } from '@app/_services/account.service';
import { TokenService } from '.';

@Injectable({
  providedIn: 'root'
})
export class MyRenewalsService {
  checksum;
  token;

  constructor(private http: HttpClient, private tokenService: TokenService) {   
  }
  public get(): Observable<Customer[]>{
    this.token = this.tokenService.token;
    
    const headers = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Authorization","Basic " +this.token);

    return this.http.get<Customer[]>(`${environment.apiUrl}/api/v1/customer/getAllCustomers`, { 'headers': headers })
      .pipe(map(response => response));
	
  }
 
  

  public getPinData(val:string): Observable<PostalCode> {
    this.token = this.tokenService.token;

    const headers = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Authorization", "Basic " + this.token);

    return this.http.get<PostalCode>(`${environment.apiUrl}/api/v1/master/getPinData/${val}`, { 'headers': headers })
      .pipe(map(response => response));
  } 

  // public getRenewalsForCustomer() {
  //   return this.http.get(`${environment.apiUrl}/api/v1/policy/getRenewalsForUser`);
  // }

  // public getRenewalsForCustomer() {
  //   return this.http.get(`${environment.apiUrl}/api/v1/policy/getRenewalsForUser`);
  // }


  public getRenewalsForCustomer(reqBody) {
    return this.http.post(
      `${environment.apiUrl}/api/v1/policy/getRenewalLeads`,
      reqBody,
    );
  }

   notifyPayment(leadId){
      return this.http.get(`${environment.apiUrl}/api/v1/policy/sendRenewalNotification/${leadId}`,)
  }
}