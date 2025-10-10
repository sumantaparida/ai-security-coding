import { Injectable } from '@angular/core';
import { Observable, of, partition } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { AccountService } from '@app/_services/account.service';
import { TokenService } from '../../_services';
import { Subscription, interval, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecommendService {
  public fetchQuoteSuccess: Subscription;

  productQuoteArray = [];

  private successResponse: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient) {}

  recommendInsuranceDetails(recommendInsurance) {
    const headers = new HttpHeaders();
    return this.http.post(
      `${environment.apiUrl}/api/v1/attachment/recommendInsurance`,
      recommendInsurance,
    );
  }

  recommended(recommend) {
    const headers = new HttpHeaders();
    return this.http.post(`${environment.apiUrl}/api/v1/attachment/recommended`, recommend);
  }

  getQuoteById(quoteId) {
    return this.http.get(`${environment.apiUrl}/api/v1/quote/getQuote/${quoteId}`);
  }

  createApplication(productId, reqbody) {
    return this.http.post(
      `${environment.apiUrl}api/v1/policy/createApplication/${productId}`,
      reqbody,
    );
  }

  getHealthQuote(quoteId) {
    let clock = 0;
    const timerCountInterval = setInterval(() => {
      clock += 5000;
    }, 5000);

    this.fetchQuoteSuccess = interval(5000).subscribe((x) => {
      this.http.get(`${environment.apiUrl}/api/v1/quote/getQuote/${quoteId}`).subscribe(
        (res) => {
          if (res['productQuote'].length === res['numQuotesExpected']) {
            // console.log('inside equla');
            clearInterval(timerCountInterval);
            this.successResponse.next(res);
            this.fetchQuoteSuccess.unsubscribe();
          } else if (
            res['numQuotesExpected'] !== res['productQuote'].length &&
            this.productQuoteArray.length < res['productQuote'].length
          ) {
            console.log('inside if condition', this.productQuoteArray);
            this.successResponse.next(res);
          }
          if (clock >= 60000) {
            clearInterval(timerCountInterval);
            this.successResponse.next(res);
            this.fetchQuoteSuccess.unsubscribe();
          }

          this.productQuoteArray = res['productQuote'];
          console.log('assigning atlast', this.productQuoteArray);
        },
        (error) => {
          clearInterval(timerCountInterval);
          this.successResponse.next({ status: 'failure', message: error.error.message });
          this.fetchQuoteSuccess.unsubscribe();
        },
      );
    });

    return this.successResponse.asObservable();
    // return this.http.get(`${environment.apiUrl}/api/v1/quote/getQuote/${quoteId}`);
    // return this.http.get(`http://localhost:3080/`);
  }
}
