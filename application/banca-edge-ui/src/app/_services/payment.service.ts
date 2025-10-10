import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaymentService {

    constructor(private http: HttpClient) { }

    sendConfirmationRequest(insurerId, responseData) {
        return this.http.get(`/api/postpayment/${insurerId}?${responseData}`);
    }
}
