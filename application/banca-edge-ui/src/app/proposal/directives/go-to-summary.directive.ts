import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Directive({
  selector: '[appGoToSummary]'
})
export class GoToSummaryDirective implements OnInit {
  @Input() stepper: MatStepper;
  @Input() nextScreen;
  @Input() customerToken;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    if (this.nextScreen !== '' && this.customerToken) {
      setTimeout(() => {
        this.elementRef.nativeElement.click();
      });
    }
  }
}
