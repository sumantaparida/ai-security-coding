import { Component, Input, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-lead-batch-shared-data',
  templateUrl: './lead-batch-data.component.html',
  styleUrls: ['./lead-batch-data.component.css'],
})
export class LeadBatchDataComponent implements OnInit {
  expandedElement;

  constructor(public media: MediaObserver) {}

  @Input() element;

  @Input() policyStatus;

  leadData;

  leadKey;

  leadValue;

  ngOnInit(): void {
    this.leadData = this.element?.leadBatch;
    // this.leadKey = Object.keys(this.leadData);
    // this.leadValue = Object.values(this.leadData);

    // console.log('lead data', this.leadKey, this.leadValue);
  }
}
