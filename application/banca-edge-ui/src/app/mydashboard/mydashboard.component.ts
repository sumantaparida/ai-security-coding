import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-mydashboard',
  templateUrl: './mydashboard.component.html',
  styleUrls: ['./mydashboard.component.css'],
})
export class MydashboardComponent implements OnInit {
  url =
    'https://datastudio.google.com/embed/reporting/8ca4fb2e-6b4d-48c6-8424-4c74f6ee5b9b/page/y6ZZB';

  urlSafe: SafeResourceUrl;

  user;
  orgCode;

  constructor(private sanitizer: DomSanitizer, private accountService: AccountService) {}

  ngOnInit(): void {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);

    this.accountService.user.subscribe((user) => {
      this.orgCode = user['organizationCode'];
    });
  }
}
