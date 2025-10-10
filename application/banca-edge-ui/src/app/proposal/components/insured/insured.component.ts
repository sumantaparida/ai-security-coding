import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
@Component({
  selector: 'app-insured',
  templateUrl: './insured.component.html',
  styleUrls: ['./insured.component.css'],
})
export class InsuredComponent implements OnInit, OnChanges {
  @Input() insuredProposerForm: FormGroup;

  @Input() isProposer = false;

  @Input() isEditable = true;

  @Input() insuredDetails;

  @Input() relationshipDropdown;

  @Input() sections;

  ngOnInit() {}

  ngOnChanges(changes) {
    if (changes.hasOwnProperty('isEditable') && !this.isEditable && this.insuredDetails) {
      Object.keys(this.insuredProposerForm.controls).forEach((control) => {
        this.insuredProposerForm.get(control).disable();
      });
    } else if (changes.hasOwnProperty('isEditable') && this.isEditable && this.insuredDetails) {
      Object.keys(this.insuredProposerForm.controls).forEach((control) => {
        this.insuredProposerForm.get(control).enable();
      });
      // console.log(this.sections);
      this.insuredDetails.forEach((insured, index) => {
        this.sections.forEach((section) => {
          section.formData.forEach((form) => {
            if (
              form.initiallyDisabled &&
              this.insuredProposerForm.get(form.controlName + index).valid
            ) {
              this.insuredProposerForm.get(form.controlName + index).disable();
            }
          });
        });
        // if (this.insuredProposerForm.get('dob' + index).valid) {
        //     this.insuredProposerForm.get('dob' + index).disable();
        // }
        // if (this.insuredProposerForm.get('gender' + index).valid) {
        //     this.insuredProposerForm.get('gender' + index).disable();
        // }
        // if (this.insuredProposerForm.get('proposerRel' + index).valid) {
        //     this.insuredProposerForm.get('proposerRel' + index).disable();
        // }
        // if (this.insuredProposerForm.get('rating' + index) && this.insuredProposerForm.get('rating' + index).value !== '') {
        //     this.insuredProposerForm.get('rating' + index).disable();
        // }
        // if (this.insuredProposerForm.get('title' + index).valid) {
        //     this.insuredProposerForm.get('title' + index).disable();
        // }
      });
    }
  }

  onDataChanged(controlName, valueType, index, event) {
    if (controlName.indexOf('nominee') > -1) {
      this.insuredDetails[index]['nominee'][valueType] = event.target.value;
    } else {
      this.insuredDetails[index][valueType] = event.target.value;
    }
  }

  onSelectionChanged(controlName, valueType, index, event) {
    if (controlName.indexOf('nominee') > -1) {
      this.insuredDetails[index]['nominee'][valueType] = event.value;
    } else {
      this.insuredDetails[index][valueType] = event.value;
    }
  }

  onDateChanged(controlName, valueType, index, event) {
    if (controlName.indexOf('nominee') > -1) {
      this.insuredDetails[index]['nominee'][valueType] = moment(new Date(event.value)).format(
        'YYYY-MM-DD',
      );
    } else {
      this.insuredDetails[index][valueType] = moment(new Date(event.value)).format('YYYY-MM-DD');
    }
  }
}
