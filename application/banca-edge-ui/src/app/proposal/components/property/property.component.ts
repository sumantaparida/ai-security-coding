import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css'],
})
export class PropertyComponent implements OnInit, OnChanges {
  @Input() propertyForm: FormGroup;

  @Input() isEditable;

  @Input() sections;

  @Input() propertyDetails;

  saMax = false;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.propertyForm.get('typeOfConstruction-buildingInfo')) {
      this.propertyForm.get('typeOfConstruction-buildingInfo').valueChanges.subscribe((changes) => {
        if (changes === '2') {
          const message = 'Please contact branch';
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
          dialogRef.afterClosed().subscribe(() => {
            //navigate
          });
        }
      });
    }
    if (
      this.propertyForm.get('typeOfConstruction-buildingInfo') &&
      this.propertyForm.get('Safurniturefixture-contents')
    ) {
      this.propertyForm.get('Safurniturefixture-contents').valueChanges.subscribe((val) => {
        const totalCostOfConstrcution =
          this.propertyDetails['buildingInfo']['totalCostOfConstruction'];
        let totalsa = 0;
        if (val > 0) {
          totalsa = val + totalCostOfConstrcution;
        }
        this.saMax = totalsa > 50000000 ? true : false;
        if (this.saMax) {
          this.propertyForm.get('temp-maxValue').setValidators(Validators.required);
          this.propertyForm.get('temp-maxValue').updateValueAndValidity();
        } else {
          this.propertyForm.get('temp-maxValue').clearValidators();
          this.propertyForm.get('temp-maxValue').updateValueAndValidity();
        }
      });
    }
  }

  ngOnChanges(changes) {
    // console.log('logging changes', changes);
    if (changes.hasOwnProperty('isEditable') && !this.isEditable && this.propertyDetails) {
      Object.keys(this.propertyForm.controls).forEach((control) => {
        this.propertyForm.get(control).disable();
      });
    } else if (changes.hasOwnProperty('isEditable') && this.isEditable && this.propertyDetails) {
      this.sections.forEach((section) => {
        section.formData.forEach((form) => {
          const currentKey = form.key !== '' ? '-' + form.key : '';
          if (!form.initiallyDisabled) {
            if (this.propertyForm.get(form.controlName + currentKey)) {
              this.propertyForm.get(form.controlName + currentKey).enable();
            }
          }
        });
      });
    }
  }

  onDateChanged(controlName, event) {
    this.propertyDetails[controlName] = event.value;
  }

  onDataChanged(section, form, controlName, key, valueType, event) {
    if (Array.isArray(this.propertyDetails[form.key])) {
      if (this.propertyDetails[form.key].length > 0) {
        this.propertyDetails[form.key].forEach((content) => {
          if (form.valueType === content.type && form.coverId === content.coverId) {
            if (form.controlType !== 'radio') {
              content[form.dependentTag] = event.target.value;
            }
          } else {
            if (
              this.propertyDetails[form.key].findIndex(
                (content1) => content1.type === form.valueType && form.coverId === content1.coverId,
              ) === -1
            ) {
              this.propertyDetails[form.key].push({
                type: form.valueType,
                coverId: form.coverId,
                sa: form.dependentTag === 'sa' ? event.target.value : 0,
                firstLossPercent: 0,
                period: form.dependentTag === 'period' ? event.value : 0,
                contentDesc: form.dependentTag === 'contentDesc' ? event.target.value : null,
                noOfUnits: form.dependentTag === 'noOfUnits' ? event.target.value : 0,
              });
            }
          }
        });
      } else {
        this.propertyDetails[form.key].push({
          type: form.valueType,
          coverId: form.coverId,
          sa: form.dependentTag === 'sa' ? event.target.value : 0,
          firstLossPercent: 0,
          period: form.dependentTag === 'period' ? event.value : 0,
          contentDesc: form.dependentTag === 'contentDesc' ? event.target.value : null,
          noOfUnits: form.dependentTag === 'noOfUnits' ? event.target.value : 0,
        });
      }
    }
    if (form.hasDependentsValue) {
      form.hasDependentsValueControl.forEach((DependentsValueControl) => {
        const dependentForm = section.formData.filter((Dform) => {
          return DependentsValueControl === Dform.controlName;
        });
        // console.log(dependentForm);
        this.dependentOperation(dependentForm);
      });
    }
    this.propertyDetails[key][valueType] = event.target.value;
  }

  onSelectionChanged(section, form, controlName, key, valueType, event) {
    if (Array.isArray(this.propertyDetails[form.key])) {
      if (this.propertyDetails[form.key].length > 0) {
        this.propertyDetails[form.key].forEach((content) => {
          if (form.valueType === content.type && form.coverId === content.coverId) {
            if (form.controlType !== 'radio') {
              content[form.dependentTag] = event.value;
            }
          } else {
            if (
              this.propertyDetails[form.key].findIndex(
                (content1) => content1.type === form.valueType && form.coverId === content1.coverId,
              ) === -1
            ) {
              this.propertyDetails[form.key].push({
                type: form.valueType,
                coverId: form.coverId,
                sa: form.dependentTag === 'sa' ? event.value : 0,
                firstLossPercent: 0,
                period: form.dependentTag === 'period' ? event.value : 0,
                contentDesc: form.dependentTag === 'contentDesc' ? event.target.value : null,
                noOfUnits: form.dependentTag === 'noOfUnits' ? event.target.value : 0,
              });
            }
          }
        });
      } else {
        this.propertyDetails[form.key].push({
          type: form.valueType,
          coverId: form.coverId,
          sa: form.dependentTag === 'sa' ? event.target.value : 0,
          firstLossPercent: 0,
          period: form.dependentTag === 'period' ? event.value : 0,
          contentDesc: form.dependentTag === 'contentDesc' ? event.target.value : null,
          noOfUnits: form.dependentTag === 'noOfUnits' ? event.target.value : 0,
        });
      }
    }
    if (form.hasDependentsValue) {
      form.hasDependentsValueControl.forEach((DependentsValueControl) => {
        const dependentForm = section.formData.filter((Dform) => {
          return DependentsValueControl === Dform.controlName;
        });
        // console.log(dependentForm);
        this.dependentOperation(dependentForm);
      });
    }
    this.propertyDetails[key][valueType] = event.value;
  }
  // onDateChanged(controlName, key, valueType, event) {
  //   this.propertyDetails[key][valueType] = moment(new Date(event.value)).format('YYYY-MM-DD');
  // }

  onRadioChange(section, form, controlName, valueType, key, event) {
    if (Array.isArray(this.propertyDetails[form.key])) {
      this.propertyDetails[form.key].forEach((content, index) => {
        if (form.valueType === content.type && form.coverId === content.coverId) {
          if (event.value === 'N') {
            if (form.coverId !== 'BURG') {
              if (form.dependentContents) {
                form.dependentContentsval.forEach((Dcontent) => {
                  const position = this.propertyDetails[form.key].findIndex(
                    (contentpos) => contentpos.type === Dcontent,
                  );
                  this.propertyDetails[form.key].splice(position, 1);
                });
              } else {
                this.propertyDetails[form.key].splice(index, 1);
              }
            } else {
              content.sa = event.value;
            }
          }
        }
      });
    }
    this.propertyDetails[key][valueType] = event.value;
  }

  dependentOperation(dependentForm) {
    dependentForm.forEach((form) => {
      const currentKey = form.key !== '' ? '-' + form.key : '';
      if (form.operation === 'multiplication') {
        const values: [] = form.valueDependentControls.map((value) => {
          // console.log(value, currentKey);
          return +this.propertyForm.get(value + currentKey).value;
        });
        // console.log(values);
        const total = values.reduce((num1, num2) => {
          return num1 * num2;
        }, values.length - 1);
        // console.log(total);
        this.propertyForm.get(form.controlName + currentKey).setValue(total);
        if (form.key !== '') {
          this.propertyDetails[form.key][form.valueType] = total;
        } else {
          this.propertyDetails[form.valueType] = total;
        }
      }
    });
  }
}
