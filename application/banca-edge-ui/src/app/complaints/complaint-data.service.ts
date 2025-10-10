import { Injectable } from '@angular/core';
import { ComplaintModel } from './model/complaint-info.model';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable()
export class ComplaintDataService {
  complaintInfo = new ComplaintModel();

  policyDetails = {};

  onStateChange: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  onSetPolicyDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  customerArr: ComplaintModel[] = [
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

  constructor(private http: HttpClient) {}

  setComplaintInfo(key: string, value) {
    this.complaintInfo[key] = value;
    console.log('this.complaintInfo', this.complaintInfo);
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
      this.complaintInfo.customerMailId &&
      this.complaintInfo.complaintAgainst &&
      this.complaintInfo.complaintMode &&
      this.complaintInfo.complaintNature &&
      this.complaintInfo.uploadDocuments
    ) {
      return true;
    } else {
      return false;
    }
  }

  getPolicyDetails(policyNumber) {
    // const user = sessionStorage.getItem('currentUser');
    // JSON.stringify(user);
    // console.log('uuusseerr test', user);
    return this.http.get(
      `${environment.apiUrl}/api/v1/policy/getApplicationbyApplicationNo/${policyNumber}`,
    );
  }

  getApplicationDetails(applicationNumber) {
    const user = sessionStorage.getItem('currentUser');
    JSON.stringify(user);
    // console.log('uuusseerr kavita', user);
    return this.http.get(
      `${environment.apiUrl}/api/v1/policy/getApplicationbyApplicationNo/${applicationNumber}`,
    );
  }

  addComplaint(data, applicationNo) {
    return this.http.post(
      `${environment.apiUrl}/api/v1/service/addComplaint/${applicationNo}`,
      data,
    );
  }

  getComplaintsById(complaints) {
    return this.http.get(`${environment.apiUrl}/api/v1/service/getComplaints/${complaints}`);
  }

  getAllComplaints() {
    return this.http.get(`${environment.apiUrl}/api/v1/service/getAllComplaints`);

    // return this.http.get(env.apiUrl + 'customer/getAllComplaints/');
  }

  resolveComplaints(data, id) {
    console.log(data, id);
    return this.http.post(`${environment.apiUrl}/api/v1/service/resolveComplaint/${id}`, data);
  }
}
