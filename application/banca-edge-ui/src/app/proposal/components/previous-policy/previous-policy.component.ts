import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-previous-policy',
    templateUrl: './previous-policy.component.html',
    styleUrls: ['./previous-policy.component.css']
})
export class PreviousPolicyComponent implements OnInit, OnChanges {

    @Input() previouPolicyFormGroup: FormGroup;
    @Input() isEditable = true;
    @Input() prevInsurance;
    @Input() sections;

    ngOnInit() {
    }

    ngOnChanges(changes) {
        if (changes.hasOwnProperty('isEditable') && !this.isEditable) {
            Object.keys(this.previouPolicyFormGroup.controls).forEach(control => {
                this.previouPolicyFormGroup.get(control).disable();
            });
        } else if (changes.hasOwnProperty('isEditable') && this.isEditable) {
            Object.keys(this.previouPolicyFormGroup.controls).forEach(control => {
                this.previouPolicyFormGroup.get(control).enable();
            });
        }
    }

    onDataChanged(controlName, event) {
        this.prevInsurance[controlName] = event.target.value;
    }

    onSelectionChanged(controlName, options, event) {
        this.prevInsurance[controlName] = event.value;
        this.prevInsurance['insurerName'] = options.find(option => option.id === event.value).value;
    }

    onRadioChange(controlName, event) {
        this.prevInsurance[controlName] = event.value;
    }
}
