import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loan-search',
  templateUrl: './loan-search.component.html',
  styleUrls: ['./loan-search.component.css'],
})
export class LoanSearchComponent implements OnInit, OnChanges {
  @Output() submitClicked = new EventEmitter();

  @Input() inputType;

  @Input() loanAccountNo;

  searchByLoan = new FormGroup({
    loanAccountNo: new FormControl('', Validators.required),
    inputType: new FormControl(true, Validators.required),
  });

  loanAppNum;

  constructor(public router: Router) {}

  ngOnChanges(changes) {
    if (changes.inputType) {
      this.searchByLoan
        .get('inputType')
        .setValue(changes.inputType.currentValue === '2' ? true : false);
    }

    if (changes.loanAccountNo) {
      this.searchByLoan.get('loanAccountNo').setValue(changes.loanAccountNo.currentValue);
    }
  }

  ngOnInit(): void {}

  onSubmitClicked() {
    let inputType = '1';
    if (this.searchByLoan.get('inputType').value === true) {
      inputType = '1';
    } else {
      inputType = '2';
    }

    const valueToEmit = {
      inputType,
      loanAccountNo: this.searchByLoan.get('loanAccountNo').value,
    };
    this.submitClicked.emit(valueToEmit);
  }

  onToggled() {
    this.searchByLoan.get('loanAccountNo').reset();
  }

  onClick() {
    this.router.navigateByUrl('group-credit/add-loan');
  }
}
