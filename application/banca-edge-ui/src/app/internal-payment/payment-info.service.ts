import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { TokenService } from '@app/_services/token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, interval, Observable, Subject, Subscription, timer } from 'rxjs';
import { PostalCode } from '@app/interface/Customer';
import { map, retry, share, switchMap, takeUntil } from 'rxjs/operators';


@Injectable()
export class PaymentInfoService {
    token;
    private healthHospPaymentSuccess: Subscription;
    private successResponse: Subject<any> = new Subject<any>();

    constructor(private http: HttpClient, private tokenService: TokenService) { }



    getinsured(appNo) {
        return this.http.get(`${environment.apiUrl}/api/v1/policy/getApplicationbyApplicationNo/${appNo}`);
    }

    saveApplication(data) {
        return this.http.post(`${environment.apiUrl}/api/v1/policy/saveApplication/`, data);
    }

    submitDirectDebitPayment(appNo, data){
        return this.http.post(`${environment.apiUrl}/api/v1/policy/saveDirectDebitPayment/${appNo}`, data);
    }

    submitPaymentInfo(url, data) {
        return this.http.post(`${environment.apiUrl + url}`, data);
    }

    checkProposalResponses(appNo) {
        // const timera = Observable.timer(initialDelay, period);
        let clock = 0;
        const timerCountInterval = setInterval(() => {
            clock += 3000;
        }, 3000);
        this.healthHospPaymentSuccess = interval(3000).subscribe((x => {
            this.http.get(`${environment.apiUrl}/api/v1/policy/checkProposalResponse/${appNo}`).subscribe(res => {
                console.log('api loop response', res);
                if (res.hasOwnProperty('errorDescription') && res['errorDescription'] === 'Premium Mismatch') {
                    this.successResponse.next(res);
                    this.healthHospPaymentSuccess.unsubscribe();
                }
                if (res.hasOwnProperty('TransactionID') && res['TransactionID']) {
                    this.successResponse.next(res);
                    this.healthHospPaymentSuccess.unsubscribe();
                }
                if (res.hasOwnProperty('transactionId') && res['transactionId']) {
                    this.successResponse.next(res);
                    this.healthHospPaymentSuccess.unsubscribe();
                }
                if (clock >= 40000) {
                    clearInterval(timerCountInterval);
                    this.successResponse.next('failure');
                    this.healthHospPaymentSuccess.unsubscribe();
                }
            });
        }));
        return this.successResponse.asObservable();
    }


}
