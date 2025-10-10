import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';

import { AccountService, AlertService, TokenService } from '@app/_services';
import { Router } from '@angular/router';

@Injectable()
export class SuccessInterceptor implements HttpInterceptor {
  constructor(
    private accountService: AccountService,
    private alertService: AlertService,
    private tokenService: TokenService,
    private router: Router,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // console.log('event =>', event.headers.get('expiresat'));
          if (event.headers.get('expiresat')) {
            // console.log('insidne if success');
            this.accountService.setExpiryTime(event.headers.get('expiresat'));
          }
        }
        return event;
      }),
    );
  }
}
