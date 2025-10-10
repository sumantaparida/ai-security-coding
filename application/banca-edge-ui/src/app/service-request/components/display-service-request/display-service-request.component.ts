import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-display-service-request',
  templateUrl: './display-service-request.component.html',
  styleUrls: ['./display-service-request.component.css']
})
export class DisplayServiceRequestComponent implements OnInit {

  panelOpenState = false;
  showDropdown = false;
  value = 'Clear me';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onCreateNewComplaint() {
    this.router.navigate(['/register-service-request']);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  openDialog($event) {
   // console.log('the event', event);
  }
}
