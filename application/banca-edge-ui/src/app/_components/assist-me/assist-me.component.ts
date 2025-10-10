import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AccountService, AlertService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import { MustMatch } from '@app/_helpers/must-match.validator';
import { User } from '@app/_models';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { MatDialog } from '@angular/material/dialog';

declare var window: any;
@Component({
  selector: 'app-assist-me',
  templateUrl: './assist-me.component.html',
  styleUrls: ['./assist-me.component.css']
})
export class AssistMeComponent implements OnInit {
  user: User;
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  callAssist = false;
  emailAssist = false;
  assistBox = false;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private loaderService: LoaderService
  ) {

    this.accountService.user.subscribe(x => this.user = x);
  }

  ngOnInit() {
    // console.log('user data', this.user);
    // console.log('random', Math.floor(Math.random() * (99999999999999)) + 9999999999999)
    this.loadScript();
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      subject: new FormControl(null, Validators.required),
      // file: new FormControl(null),
      message: new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    this.loaderService.showSpinner(true);
    const requestData = {
      trackId: Math.floor(Math.random() * (99999999999999)) + 9999999999999,
      subject: this.form.get('subject').value,
      description: this.form.get('message').value,
      name: this.user['firstName'] + ' ' + this.user['lastName'],
      email: this.form.get('email').value,
      mobileNo: this.user['mobileNo'],
      // "attachment": [
      //   {
      //     "fileName": "<name of the file>",
      //     "fileData": "<base64 data of the file>"
      //   }
      // ]
    };
    // console.log('request data', requestData);
    this.accountService.postEmailAssist(requestData).subscribe((data: any) => {
      this.loaderService.showSpinner(false);
      // console.log('data', data);
      this.displayError(data['responseMessage']);
      this.clearValue();
    }, error => {
      this.loaderService.showSpinner(false);
      const message = 'Error while submitting the form. Please try after sometime.';
      this.displayError(message);
      // console.log('error', error);
      this.clearValue();
    });
  }

  displayError(msg) {
    const dialogRefMessage = this.dialog.open(PolicyErrorModalComponent, {
      data: msg,
      panelClass: 'dialog-width'
    });
  }

  clearValue() {
    this.assistBox = false;
    this.emailAssist = false;
    this.form.get('email').setValue(null);
    this.form.get('subject').setValue(null);
    this.form.get('message').setValue(null);
  }

  checkInput() {
    if (this.form.valid) {
      return false;
    } else {
      return true;
    }
  }

  openAssist(id: number) {
    this.assistBox = true;
    switch (id) {
      case 1:
        this.callAssist = true;
        this.emailAssist = false;
        break;
      case 2:
        this.callAssist = false;
        this.emailAssist = true;
        break;
    }
  }

  closeAssist() {
    this.assistBox = false;
    this.callAssist = false;
    this.emailAssist = false;

  }

  // loading js
  public loadScript() {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    // tslint:disable-next-line: no-angle-bracket-type-assertion
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = './assets/assist_me/js/common.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
    // let body2 = <HTMLDivElement>document.body;
    const script2 = document.createElement('script');
    script2.innerHTML = '';
    script2.src = 'https://wchat.in.freshchat.com/js/widget.js';
    script2.async = true;
    script2.defer = true;
    body.appendChild(script2);

    window.fcSettings = {
      // token: '9eb2c976-d02e-4279-a2c9-9e4e4af7d1bf',
      token: 'fe792679-9119-4cf6-8805-685da0535563',
      host: 'https://wchat.in.freshchat.com',
      siteId: userData.organizationCode,
      config: {
        headerProperty: {
          hideChatButton: true
        }
      },

      onInit() {
        // tslint:disable-next-line: only-arrow-functions
        window.fcWidget.on('widget:loaded', function () {
          // tslint:disable-next-line: only-arrow-functions
          window.fcWidget.on('unreadCount:notify', function (resp) {

          });
          // tslint:disable-next-line: only-arrow-functions
          window.fcWidget.on('widget:closed', function () {
            document.getElementById('fc_frame').style.visibility = 'hidden';
            document.getElementById('open_fc_widget').style.visibility = 'visible';
          });
          // tslint:disable-next-line: only-arrow-functions
          window.fcWidget.on('widget:opened', function (resp) {
            document.getElementById('open_fc_widget').style.visibility = 'hidden';
          });
        });
        window.fcWidget.user.setProperties({
          firstName: userData.firstName, // user’s first name
          lastName: userData.lastName, // user’s last name
          email: userData.email, // user’s email address
          phone: userData.mobileNo, // phone number without country code
          phoneCountryCode: '+91', // phone’s country code
          plan: '', // user's meta property 1
          status: 'Active' // user's meta property 3
        });
      }
    };
  }

  openWidget() {
    this.closeAssist();
    document.getElementById('fc_frame').style.visibility = 'visible';
    window.fcWidget.open();
  }
}
