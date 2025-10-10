import { Injectable } from '@angular/core';
import { ServiceRequestModel } from '../model/service-request-info.model';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { environment as env } from '../../environments/environment';
import { environment } from '@environments/environment';

import { User } from '../model/user.model';

@Injectable()
export class ServiceRequestDataService {
  complaintInfo = new ServiceRequestModel();

  policyDetails = {};

  onStateChange: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  onSetPolicyDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  customerArr: ServiceRequestModel[] = [
    {
      complaintAgainst: 'Corporate Agent',
      complaintMode: 'Oral',
      complaintNature: 'Others',
      customerMailId: 'var@gmail.com',
      detailsCorrection: 'no',
      policyNumber: '1ga12cs',
      status: 'Open',
      uploadDocuments: 'no',
      openDate: new Date(),
    },
  ];

  constructor(private httpClient: HttpClient, private http: HttpClient) {}

  setComplaintInfo(key: string, value) {
    this.complaintInfo[key] = value;
    // console.log('this.complaintInfo', this.complaintInfo);
  }

  addComplaintDetails() {
    this.customerArr.unshift(JSON.parse(JSON.stringify(this.complaintInfo)));
  }

  getComplaintInfo() {
    return this.customerArr;
  }

  isComplaintDataValid() {
    if (
      this.complaintInfo &&
      this.complaintInfo.policyNumber &&
      this.complaintInfo.detailsCorrection &&
      this.complaintInfo.complaintAgainst
    ) {
      return true;
    } else {
      return false;
    }
  }

  getPolicyDetails(policyNumber) {
    const user = sessionStorage.getItem('currentUser');
    JSON.stringify(user);
    // console.log('uuusseerr', user);
    const token = window.btoa(user + ':' + user);
    const data = {
      policyNo: policyNumber,
    };
    return this.http.post(`${environment.apiUrl}/api/v1/policy/getPolicyDetails`, data);

    // return this.httpClient.get(env.apiUrl + 'policy/getPolicy/' + policyNumber);
  }

  getServiceNatureRequest(policyNumber) {
    const user = sessionStorage.getItem('currentUser');
    JSON.stringify(user);
    // console.log('uuusseerr', user);
    const token = window.btoa(user + ':' + user);
    // return this.http.post(`${environment.apiUrl}/api/v1/service/getServiceRequestListForPolicy`);
    const data = {
      policyNo: policyNumber,
    };
    return this.http.post(
      `${environment.apiUrl}/api/v1/service/getServiceRequestListForPolicy`,
      data,
    );

    // return this.httpClient.get(env.apiUrl + 'policy/getServiceRequestListForPolicy/' + policyNumber);
  }

  addRequest(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/service/addRequest`, data);

    // return this.httpClient.post(env.apiUrl + 'policy/addRequest/' + data.policyNo, data);
  }

  updateRequest(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/service/addRequest`, data);
  }

  addComplaint(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/service/addRequest`, data);

    // return this.httpClient.post(env.apiUrl + 'policy/addRequest/' + data.policyNo, data);
  }

  getComplaintsById(complaints) {
    return this.http.get(`${environment.apiUrl}/api/v1/service/getComplaints/${complaints}`);

    // return this.httpClient.get(env.apiUrl + 'customer/getComplaints/' + complaints);
  }

  getAllComplaints() {
    return this.http.get(`${environment.apiUrl}/api/v1/service/getAllRequests`);
    // return this.httpClient.get(env.apiUrl + 'policy/getAllRequests');
  }

  resolveComplaints(data, id) {
    // console.log(data, id);
    return this.http.post(`${environment.apiUrl}/api/v1/service/resolveRequest/${id}`, data);

    // return this.httpClient.post(env.apiUrl + 'policy/resolveRequest/' + id, data);
  }
}
