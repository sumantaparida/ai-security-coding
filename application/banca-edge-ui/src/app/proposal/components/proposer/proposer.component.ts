import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-proposer',
  templateUrl: './proposer.component.html',
  styleUrls: ['./proposer.component.css'],
})
export class ProposerComponent implements OnInit, OnChanges {
  @Input() proposerForm: FormGroup;

  @Input() proposerDetails;

  @Input() sections;

  @Input() isEditable = true;

  @Input() isInsuredAlsoProposer = false;

  @Input() proposerFormData;

  genderDropdown = [
    { id: 'M', value: 'Male' },
    { id: 'F', value: 'Female' },
  ];

  maritalStatusDropdown = [
    { id: 'M', value: 'Married' },
    { id: 'U', value: 'Single' },
  ];

  ngOnInit() {
    if (
      this.proposerForm &&
      this.proposerForm.get('proposerType') !== null &&
      this.proposerForm.get('proposerType').value === '' &&
      this.proposerDetails.isIndividual
    ) {
      this.proposerForm.get('proposerType').setValue('I');
    } else if (
      this.proposerForm &&
      this.proposerForm.get('proposerType') !== null &&
      this.proposerForm.get('proposerType').value === '' &&
      !this.proposerDetails.isIndividual
    ) {
      this.proposerForm.get('proposerType').setValue('C');
    }
  }

  ngOnChanges(changes) {
    if (changes.hasOwnProperty('isEditable') && !this.isEditable && this.proposerDetails) {
      Object.keys(this.proposerForm.controls).forEach((control) => {
        this.proposerForm.get(control).disable();
      });
    } else if (
      changes.hasOwnProperty('isEditable') &&
      this.isEditable &&
      this.isInsuredAlsoProposer
    ) {
      this.sections.forEach((section) => {
        section.formData.forEach((form) => {
          const currentKey = form.key != '' ? '-' + form.key : '';
          if (
            form.initiallyDisabled &&
            this.proposerForm.get(form.controlName + currentKey).value !== ''
          ) {
            this.proposerForm.get(form.controlName + currentKey).disable();
          }
        });
      });
      // Object.keys(this.proposerForm.controls).forEach(control => {
      //     if (this.proposerForm.get(control).value !== '' && control.indexOf('nominee') === -1) {
      //         this.proposerForm.get(control).disable();
      //     }
      //     if (control === 'proposerIndividualMobile' && this.proposerForm.get('proposerIndividualMobile') !== null) {
      //         this.proposerForm.get('proposerIndividualMobile').enable();
      //     } else if (control === 'proposerContactMobile' && this.proposerForm.get('proposerContactMobile') !== null) {
      //         this.proposerForm.get('proposerContactMobile').enable();
      //     } else if (control === 'proposerIndividualEmail' && this.proposerForm.get('proposerIndividualEmail') !== null) {
      //         this.proposerForm.get('proposerIndividualEmail').enable();
      //     } else if (control === 'proposerContactEmail' && this.proposerForm.get('proposerContactEmail') !== null) {
      //         this.proposerForm.get('proposerContactEmail').enable();
      //     } else if (control === 'proposerIndividualPanNo' && this.proposerForm.get('proposerIndividualPanNo') !== null) {
      //         this.proposerForm.get('proposerIndividualPanNo').enable();
      //     } else if (control === 'proposerContactPanNo' && this.proposerForm.get('proposerContactPanNo') !== null) {
      //         this.proposerForm.get('proposerContactPanNo').enable();
      //     }

      // });
    } else if (
      changes.hasOwnProperty('isEditable') &&
      this.isEditable &&
      !this.isInsuredAlsoProposer
    ) {
      Object.keys(this.proposerForm.controls).forEach((control) => {
        this.proposerForm.get(control).enable();
      });
    }
  }

  onDataChanged(controlName, key, valueType, event) {
    console.log('checking data', controlName, key, valueType, event);
    this.proposerDetails[key][valueType] = event.target.value;
    console.log('proposerDetails', this.proposerDetails);
  }

  onDateChanged(controlName, key, valueType, event) {
    this.proposerDetails[key][valueType] = moment(new Date(event.value)).format('YYYY-MM-DD');
  }

  onSelectionChanged(controlName, key, valueType, event) {
    this.proposerDetails[key][valueType] = event.value;
  }

  onRadioChange(controlName, valueType, key, event) {
    // this.proposerDetails[key]['isIndividual'] = event.value === 'I';
    // this.proposerDetails[key]['individual'] = event.value === 'I';
    // this.proposerDetails[key]['proposerType'] = event.value;
    this.proposerDetails[key][valueType] = event.value;
  }

  onKeyUp(controlName, key, valueType, input, event, isCap) {
    if (isCap) {
      this.proposerForm.get(controlName + '-' + key).setValue(event.target.value.toUpperCase())
    }
  }
}
