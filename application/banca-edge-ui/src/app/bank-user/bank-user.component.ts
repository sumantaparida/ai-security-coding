import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, TokenService } from '@app/_services';


@Component({
  selector: 'app-bank-user',
  templateUrl: './bank-user.component.html',
  styleUrls: ['./bank-user.component.css']
})
export class BankUserComponent implements OnInit {

  token;
  data;

  constructor(
    private route: ActivatedRoute, private router: Router, private tokenService: TokenService, private accService: AccountService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params.token) {
        this.token = params.token;
        // this.data = params.query;
        // localStorage.setItem('user', this.data);
        this.tokenService.token = this.token;
        this.tokenService.isTokenSubject.next(this.token);
        this.router.navigate(['/quickquote']);
      }

      else {
        this.token = null;
      }
    });
    this.route.queryParams.subscribe(params => {
      this.data = params;
      this.accService.setUser(params);
    });
  }

}
