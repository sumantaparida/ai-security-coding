import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  checksum;

  token;

  constructor(private http: HttpClient) { }

  getAvailableProducts() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getAvailableProducts`);
  }

  getMISReport(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/report/getMISReport`, data);
  }

  getCommissionMISReport(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/report/getCommissionMISReport`, data);
  }

  getOptOutMISReport(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/report/getOptOutReport`, data);
  }

  getZoneList() {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getMasterCode/Region/KB`);
  }

  fetchMisRiskReport(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/report/getRiskProfileReport`, data);
  }

  getMaster(masterCode) {
    return this.http.get(`${environment.apiUrl}/api/v1/master/getMasters/${masterCode}`);
  }

  getBranchList(regionalsId) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getMasterBranchForZone/${regionalsId}`,
    );
  }

  getMasterName(masterName, branchCodes) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/master/getMastersForBranch/${masterName}/${branchCodes}`,
    );
  }

  downloadUamReport(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/report/getDCBEmployeeReport`, data, {
      responseType: 'text',
    });
  }

  getMisReports(user) {
    return this.http.post(`${environment.apiUrl}/api/v1/report/getReports`, user);
  }
}
