import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/_services';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-footer-nav',
  templateUrl: './footer-nav.component.html',
  styleUrls: ['./footer-nav.component.css'],
})
export class FooterNavComponent implements OnInit {
  firstName;

  lastName;

  org;

  user;

  appVersion = environment.version;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.user.subscribe((user) => {
      this.user = user;
      if (user) {
        this.org = user['organizationCode'];
        console.log('this.org is', this.org);
      }
    });
    // this.firstName = this.user['firstName']
    // this.lastName = this.user['lastName'];
    // console.log('printing names', this.user, this.lastName);
  }

  openCsbPrivatePolicy() {
    window.open(
      'https://s3.amazonaws.com/lastdecimal.brokeredge.data/csb/Annexure+I+-+CSBPrivacypolicy.pdf',
      '_blank',
    );
  }
}
