import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { environment as env } from '../../environments/environment';
import { environment } from '@environments/environment';


@Injectable()

export class SpApprovalService {

    constructor(private http: HttpClient) { }

    public getPolicyApplicationForUser() {
        return this.http.get(`${environment.apiUrl}/api/v1/policy/getPendingSPApprovals`);
    }
    public approveOrRejectPolicy(appNo, action) {
        return this.http.get(`${environment.apiUrl}/api/v1/policy/updateSPAction/${appNo}/${action}`);
    }
}
