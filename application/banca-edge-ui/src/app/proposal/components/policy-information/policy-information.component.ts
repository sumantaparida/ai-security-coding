import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
    selector: 'app-policy-term',
    templateUrl: './policy-information.component.html',
    styleUrls: ['./policy-information.component.css']
})
export class PolicyInformationComponent implements OnInit, OnChanges {

    @Input() policyTermFormGroup: FormGroup;
    @Input() isEditable = true;
    @Input() sections;
    @Input() insuredData;

    ngOnInit() {
        console.log('sections', this.policyTermFormGroup);
        console.log('insured data', this.insuredData);
        // this.policyTermFormGroup.get('branchCode').setValue(this.insuredData['branchCode']);
    }

    ngOnChanges(changes) {
        if (changes.hasOwnProperty('isEditable') && !this.isEditable) {
            Object.keys(this.policyTermFormGroup.controls).forEach(control => {
                this.policyTermFormGroup.get(control).disable();
            });
        } else if (changes.hasOwnProperty('isEditable') && this.isEditable) {
            Object.keys(this.policyTermFormGroup.controls).forEach(control => {
                this.policyTermFormGroup.get(control).enable();
            });
        }
    }

    onDataChanged(controlName, key, valueType, event) {
        console.log('checking data', controlName, key, valueType, event);
        if (controlName === 'branchCode') {
            this.insuredData[controlName] = event.target.value;
        } else {
            this.insuredData['applicationData']['paymentInfo'][controlName] = event.target.value;
        }

        console.log('policy information', this.insuredData);
    }

    onSelectionChanged(controlName, key, valueType, event) {
        this.insuredData[controlName] = event.value;
    }

    onDateChanged(controlName, key, valueType, event) {
        this.insuredData[controlName] = moment(new Date(event.value)).format('YYYY-MM-DD');
    }

    onRadioChange(controlName, key, valueType, event) {
        this.insuredData[controlName] = event.value;
    }
}
