import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bank-b2c',
  templateUrl: './bank-b2c.component.html',
  styleUrls: ['./bank-b2c.component.css']
})
export class BankB2cComponent implements OnInit {
  token;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params.token) {
        this.token = params.token;
      }
      else {
        this.token = null;
      }
    });
  }

}
