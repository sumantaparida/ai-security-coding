import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-retake-one-min-plan',
  templateUrl: './retake-one-min-plan.component.html',
  styleUrls: ['./retake-one-min-plan.component.css'],
})
export class RetakeOneMinPlanComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<RetakeOneMinPlanComponent>,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  routeToNeedAnalysis(){
    this.dialogRef.close();
    this.router.navigate(['/needanalysis/home', this.data?.customerId]);
  }
}
