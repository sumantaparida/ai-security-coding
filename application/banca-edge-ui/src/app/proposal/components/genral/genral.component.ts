import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';
import moment from 'moment';

@Component({
  selector: 'app-genral',
  templateUrl: './genral.component.html',
  styleUrls: ['./genral.component.css'],
})
export class GenralComponent implements OnInit, OnChanges {
  @Input() genralFormGroup: FormGroup;

  @Input() sections = [];

  @Input() applicationData;

  @Input() isEditable = true;

  @Input() insuredData;

  @Input() policyQuestions;

  @Input() insurersNames;

  @Input() answers;

  @Input() screenName;

  @Input() isArray;

  @Input() tag;

  @Input() relationshipDropdown;

  ngOnInit(): void {
    // console.log('got the loanDetailsFormGroup', this.genralFormGroup);
    // console.log('got the applicationData', this.applicationData);
    // console.log('got the sections', this.sections);
    // console.log('got the insuredData', this.insuredData);
    // console.log('got the policyQuestions', this.policyQuestions);
    // console.log('got the sections', this.sections);
    // console.log('got the insurersNames', this.insurersNames);
    // console.log('got the answers', this.answers);
    // console.log('got the screenName', this.screenName);
    console.log(this.isEditable);
  }

  ngOnChanges(changes) {
    // console.log('logging changes', changes);
    if (changes.hasOwnProperty('isEditable') && !this.isEditable && this.applicationData) {
      Object.keys(this.genralFormGroup.controls).forEach((control) => {
        this.genralFormGroup.get(control).disable();
      });
    } else if (changes.hasOwnProperty('isEditable') && this.isEditable && this.applicationData) {
      this.sections.forEach((section) => {
        let currentKey;
        if (!section.medicalSection) {
          section.formData.forEach((form) => {
            currentKey = form.key !== '' ? '-' + form.key : '';
            if (!form.initiallyDisabled) {
              if (form.key === '') {
                this.genralFormGroup.get(form.controlName).enable();
              } else {
                this.genralFormGroup.get(form.controlName + '-' + form.key).enable();
              }
            }
            if (form.hasOwnProperty('isInsuredproposerTagtoCheck')) {
              if (
                this.applicationData[form.isInsuredproposerTagtoCheck] &&
                this.genralFormGroup.get(form.controlName + currentKey).valid
              ) {
                this.genralFormGroup.get(form.controlName + currentKey).disable();
              }
            }
            if (form.valueIsDependentToDisable) {
              if (
                form.valueIsDependentToDisableValue.findIndex(
                  (disableValue) =>
                    disableValue === this.genralFormGroup.get(form.valueIsDependentOnControl).value,
                ) > -1
              ) {
                this.genralFormGroup.get(form.controlName + currentKey).disable();
              } else {
                if (this.genralFormGroup.get(form.controlName + currentKey).disabled) {
                  this.genralFormGroup.get(form.controlName + currentKey).enable();
                }
              }
            }
          });
        }
      });
    }
  }

  onDataChanged(controlName, key, valueType, event) {
    if (!this.isArray) {
      this.applicationData[key][valueType] = event.target.value;
    } else {
      const index = +controlName.slice(-1);
      this.applicationData[this.tag][index][valueType] = event.target.value;
    }
  }

  onKeyUp(controlName, key, valueType, input, event, isCap) {
    if (isCap) {
      this.genralFormGroup.get(controlName + '-' + key).setValue(event.target.value.toUpperCase())
    }
    if (input.addClass && input.addClass.indexOf('uppercase') > -1) {
      console.log(this.genralFormGroup);
      this.applicationData[key][valueType] = event.target.value.toUpperCase();
      this.genralFormGroup.get(controlName + '-' + key).setValue(event.target.value.toUpperCase());
    }
  }

  onDateChanged(controlName, key, valueType, event) {
    if (!this.isArray) {
      this.applicationData[key][valueType] = moment(new Date(event.value)).format('YYYY-MM-DD');
    } else {
      const index = +controlName.slice(-1);
      this.applicationData[this.tag][index][valueType] = moment(new Date(event.value)).format(
        'YYYY-MM-DD',
      );
    }
  }

  onRadioChange(controlName, key, valueType, event: MatRadioChange) {
    console.log(controlName, key, event);
    if (event.value === 'true') {
      event.value = true;
    } else if (event.value === 'false') {
      event.value = false;
    }
    console.log(event.value);
    if (!this.isArray) {
      this.applicationData[key][valueType] = event.value;
    } else {
      const index = +controlName.slice(-1);
      this.applicationData[this.tag][index][valueType] = event.value;
    }
  }

  onSelectionChanged(controlName, key, valueType, event) {
    if (!this.isArray) {
      this.applicationData[key][valueType] = event.value;
    } else {
      const index = +controlName.slice(-1);
      this.applicationData[this.tag][index][valueType] = event.value;
    }
  }

  onCheckboxChange(event: MatCheckboxChange, ControlName) {
    if (event.checked) {
      this.applicationData[ControlName] = 'Y';
    } else if (!event.checked) {
      this.applicationData[ControlName] = 'N';
    }
  }

  onSpChange(options, event) {
    console.log('options', options);
    console.log('event', event);
    this.applicationData.agencyData.spCode = event.value;
    this.applicationData.agencyData.spName = options.find(
      (option) => option.spCode === event.value,
    ).spName;
  }
}
