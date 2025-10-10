import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dcb-adfs',
  templateUrl: './dcb-adfs.component.html',
  styleUrls: ['./dcb-adfs.component.css'],
})
export class DcbAdfsComponent implements OnInit {
  error = false;

  errorMessage = 'User is Inactive';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((query) => {
      if (query.error === 'y') {
        this.error = true;
      }
    });
  }

  adfsLogin() {
    if (window.location.host === 'insurance.dcbbank.com') {
      window.open('https://insurance.dcbbank.com/dcb/adfs/login', '_self');
    } else {
      window.open('https://uat.bancaedge.com/dcb/adfs/login', '_self');
    }
    // DCB-Prod
    // this.router.navigate(['mycustomers']);
  }

  login() {
    // window.open('https://uat.bancaedge.com/account/login', '_self');
    this.router.navigate(['/dcb']);
  }
}
