import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';

import { AccountService, TokenService } from './_services';
// import { BlockerService } from './_services';
import { User } from './_models';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from './_services/loader.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnChanges {
  title = 'BancaEdge';

  hasToken = false;

  isLoading = false;

  user: User;

  organizationCode;

  timerInterval;

  timePassed;

  timeLeft;

  timeLimit;

  showTime;

  startCountDown;

  callInterval = false;

  countdown = 120;

  min = 2;

  sec = '00';

  dcbLogin = false;

  constructor(
    private accountService: AccountService,
    private tokenService: TokenService,
    private translateService: TranslateService,
    public loaderService: LoaderService,
    public changeDetect: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private router: Router,
    private location: Location,
  ) {
    this.accountService.user.subscribe((x) => (this.user = x));
    console.log('user in app component', this.user);
    translateService.setDefaultLang('en');
    console.log(this.router.url, location.path());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.location.path() === '/dcb') {
      this.dcbLogin = true;
    } else {
      this.dcbLogin = false;
    }
  }

  ngOnInit() {
    console.log(this.router.url);
    this.organizationCode = this.user?.organizationCode;
    // console.log(this.organizationCode);
    if (this.location.path() === '/dcb') {
      this.dcbLogin = true;
    } else {
      this.dcbLogin = false;
    }
    console.log('iiii', this.dcbLogin);
    this.loaderService.loadingSpinner.subscribe((val) => {
      if (val) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
      // this.changeDetect.detectChanges();
    });
    this.tokenService.isTokenSubject.subscribe((token) => {
      if (!token) {
        this.hasToken = false;
      } else {
        this.hasToken = true;
      }
      console.log('has token', this.hasToken);
    });

    this.accountService.secondsLeft.subscribe((seconds) => {
      // console.log('time left', seconds);
      this.timeLeft = seconds;
      // console.log('  this.callInterval = ', seconds);
      // this.timeLeft = seconds * 60;
      if (seconds <= 120 && !this.callInterval && this.accountService.isUserLoggedIn) {
        this.callInterval = true;
        this.startCountDown = true;

        // console.log('time left inisnde if 570', this.timeLeft);
        this.startTimer();
      } else if (this.callInterval) {
        if (seconds >= 500) {
          clearInterval(this.timerInterval);
          this.startCountDown = false;
          this.callInterval = false;
          this.countdown = 120;
        }
      }
    });
  }

  isBrowserIE() {
    // console.log('inisde IE')
    return window.document['documentMode'];
  }

  get isUser() {
    return this.accountService.isUser;
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.countdown = --this.countdown <= 0 ? 0 : this.countdown;
      this.min = Math.floor(this.countdown / 60);
      let seconds = this.countdown - this.min * 60;
      this.sec = seconds.toString().length < 2 ? '0' + seconds.toString() : seconds.toString();
      // console.log('inisnde interval', this.timeLeft);
      if (this.countdown <= 0) {
        // console.log('inisnde time left if time up', this.timeLeft);
        this.startCountDown = false;
        this.onTimesUp();
      } else if (this.timeLeft >= 500) {
        clearInterval(this.timerInterval);
        // console.log('count down value =', this.countdown);
      }
    }, 1000);
  }

  onTimesUp() {
    clearInterval(this.timerInterval);
    // this.accountService.secondsLeft.unsubscribe();
    this.accountService.logout().subscribe();
  }

  // ngOnDestroy() {
  //   if (this.organizationCode === 'DCB') {
  //     this.accountService.logoutDcb();
  //   } else {
  //     this.accountService.logout();
  //   }
  //   // your logic to clean up session
  // }

  formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    // if (seconds < 10) {
    //   second = `0${seconds}`;
    // }
    this.showTime = `${minutes}:${seconds}`;
    return `${minutes}:${seconds}`;
  }

  // @HostListener('window:beforeunload', ['$event'])
  // windowBeforeUnload(event: BeforeUnloadEvent) {
  //   console.log('reload',event);
  //   console.log('new one', window.performance.navigation);
  //   console.log('got it', window.performance.getEntriesByType("navigation")[0].type);

  //   event.returnValue = 'any value here';
  // }

  // @HostListener('window:unload')
  // windowOnUnload() {
  //   //User pressed Reload/Leave.

  //   if (window.performance.getEntriesByType("navigation")){
  //     console.log('got it', window.performance.getEntriesByType("navigation")[0]['type']);
  //   }

  //   // if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
  //   //   console.info( "This page is reloaded" );
  //   // } else {
  //   //   console.info( "This page is not reloaded");
  //   // }
  //   this.accountService.cleanup();
  // }
}
