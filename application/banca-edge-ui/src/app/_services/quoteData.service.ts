import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { TokenService } from '@app/_services/token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class QuoteDataService {
    quoteData;

    constructor(private http: HttpClient, private tokenService: TokenService) { }
    setData(data) {
        this.quoteData = data;
    }
    getData() {
        return this.quoteData;
    }
    createHealthApplication(productId, createApplicationData) {
        // console.log('ninside service');
        return this.http.post(`${environment.apiUrl}/api/v1/policy/createApplication/${productId}`, createApplicationData);
    }
    createLifeApplication(productId, createApplicationData) {
        // console.log('protection service');
        return this.http.post(`${environment.apiUrl}/api/v1/policy/createApplication/${productId}`, createApplicationData);
    }
}
