import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '@environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  isTokenSubject = new BehaviorSubject<boolean>(this.hasToken());
  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  get token(): boolean {
    return this.isTokenSubject.value;
  }

  set token(token: boolean) {
    // this.cookieService.set('token', token);
    // localStorage.setItem('token', token);
    this.isTokenSubject.next(token);
    // console.log('i nedd token value for postman', token);
  }
  public hasToken(): boolean {
    // return localStorage.getItem('token');
    // console.log('trying to access cookie in token service', this.cookieService.get('token'));
    return true;
    // return this.cookieService.get('token');
  }
  public removeToken() {
    // this.cookieService.deleteAll();
    console.log('inside remove token');
    // localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    // localStorage.removeItem('token');
    this.isTokenSubject.next(null);
  }

  validateBankToken() {
    // const tokenVal = localStorage.getItem('token');
    // const tokenVal = this.cookieService.get('token');
    const headers = new HttpHeaders()

      .set('Authorization', 'Bearer kkkskss');
    return this.http.get(`${environment.apiUrl}/api/user/validateBankToken`, { 'headers': headers });
  }
}
