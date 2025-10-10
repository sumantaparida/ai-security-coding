import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuoteFormData } from '../quoteform.data';

@Component({
  selector: 'app-quote-layout',
  templateUrl: './quote-layout.component.html',
  styleUrls: ['./quote-layout.component.css']
})
export class QuoteLayoutComponent implements OnInit, OnChanges {


  @Input() formData: QuoteFormData[];
  form: FormGroup;
  checkVal;
  constructor() { }

  ngOnInit() {
    const formGroup = {};

    this.formData.forEach(formControl => {
      formGroup[formControl.controlName] = new FormControl('');
    });

    this.form = new FormGroup(formGroup);
    console.log('value', this.form.get('toInsure').value, this.form.value);
  }
  ngOnChanges(changes) {
    console.log('value after change', changes.hasOwnProperty('toInsure'));

  }

}
