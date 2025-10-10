import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProposalService } from '@app/proposal/services/proposal.service';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css'],
})
export class ContanctInfoComponent implements OnInit, OnChanges {
  @Input() contanctInfoForm: FormGroup;

  @Input() isEditable = true;

  @Input() applicationData;

  @Input() insuredData;

  question: string;

  mailingAddress;

  eighteenYearsBack: Date;

  Label1: string;

  Label2: string;

  states;

  policycity;

  mailingcity;

  constructor(private proposalService: ProposalService) {}

  ngOnInit() {
    this.applicationData['policyAddress']['country'] = 'India';
    this.applicationData['mailingAddress']['country'] = 'India';
    this.mailingAddress = this.applicationData.mailingAddress;
    if (this.insuredData.lob === 'Fire') {
      this.question = 'Are the property and mailing address the same?';
      this.Label1 = 'Property Address';
      this.Label2 = 'Mailing Address';
    } else {
      this.question = 'Are the permanent and mailing address the same?';
      this.Label1 = 'Permanent Address';
      this.Label2 = 'Mailing Address';
    }

    if (this.insuredData.insurerCode == 134) {
      this.proposalService.getState().subscribe((states) => {
        this.states = states;
        console.log(this.states);
      });
    }
  }

  ngOnChanges(changes) {
    if (changes.hasOwnProperty('applicationData')) {
      if (this.insuredData.insurerCode == 134) {
        if (this.contanctInfoForm.get('policystate').valid) {
          const stateId = this.contanctInfoForm.get('policystate').value;
          this.proposalService.getCity(stateId).subscribe((city) => {
            this.policycity = city;
          });
        }
        if (this.contanctInfoForm.get('mailstate').valid) {
          const stateId = this.contanctInfoForm.get('mailstate').value;
          this.proposalService.getCity(stateId).subscribe((city) => {
            this.mailingcity = city;
          });
        }
      } else {
        if (this.contanctInfoForm.get('policypostalcode').valid) {
          this.proposalService
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
          this.proposalService
            .getCityAndState(this.contanctInfoForm.get('mailpostalcode').value)
            .subscribe((data) => {
              this.contanctInfoForm.get('mailcity').setValue(data.city);
              this.contanctInfoForm.get('mailstate').setValue(data.stateName);
              this.applicationData['mailingAddress']['city'] = data.city;
              this.applicationData['mailingAddress']['state'] = data.stateName;
            });
        }
      }
    }

    if (changes.hasOwnProperty('isEditable') && !this.isEditable) {
      Object.keys(this.contanctInfoForm.controls).forEach((control) => {
        this.contanctInfoForm.get(control).disable();
      });
    } else if (changes.hasOwnProperty('isEditable') && this.isEditable) {
      Object.keys(this.contanctInfoForm.controls).forEach((control) => {
        this.contanctInfoForm.get(control).enable();
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
      if (this.insuredData.insurerCode == 134) {
        this.contanctInfoForm.removeControl('searchCtrl2');
      }
      this.applicationData.mailingAddress = this.applicationData.policyAddress;
      this.applicationData['mailingAddress']['addressType'] = 'C';
      this.applicationData.addressSame = true;
    } else {
      this.contanctInfoForm.addControl(
        'mailaddressline1',
        new FormControl(this.applicationData.mailingAddress.addressline1, [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(40),
          Validators.pattern('^[a-zA-Z0-9- #.,/]*$'),
        ]),
      );
      this.contanctInfoForm.addControl(
        'mailaddressline2',
        new FormControl(this.applicationData.mailingAddress.addressline2, [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(40),
          Validators.pattern('^[a-zA-Z0-9- #.,/]*$'),
        ]),
      );
      this.contanctInfoForm.addControl(
        'mailaddressline3',
        new FormControl(this.applicationData.mailingAddress.addressline3, [
          Validators.maxLength(40),
          Validators.pattern('^[a-zA-Z0-9- #.,/]*$'),
        ]),
      );
      if (this.insuredData.insurerCode == 134) {
        this.contanctInfoForm.addControl('searchCtrl2', new FormControl(''));
      }
      if (postalcodeRegex.test(this.applicationData.mailingAddress.postalcode)) {
        this.contanctInfoForm.addControl(
          'mailpostalcode',
          new FormControl(this.applicationData.mailingAddress.postalcode?.trim(), [
            Validators.required,
            Validators.pattern(postalcodeRegex),
          ]),
        );
        if (this.insuredData.insurerCode == 134) {
          this.contanctInfoForm.addControl(
            'mailcity',
            new FormControl(this.applicationData.mailingAddress.cityCode, Validators.required),
          );
          this.contanctInfoForm.addControl(
            'mailstate',
            new FormControl(this.applicationData.mailingAddress.stateCode, Validators.required),
          );
        } else {
          this.contanctInfoForm.addControl(
            'mailcity',
            new FormControl(this.applicationData.mailingAddress.city, Validators.required),
          );
          this.contanctInfoForm.addControl(
            'mailstate',
            new FormControl(this.applicationData.mailingAddress.state, Validators.required),
          );
        }
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
    if (this.insuredData.insurerCode != 134) {
      if (mailType === 'mailingAddress') {
        console.log(this.contanctInfoForm.get('mailpostalcode').valid);
        if (this.contanctInfoForm.get('mailpostalcode').valid) {
          this.proposalService
            .getCityAndState(this.contanctInfoForm.get('mailpostalcode').value)
            .subscribe((data) => {
              console.log('the pincode response', data);
              this.contanctInfoForm.get('mailcity').setValue(data.city);
              this.contanctInfoForm.get('mailstate').setValue(data.stateName);
              this.applicationData[mailType][controlName] =
                this.contanctInfoForm.get('mailpostalcode').value;
              this.applicationData[mailType]['city'] = this.contanctInfoForm.get('mailcity').value;
              this.applicationData[mailType]['state'] =
                this.contanctInfoForm.get('mailstate').value;
            });
        }
      } else {
        console.log(this.contanctInfoForm.get('policypostalcode').valid);
        if (this.contanctInfoForm.get('policypostalcode').valid) {
          this.proposalService
            .getCityAndState(this.contanctInfoForm.get('policypostalcode').value)
            .subscribe((data) => {
              console.log('the pincode response', data);
              this.contanctInfoForm.get('policycity').setValue(data.city);
              this.contanctInfoForm.get('policystate').setValue(data.stateName);
              this.applicationData[mailType][controlName] =
                this.contanctInfoForm.get('policypostalcode').value;
              this.applicationData[mailType]['city'] =
                this.contanctInfoForm.get('policycity').value;
              this.applicationData[mailType]['state'] =
                this.contanctInfoForm.get('policystate').value;
              console.log('applicatin', this.applicationData);
            });
        }
      }
    } else {
      if (mailType === 'mailingAddress') {
        console.log(this.contanctInfoForm.get('mailpostalcode').valid);
        if (this.contanctInfoForm.get('mailpostalcode').valid) {
          this.applicationData[mailType][controlName] =
            this.contanctInfoForm.get('mailpostalcode').value;
        }
      } else {
        console.log(this.contanctInfoForm.get('policypostalcode').valid);
        if (this.contanctInfoForm.get('policypostalcode').valid) {
          this.applicationData[mailType][controlName] =
            this.contanctInfoForm.get('policypostalcode').value;
        }
      }
    }
  }

  //for KB sompo product
  onSelectionChanged(event, type, addressType) {
    console.log(event);
    console.log(type);
    console.log(addressType);
    if (addressType === 'mailingAddress') {
      if (type === 'state') {
        const stateId = event.value;
        this.proposalService.getCity(stateId).subscribe(
          (city) => {
            this.mailingcity = city;
            if (city == null) {
              this.contanctInfoForm.get('mailcity').setValue(null);
            }
          },
          () => {
            this.contanctInfoForm.get('mailcity').setValue(null);
          },
        );
        this.applicationData[addressType]['stateCode'] =
          this.contanctInfoForm.get('mailstate').value;
        this.applicationData[addressType]['state'] = this.states.find(
          (state) => state.id === stateId,
        ).value;
      }

      if (type === 'city') {
        const cityId = event.value;
        this.applicationData[addressType]['cityCode'] = this.contanctInfoForm.get('mailcity').value;
        this.applicationData[addressType]['city'] = this.mailingcity.find(
          (city) => city.id === cityId,
        ).value;
      }
    }

    if (addressType === 'policyAddress') {
      if (type === 'state') {
        const stateId = event.value;
        this.proposalService.getCity(stateId).subscribe(
          (city) => {
            this.policycity = city;
            if (city == null) {
              this.contanctInfoForm.get('policycity').setValue(null);
            }
          },
          () => {
            this.contanctInfoForm.get('policycity').setValue(null);
          },
        );
        this.applicationData[addressType]['stateCode'] =
          this.contanctInfoForm.get('policystate').value;
        this.applicationData[addressType]['state'] = this.states.find(
          (state) => state.id === stateId,
        ).value;
      }

      if (type === 'city') {
        const cityId = event.value;
        this.applicationData[addressType]['cityCode'] =
          this.contanctInfoForm.get('policycity').value;
        this.applicationData[addressType]['city'] = this.policycity.find(
          (city) => city.id === cityId,
        ).value;
      }
    }
  }
}
