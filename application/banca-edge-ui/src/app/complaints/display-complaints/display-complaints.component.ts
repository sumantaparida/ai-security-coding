import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-display-complaints',
  templateUrl: './display-complaints.component.html',
  styleUrls: ['./display-complaints.component.css']
})
export class DisplayComplaintsComponent implements OnInit {

  panelOpenState = false;
  showDropdown = false;
  value = 'Clear me';
  
  constructor(private router: Router) { }

  ngOnInit() {
  }

  onCreateNewComplaint() {
    this.router.navigate(['/register-complaint']);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  openDialog($event) {
    console.log('the event', event);
  }
  
}
