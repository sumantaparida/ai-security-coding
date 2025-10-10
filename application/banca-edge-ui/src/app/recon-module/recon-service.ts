import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable()
export class ReconService {
  constructor(private http: HttpClient) {}

  getReconList(payload) {
    return this.http.post(`${environment.apiUrl}/api/v1/report/getBulkUploadReport`, payload);
  }
  getTemplate(org, details) {
    return this.http.get(`${environment.apiUrl}/api/v1/files/downloadTemplate/${org}/${details}`);
  }
  uploadDocument(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/files/fileUpload`, data);
  }
}
