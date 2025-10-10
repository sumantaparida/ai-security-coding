import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Subject, Subscription, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DynamicQuoteService {

  productQuoteArray = [];

  public fetchQuoteSuccess: Subscription;

  private successResponse: Subject<any> = new Subject<any>();
  
  constructor(private http: HttpClient) { }

  getMetaData(lob){
    return this.http.get(`${environment.apiUrl}/api/v1/quote/getMetaData/${lob}`);
  }

  getMasters(url){
    return this.http.get(`${environment.apiUrl}${url}`);
  }

  getFecthDetails(url,payload){
    return this.http.post(`${environment.apiUrl}${url}`,payload);
  }

  submitQuote(payload,url){
    return this.http.post(`${environment.apiUrl}${url}`,payload);
  }

  getBackQuote(quoteId){
   return this.http.get(`${environment.apiUrl}/api/v1/quote/getQuote/${quoteId}`)
  }

  getCustomerById(customerId) {
    return this.http.get(`${environment.apiUrl}/api/v1/customer/getCustomerById/${customerId}`);
  }

  createApplication(productId, url,createApplicationData) {
    console.log('ninside service',url,productId);
    return this.http.post( `${environment.apiUrl}${url}${productId}`,createApplicationData,);
  }

  getQuote(quoteId) {
    this.productQuoteArray = [];
    let clock = 0;
    const timerCountInterval = setInterval(() => {
      clock += 5000;
    }, 5000);

    this.fetchQuoteSuccess = interval(5000).subscribe((x) => {
      this.http.get(`${environment.apiUrl}/api/v1/quote/getQuote/${quoteId}`).subscribe(
        (res) => {
          // console.log('printing result', res, clock, this.productQuoteArray.length);
          console.log(
            'result value s checking',
            this.productQuoteArray.length,
            res['productQuote'].length,
          );
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
          // console.log('assigning atlast', this.productQuoteArray);
        },
        (error) => {
          console.log('ininsde errror unscribe', error);

          clearInterval(timerCountInterval);
          this.successResponse.next({ status: 'failure', message: 'Time out' });
          this.fetchQuoteSuccess.unsubscribe();
        },
      );
    });

    return this.successResponse.asObservable();
    // return this.http.get(`${environment.apiUrl}/api/v1/quote/getQuote/${quoteId}`);
    // return this.http.get(`http://localhost:3080/`);
  }
}
