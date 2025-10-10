import { Component, Input, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.css'],
})
export class ApplicationDetailsComponent implements OnInit {
  expandedElement;

  constructor(public media: MediaObserver) {}

  @Input() element;

  @Input() policyStatus;

  leadData;

  leadKey;

  leadValue;

  ngOnInit(): void {
    this.leadData = this.element?.leadBatch;
    if (this.leadData) {
      this.leadKey = Object.keys(this.leadData);
      this.leadValue = Object.values(this.leadData);
    }
    console.log('lead data', this.leadKey, this.leadValue);
  }
}
