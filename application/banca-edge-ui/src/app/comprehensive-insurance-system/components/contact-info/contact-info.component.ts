import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ComprehensiveInsuranceSystemService } from '@app/comprehensive-insurance-system/services/comprehensive-insurance-system.service';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css'],
})
export class ContactInfoComponent implements OnInit, OnChanges {
  @Input() isEditable;

  @Input() applicationData;

  @Input() contanctInfoForm;

  @Input() screen;

  mailingAddress;

  question = 'Are the permanent and mailing address the same?';

  labelOne = 'Permanent Address';

  labelTwo = 'Mailing Address';

  constructor(private cisService: ComprehensiveInsuranceSystemService) {}

  ngOnInit(): void {
    this.applicationData['policyAddress']['country'] = 'India';
    this.applicationData['mailingAddress']['country'] = 'India';
    this.mailingAddress = this.applicationData.mailingAddress;
    this.labelOne = this.applicationData.productInfo.productName === 'Bharat Griha Raksha' ? 'Risk Address': 'Permanent Address';
    this.question = this.applicationData.productInfo.productName === 'Bharat Griha Raksha' ? 'Are the risk and mailing address the same?' : 'Are the permanent and mailing address the same?';
  }

  ngOnChanges(changes) {
    if (changes.hasOwnProperty('applicationData')) {
      if (this.contanctInfoForm.get('policypostalcode').valid) {
        this.cisService
          .getCityAndState(this.contanctInfoForm.get('policypostalcode').value)
          .subscribe((data) => {
            this.contanctInfoForm.get('policycity').setValue(data.city);
            this.contanctInfoForm.get('policystate').setValue(data.stateName);
            this.applicationData['policyAddress']['city'] = data.city;
            this.applicationData['policyAddress']['state'] = data.stateName;
          });
      }

      if (
        this.contanctInfoForm.get('mailpostalcode') &&
        this.contanctInfoForm.get('mailpostalcode').valid
      ) {
        console.log('state load iffffff22222');
        this.cisService
          .getCityAndState(this.contanctInfoForm.get('mailpostalcode').value)
          .subscribe((data) => {
            this.contanctInfoForm.get('mailcity').setValue(data.city);
            this.contanctInfoForm.get('mailstate').setValue(data.stateName);
            this.applicationData['mailingAddress']['city'] = data.city;
            this.applicationData['mailingAddress']['state'] = data.stateName;
          });
      }
      
    }

    if (changes.hasOwnProperty('isEditable') && !this.isEditable) {
      Object.keys(this.contanctInfoForm.controls).forEach((control) => {
        this.contanctInfoForm.get(control).disable();
      });
    } else if (changes.hasOwnProperty('isEditable') && this.isEditable) {
      Object.keys(this.contanctInfoForm.controls).forEach((control) => {
        this.contanctInfoForm.get(control).enable();
        if(this.screen.hasAlteredVal){
            if(this.screen.formToBeDisabled.findIndex(controlName=> control === controlName) > -1){
              this.contanctInfoForm.get(control).disable();
            }
        }
      });

    }
  }

  onRadioChange(event) {
    const postalcodeRegex = /^[1-9]{1}[0-9]{5,5}$/;
    this.applicationData['policyAddress']['addressType'] = 'P';
    this.applicationData['mailingAddress']['addressType'] = 'C';
    if (event.value === 'yes') {
      this.contanctInfoForm.removeControl('mailaddressline1');
      this.contanctInfoForm.removeControl('mailaddressline2');
      this.contanctInfoForm.removeControl('mailaddressline3');
      this.contanctInfoForm.removeControl('mailpostalcode');
      this.contanctInfoForm.removeControl('mailcity');
      this.contanctInfoForm.removeControl('mailstate');
      this.applicationData.addressSame = true;
      this.applicationData.mailingAddress = this.applicationData.policyAddress;
      this.applicationData['mailingAddress']['addressType'] = 'C';
    } else {
      this.contanctInfoForm.addControl(
        'mailaddressline1',
        new FormControl(this.applicationData.mailingAddress.addressline1, [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(80),
          Validators.pattern('^[a-zA-Z0-9- #.,/]*$'),
        ]),
      );
      this.contanctInfoForm.addControl(
        'mailaddressline2',
        new FormControl(this.applicationData.mailingAddress.addressline2, [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(80),
          Validators.pattern('^[a-zA-Z0-9- #.,/]*$'),
        ]),
      );
      this.contanctInfoForm.addControl(
        'mailaddressline3',
        new FormControl(this.applicationData.mailingAddress.addressline3, [
          Validators.maxLength(80),
          Validators.pattern('^[a-zA-Z0-9- #.,/]*$'),
        ]),
      );
      if (postalcodeRegex.test(this.applicationData.mailingAddress.postalcode)) {
        this.contanctInfoForm.addControl(
          'mailpostalcode',
          new FormControl(this.applicationData.mailingAddress.postalcode?.trim(), [
            Validators.required,
            Validators.pattern(postalcodeRegex),
          ]),
        );

        this.contanctInfoForm.addControl(
          'mailcity',
          new FormControl(this.applicationData.mailingAddress.city, Validators.required),
        );
        this.contanctInfoForm.addControl(
          'mailstate',
          new FormControl(this.applicationData.mailingAddress.state, Validators.required),
        );
      } else {
        this.contanctInfoForm.addControl(
          'mailpostalcode',
          new FormControl('', [Validators.required, Validators.pattern(postalcodeRegex)]),
        );
        this.contanctInfoForm.addControl('mailcity', new FormControl('', Validators.required));
        this.contanctInfoForm.addControl('mailstate', new FormControl('', Validators.required));
      }
      this.applicationData.addressSame = false;
    }
  }

  onDataChanged(mailType, controlName, event) {
    this.applicationData[mailType][controlName] = event.target.value;
  }

  onPinChanged(mailType, controlName) {
    if (mailType === 'mailingAddress') {
      console.log(this.contanctInfoForm.get('mailpostalcode').valid);
      if (this.contanctInfoForm.get('mailpostalcode').valid) {
        this.cisService
          .getCityAndState(this.contanctInfoForm.get('mailpostalcode').value)
          .subscribe((data) => {
            console.log('the pincode response', data);
            this.contanctInfoForm.get('mailcity').setValue(data.city);
            this.contanctInfoForm.get('mailstate').setValue(data.stateName);
            this.applicationData[mailType][controlName] =
              this.contanctInfoForm.get('mailpostalcode').value;
            this.applicationData[mailType]['city'] = this.contanctInfoForm.get('mailcity').value;
            this.applicationData[mailType]['state'] = this.contanctInfoForm.get('mailstate').value;
          });
      }
    } else {
      console.log(this.contanctInfoForm.get('policypostalcode').valid);
      if (this.contanctInfoForm.get('policypostalcode').valid) {
        this.cisService
          .getCityAndState(this.contanctInfoForm.get('policypostalcode').value)
          .subscribe((data) => {
            console.log('the pincode response', data);
            this.contanctInfoForm.get('policycity').setValue(data.city);
            this.contanctInfoForm.get('policystate').setValue(data.stateName);
            this.applicationData[mailType][controlName] =
              this.contanctInfoForm.get('policypostalcode').value;
            this.applicationData[mailType]['city'] = this.contanctInfoForm.get('policycity').value;
            this.applicationData[mailType]['state'] =
              this.contanctInfoForm.get('policystate').value;
            console.log('applicatin', this.applicationData);
          });
      }
    }
  }
}
