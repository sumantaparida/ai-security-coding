import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
// import { TokenService } from '@app/_services/token.service';

@Injectable()
export class UserDcbService {
  constructor(private http: HttpClient) {}

  fetchEmployeeByHrms(hrmsNo) {
    return this.http.post(`${environment.apiUrl}/api/v1/policy/getDCBEmployees`, { hrmsNo });
  }

  updateCertificate(payload) {
    return this.http.post(`${environment.apiUrl}/api/v1/policy/certificateUpdation`, payload);
  }

  updateRoleAndBranch(payload) {
    return this.http.post(`${environment.apiUrl}/api/v1/policy/roleAndBranchUpdation`, payload);
  }

  fetchNewJionee(payload) {
    return this.http.post(`${environment.apiUrl}/api/v1/policy/getDCBNewJoinee`, { payload });
  }

  getAllDcbEmployees() {
    return this.http.get(`${environment.apiUrl}/api/v1/policy/getDCBEmployeesList`);
  }

  getAllDcbEmployeesPagination(payload) {
    return this.http.post(`${environment.apiUrl}/api/v1/policy/getDCBEmployeesList`, payload );
  }

  getMasterDcbBranches() {
    return this.http.post(`${environment.apiUrl}/api/v1/policy/branchMasterforDCB`, {});
  }

  runScheduler(payload){
    return this.http.post(
      `${environment.apiUrl}/api/v1/policy/getDCBUAMNewJoineeResignee`,
      payload,
    );
  }
}
