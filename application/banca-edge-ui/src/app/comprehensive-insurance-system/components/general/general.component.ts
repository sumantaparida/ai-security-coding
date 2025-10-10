import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { ComprehensiveInsuranceSystemService } from '@app/comprehensive-insurance-system/services/comprehensive-insurance-system.service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import moment from 'moment';
import { CisModalComponent } from '../cis-modal/cis-modal.component';
import { LoaderService } from '@app/_services/loader.service';
// import { dummyQuoteInput } from '@app/comprehensive-insurance-system/models/form-data';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
})
export class GeneralComponent implements OnChanges {
  @Input() sections;

  @Input() isSummaryScreen;

  @Input() genralFormGroup: FormGroup;

  @Input() applicationData;

  @Input() isEditable = true;

  @Input() screenName;

  @Input() lob;

  @Input() insurerId;

  @Input() products;

  @Input() customerToken;

  @Output() spCodeChanged = new EventEmitter<string>();

  constructor(private cisService: ComprehensiveInsuranceSystemService, private dialog: MatDialog, private loaderService: LoaderService) { }

  ngOnChanges(changes) {
    if (changes.hasOwnProperty('isSummaryScreen') && !this.isSummaryScreen) {
      this.sections.forEach(section => {
        if (section.hasAlterScreenProperty) {
          section.formData.forEach(form => {
            if (form.controlType === 'proposal-number') {
              // console.log(this.genralFormGroup.getRawValue()[`${form.controlName}-${form.key}`] )
              const formValue = this.genralFormGroup.getRawValue()[`${form.controlName}-${form.key}`]
              if (formValue !== undefined && formValue !== null && formValue !== '') {
                // console.log('inside getpremium')
                this.getPremiumFromProposalNumber(form.controlName, form.key, form.valueType, formValue, form)
              }
            }
          })
        }

      })
    }
    if (changes.hasOwnProperty('isEditable') && !this.isEditable && this.applicationData) {
      Object.keys(this.genralFormGroup.controls).forEach((control) => {
        this.genralFormGroup.get(control).disable();
      });
    } else if (changes.hasOwnProperty('isEditable') && this.isEditable && this.applicationData) {
      // console.log('the from group', this.genralFormGroup);
      this.sections.forEach((section) => {
        let currentKey;
        section.formData.forEach((form) => {
          currentKey = form.key !== '' ? '-' + form.key : '';
          // console.log('form', form, currentKey);
          if (!form.initiallyDisabled) {
            if (form.key === '' && this.genralFormGroup.get(form.controlName)) {
              this.genralFormGroup.get(form.controlName).enable();
            } else if (this.genralFormGroup.get(form.controlName + '-' + form.key)) {
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
          if (form.disbaleIfConsent && this.customerToken) {
            this.genralFormGroup.get(form.controlName + currentKey).disable();
          }
        });
      });
    }
  }

  onDataChanged(controlName, key, valueType, event) {
    if (!controlName.includes('_')) {
      this.applicationData[key][valueType] = event.target.value;
    } else {
      const writeArrayIndex = controlName.split('_')[1]
      this.applicationData[key][writeArrayIndex][valueType] = event.target.value;
    }
  }

  getPremiumFromProposalNumber(controlName, key, valueType, event, input) {
    const value = typeof event === 'string' ? event : this.genralFormGroup.get(controlName + (input.key ? '-' + input.key : '')).value
    // console.log(value)
    this.applicationData[key][valueType] = value;
    if (this.customerToken || !this.isEditable) {
      console.log('inside consent')
      this.loaderService.showSpinner(true)
      this.cisService.getPremiumFromProposalNumber(this.lob, this.insurerId, value).subscribe(data => {
        this.loaderService.showSpinner(false)
        this.cisService.insurerAppilcationData = data
        if (data['repsonseMessage'] === 'Success') {
          if (input.hasFormManipulation) {
            if (input.removeValidators.length > 0) {
              input.removeValidators.forEach(remOpt => {
                const reqVal = data[remOpt.tagToCheck.name];
                if (remOpt.tagToCheck.value.findIndex(val => val === reqVal) > -1) {
                  remOpt.controlsToModify.forEach(controlName => {
                    let reqForm;
                    this.sections.forEach(section => {
                      reqForm = section.formData.find(form => {
                        return form.controlName === controlName.split('-')[0];
                      })

                    })

                    let reqValidators = reqForm.validators;
                    remOpt.validatorsToRemove.forEach(validator => {
                      delete reqValidators[validator]
                    })
                    const validatorsArray = this.cisService.getValidatorsArray(reqForm);
                    this.genralFormGroup.get(controlName).setValidators(validatorsArray);
                    console.log(this.genralFormGroup.get(controlName))
                    this.genralFormGroup.updateValueAndValidity();
                  })
                }
              })
            }
            if (input.removeFields.length > 0) {
              // console.log('Yet to start')
            }
          }
          if (input.replaceVal) {
            input.replaceValFrom.forEach(val => {

              //get req data from response
              const reqValue = this.getValue(val, data)

              //replacte the val
              this.setObj(val, this[val.objRepValKey], reqValue)
            })
          }

          if (input.prefillFromQuoteNumber) {
            // const data =usgiBgrQuote

            input.formtobePrefilled.forEach(form => {
              //get req data from response
              const reqValue = this.getValue(form, data)

              //assignt to formcontrol
              this.genralFormGroup.get(form.controlName)?.setValue(reqValue);

              //assign to policyData
              if (form.differentKey) {
                this.applicationData[form.diffKeyVal][form.key] = reqValue;
              } else {
                this.applicationData[key][form.key] = reqValue;
              }
            })
          }
          if (input.confirmPopup) {
            let details = {};
            input.displayPopupItems.forEach(item => {
              //get req data from response
              const reqValue = this.getValue(item, data)
              //set values to be shown
              Object.assign(details, { [item['label']]: reqValue })
            })
            input.displayConditionalMessage.forEach(condition => {
              let reqVal = this.genralFormGroup.get(condition.controlName).value;
              if (condition.visibleIf.findIndex(val => reqVal === val) > -1) {
                details[condition.label] = condition.message
              }
            })
            if (details) {
              const dialogRef = this.dialog.open(CisModalComponent, {
                data: { type: input['popupType'], details },
                panelClass: 'dialog-width',
                disableClose: true,
              });
              dialogRef.afterClosed().subscribe(() => {
              });
            }
          }
        } else {
          this.clearFields(key, input);
        }
      }, err => {
        this.loaderService.showSpinner(false)
        this.clearFields(key, input);
      });
    } else {
      this.loaderService.showSpinner(true)

      this.cisService.validateInsurerApplication(this.insurerId, value).subscribe(res => {
        this.loaderService.showSpinner(false)
        if (res['responseCode'] === 0) {
          this.loaderService.showSpinner(true)
          this.cisService.getPremiumFromProposalNumber(this.lob, this.insurerId, value).subscribe(data => {
            // data =dummyQuoteInput;
            this.loaderService.showSpinner(false)
            this.cisService.insurerAppilcationData = data
            if (data["responseCode"] === 1) {
              const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                data: data['repsonseMessage'],
                panelClass: 'dialog-width',
              });
            } else if (data['repsonseMessage'] === 'Success') {
              if (input.replaceVal) {
                input.replaceValFrom.forEach(val => {

                  //get req data from response
                  const reqValue = this.getValue(val, data)

                  //replacte the val
                  this.setObj(val, this[val.objRepValKey], reqValue)
                })
              }

              if (input.prefillFromQuoteNumber) {
                // const data =usgiBgrQuote

                input.formtobePrefilled.forEach(form => {
                  //get req data from response
                  const reqValue = this.getValue(form, data)

                  //assignt to formcontrol
                  this.genralFormGroup.get(form.controlName)?.setValue(reqValue);

                  //assign to policyData
                  if (form.differentKey) {
                    this.applicationData[form.diffKeyVal][form.key] = reqValue;
                  } else {
                    this.applicationData[key][form.key] = reqValue;
                  }
                })
                if (input.confirmPopup) {
                  let details = {};
                  input.displayPopupItems.forEach(item => {
                    //get req data from response
                    const reqValue = this.getValue(item, data)
                    //set values to be shown
                    Object.assign(details, { [item['label']]: reqValue })
                  })
                  if (details) {
                    const dialogRef = this.dialog.open(CisModalComponent, {
                      data: { type: input['popupType'], details },
                      panelClass: 'dialog-width',
                      disableClose: true,
                    });
                    dialogRef.afterClosed().subscribe(() => {
                    });
                  }
                }
              }
            } else {
              this.clearFields(key, input);
            }
          }, err => {

            // let data =dummyQuoteInput;

            this.loaderService.showSpinner(false)
            this.clearFields(key, input);
          });
        } else if (res['responseCode'] === 1) {
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: res['responseMessage'],
            panelClass: 'dialog-width',
          });

        } else {
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: 'Please enter a valid proposal number',
            panelClass: 'dialog-width',
          });
        }

      }, err => {
        this.loaderService.showSpinner(false)
        this.clearFields(key, input);
        const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
          data: err['responseMessage'],
          panelClass: 'dialog-width',
        });
      })
    }

  }

  //function to get value from nested payload
  getValue(form, data) {
    let reqLevel = data;
    form.prefillDepth[1].forEach(tag => {
      if (typeof tag === 'string' && tag.split('-').length > 1) {
        const [tagName, index] = tag.split('-')
        reqLevel = index ? reqLevel[tagName][+index] : reqLevel[tagName]
      } else {
        reqLevel = reqLevel[tag]
      }
    })
    if (form.prefillArray) {
      return reqLevel.map(val => {
        return val[form.objTag]
      })
    } else {
      return reqLevel[form.prefillDepth[0]];
    }
  }

  setObj(form, data, val) {
    let reqLevel = data;
    form.replaceValObj[1].forEach(tag => {
      if (typeof tag === 'string' && tag.split('-').length > 1) {
        const [tagName, index] = tag.split('-')
        reqLevel = index ? reqLevel[tagName][+index] : reqLevel[tagName]
      } else {
        reqLevel = reqLevel[tag]
      }
    })
    reqLevel[form.replaceValObj[0]] = val;
  }

  clearFields(key, input) {
    const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
      data: 'Please enter a valid proposal number',
      panelClass: 'dialog-width',
    });
    if (input.prefillFromProposalNumber) {
      if (input.prefillFromProposalNumber.pt) {
        this.genralFormGroup.get('pt-productInfo').setValue('');
        this.applicationData[key]['pt'] = '';
      }
      if (input.prefillFromProposalNumber.ppt) {
        this.genralFormGroup.get('ppt-productInfo').setValue('');
        this.applicationData[key]['ppt'] = '';
      }
      if (input.prefillFromProposalNumber.premium) {
        this.genralFormGroup.get('netPremium-productInfo').setValue('');
        this.applicationData[key]['netPremium'] = '';
      }
      if (input.prefillFromProposalNumber.productName) {
        this.genralFormGroup.get('productName-productInfo').setValue('');
        // this.applicationData[key]['productId'] = '';
        this.applicationData[key]['productName'] = '';
        // this.applicationData[key]['productId'] = '';
        this.applicationData[key]['productId'] = 0;
      }
      if (input.prefillFromProposalNumber.mode) {
        this.genralFormGroup.get('netPremium-productInfo').setValue('');
        this.applicationData[key]['netPremium'] = '';
      }
      if (input.prefillFromProposalNumber.sumAssured) {
        this.genralFormGroup.get('sumAssured-productInfo').setValue('');
        this.applicationData[key]['sumAssured'] = '';
      }
    } else if (input.prefillFromQuoteNumber) {
      input.formtobePrefilled.forEach(form => {
        //assignt to formcontrol
        this.genralFormGroup.get(form.controlName)?.setValue('');

        //assign to policyData
        this.applicationData[key][form.key] = '';
      })
    }
  }

  onNumberChanged(controlName, key, valueType, event) {
    if (!controlName.includes('_')) {
      this.applicationData[key][valueType] = +event.target.value;
    } else {
      const writeArrayIndex = controlName.split('_')[1]
      this.applicationData[key][writeArrayIndex][valueType] = +event.target.value;
    }

    // console.log('applicationData', this.applicationData);
  }

  onKeyUp(controlName, key, valueType, input, event, isCap) {
    if (isCap) {
      this.genralFormGroup.get(controlName + '-' + key).setValue(event.target.value.toUpperCase())
    }
    if (input.addClass && input.addClass.indexOf('uppercase') > -1) {
      // console.log(this.genralFormGroup);
      this.applicationData[key][valueType] = event.target.value.toUpperCase();
      this.genralFormGroup.get(controlName + '-' + key).setValue(event.target.value.toUpperCase());

    }
    // console.log('applicationData', this.applicationData);
  }

  onDateChanged(controlName, key, valueType, event) {
    if (valueType === 'policyStartDate') {
      const startDate = this.genralFormGroup.get('policyStartDate-productInfo').value;
      const pt = this.genralFormGroup.get('pt-productInfo').value;
      this.genralFormGroup
        .get('policyEndDate-productInfo')
        .setValue(moment(new Date(startDate)).add(pt, 'years').format('YYYY-MM-DD'));
      this.applicationData[key][valueType] = moment(new Date(startDate))
        .add(pt, 'years')
        .format('YYYY-MM-DD');
    }
    if (!controlName.includes('_')) {
      this.applicationData[key][valueType] = moment(new Date(event.value)).format('YYYY-MM-DD');
    } else {
      const writeArrayIndex = controlName.split('_')[1]
      this.applicationData[key][writeArrayIndex][valueType] = moment(new Date(event.value)).format('YYYY-MM-DD');
    }
    // console.log('applicationData', this.applicationData);
  }

  onRadioChange(controlName, key, valueType, event: MatRadioChange) {
    console.log(controlName, key, event);
    if (event.value === 'true') {
      event.value = true;
    } else if (event.value === 'false') {
      event.value = false;
    }
    // console.log(event.value);
    if (!controlName.includes('_')) {
      this.applicationData[key][valueType] = event.value;
    } else {
      const writeArrayIndex = controlName.split('_')[1]
      this.applicationData[key][writeArrayIndex][valueType] = event.value;
    }
    // console.log('applicationData', this.applicationData);
  }

  onSelectionChanged(controlName, key, valueType, event) {
    if (!controlName.includes('_')) {
      this.applicationData[key][valueType] = event.value;
    } else {
      const writeArrayIndex = controlName.split('_')[1]
      this.applicationData[key][writeArrayIndex][valueType] = event.value;
    }
    // console.log('applicationData', this.applicationData);
  }

  onSelectionKeyValueChanged(form, event) {
    // console.log('the form', form);
    // console.log('the event', event);
    const idTag = form.keyValueMapping.id;
    const valueTag = form.keyValueMapping.value;
    this.applicationData[form.key][idTag] = event.value;
    this.applicationData[form.key][valueTag] = form.options.find(
      (option) => option.id === event.value,
    ).value;
    // this.applicationData[key][valueType] = event.value;
    // console.log('applicationData', this.applicationData);
  }

  onCheckboxChange(event: MatCheckboxChange, ControlName) {
    if (event.checked) {
      this.applicationData[ControlName] = 'Y';
    } else if (!event.checked) {
      this.applicationData[ControlName] = 'N';
    }
  }

  onSpChange(options, event) {
    // console.log('options', options);
    // console.log('event', event);
    this.applicationData.agencyData.spCode = event.value;
    this.applicationData.agencyData.spName = options.find(
      (option) => option.id === event.value,
    ).value;
    this.applicationData.agencyData.insurerSpCode = options[options.findIndex(
      (option) => option.id === event.value,
    )].baxaAgentCode
    // console.log('applicationData', this.applicationData);
    this.spCodeChanged.emit(event.value);
  }
}
