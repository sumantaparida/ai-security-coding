import { Component, OnInit, Inject } from '@angular/core';


@Component({
  selector: 'app-protection',
  templateUrl: './protection.component.html',
  styleUrls: ['./protection.component.css']
})
export class ProtectionComponent implements OnInit {

  


  constructor() { }

  ngOnInit(): void {
    
  }


  // onSaveStatus() {
  //   this.isCloseComplaint = true;
  //   if (this.complaintForm.valid) {
  //     this.dialogRef.close(this.complaintForm.get('resolutionComplaint').value);
  //   } else {
  //     alert('Please enter the Complaint Resolution');
  //   }
  // }

}
