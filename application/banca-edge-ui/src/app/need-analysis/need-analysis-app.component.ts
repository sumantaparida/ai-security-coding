import { Component, OnInit } from '@angular/core';
import { Route, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './need-analysis-app.component.html',
  styleUrls: ['./need-analysis-app.component.css']
})
export class NeedAnalysisAppComponent implements OnInit {
  title = 'app';
  sideNavDisplay = ['/home', '/summary'];
  showSideNav = false;

  constructor(private router: Router) {

  }
  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (this.sideNavDisplay.findIndex(url => event.url === url) > -1) {
        this.showSideNav = true;
      } else {
        this.showSideNav = false;
      }
    });


  }
}
