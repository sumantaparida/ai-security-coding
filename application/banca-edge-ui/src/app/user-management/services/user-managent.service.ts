import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../_models/user';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  get user() {
    return this.userSubject.asObservable();
  }

  constructor(private http: HttpClient) {
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      this.userSubject.next(JSON.parse(currentUser));
    }
  }

  addUser() {}

  getUsersList(userDetails): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/user/getPaginatedUsersByOrg`, userDetails);
  }

  getPaginatedMaster(userDetails): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/v1/uam/getPaginatedMaster`, userDetails);
  }

  submitMaster(userDetails): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/v1/uam/submitMaster`, userDetails);
  }

  getUserInfoByID(username): Observable<User> {
    return this.http.get<User>(`/api/user/getUserByName/${username}`);
  }

  getAllBranches(): Observable<User> {
    return this.http.get<User>(`/api/v1/master/getAllBranches`);
  }

  updateUser(user: User) {
    return this.http.post<User>('/api/user/updateUser', user);
  }

  registerUser(user: User) {
    return this.http.post<User>('/api/user/registerBankUser', user);
  }

  getDropdownFromMaster(masterName) {
    if (masterName !== 'getAllAuthGroups') {
      {
        return this.http.get(`/api/v1/master/${masterName}`);
      }
    } else {
      return this.http.get(`/api/user/${masterName}`);
    }
  }

  getMasterData(masterType, id) {
    return this.http.get(`/api/v1/uam/getMaster/${masterType}/${id}`);
  }

  getDropdownForAuthGroups(masterName) {
    {
      return this.http.get(`/api/user/${masterName}`);
    }
  }

  getDropdownForMaster(masterName, UAM) {
    {
      return this.http.get(`/api/v1/master/getMasterCodes/${masterName}/${UAM}`);
    }
  }

  getDropdownFromMasterForUam(masterName) {
    {
      return this.http.get(`/api/v1/master/getMasters/${masterName}`);
    }
  }

  getFormData(formData) {
    return this.http.post<User>(`/api/v1/master/proposalFormData`, formData);
  }

  enableDisableUser(formData) {
    return this.http.post<User>(`/api/v1/uam/enableDisableUser`, formData);
  }

  getBulkList(payload) {
    return this.http.post(`${environment.apiUrl}/api/v1/report/getBulkUploadReport`, payload);
  }

  // getCoverMaster(): Observable<User> {
  //     return this.http.get<User>(`/api/v1/master/getMasters/DocumentTemplates`);
  // }

  formStructure = [];

  getFormStructure() {
    return this.formStructure;
  }
}
