import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-vehicle-details',
    templateUrl: './vehicle-details.component.html',
    styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailsComponent implements OnInit, OnChanges {

    months = [
        { id: '1', value: 'January' },
        { id: '2', value: 'February' },
        { id: '3', value: 'March' },
        { id: '4', value: 'April' },
        { id: '5', value: 'May' },
        { id: '6', value: 'June' },
        { id: '7', value: 'July' },
        { id: '8', value: 'August' },
        { id: '9', value: 'September' },
        { id: '10', value: 'October' },
        { id: '11', value: 'November' },
        { id: '12', value: 'December' }
    ];

    @Input() vehicleDetailsFormGroup: FormGroup;
    @Input() vehicleBodyDropdown = [];
    @Input() sections;
    @Input() loanTypeDropdown = [];
    @Input() vehicleInfo;
    @Input() isEditable = true;
    vehicleInfoCopy;

    ngOnInit() {
        this.vehicleInfoCopy = { ...this.vehicleInfo };
    }

    ngOnChanges(changes) {
        if (changes.hasOwnProperty('isEditable') && !this.isEditable && this.vehicleInfo) {
            Object.keys(this.vehicleDetailsFormGroup.controls).forEach(control => {
                this.vehicleDetailsFormGroup.get(control).disable();
            });
        } else if (changes.hasOwnProperty('isEditable') && this.isEditable) {
            Object.keys(this.vehicleDetailsFormGroup.controls).forEach(control => {
                this.vehicleDetailsFormGroup.get(control).enable();
            });
        }
    }

    onDataChanged(controlName, event) {
        this.vehicleInfo[controlName] = event.target.value;
    }

    onSelectionChanged(controlName, event) {
        this.vehicleInfo[controlName] = event.value;
    }

    onRadioChange(controlName, event) {
        this.vehicleInfo[controlName] = event.value;
    }
}
