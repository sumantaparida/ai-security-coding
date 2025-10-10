import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class UploadDocumentService {
  constructor(private http: HttpClient) { }

  uploadFile(data) {
    console.log('got the payload', data);

    return this.http.post(`${environment.apiUrl}/api/v1/common/uploaddoc`, data);
  }

  getDocumentMasterList(org) {
    return this.http.get(`${environment.apiUrl}/api/v1/storage/getDocumentMasterListForOrg/${org}`);
  }

  // uploadDocument(data) {
  //   return this.http.post(`${environment.apiUrl}/api/v1/storage/processBulkUpload`, data);
  // }

  uploadDocument(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/files/fileUpload`, data);
  }

  getSignedUrl(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/storage/downloadReport`, data);
  }

  getTransactionFiles(data) {
    return this.http.post(`${environment.apiUrl}/api/v1/storage/getTransactionFiles`, data);
  }

  // getLobMasterList(insurerId) {
  //   return this.http.get(
  //     `${environment.apiUrl}/api/v1/master/getOfflinePlansForInsurer/${insurerId}`,
  //   );
  // }

  getLobMasterList(masterName, productId) {
    return this.http.get(
      `${environment.apiUrl}api/v1/master/getMasterCodes/${masterName}/${productId}`,
    );
  }

  getBulkTemplate(lob) {
    return this.http.get(`${environment.apiUrl}/api/v1/common/downloadBulkUploadTemplate/${lob}`, {
      responseType: 'text',
    });
  }

  getTemplate(org, details) {
    return this.http.get(`${environment.apiUrl}/api/v1/files/downloadTemplate/${org}/${details}`);
  }

  getErrorReport(id) {
    return this.http.get(
      `${environment.apiUrl}/api/v1/common/downloadBulkUploadErrorReport/${id}`,
      { responseType: 'text' },
    );
  }
}
