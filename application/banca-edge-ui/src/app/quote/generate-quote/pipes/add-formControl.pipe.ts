import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Pipe({ name: 'addFormControl' })
export class AddFormControlPipe implements PipeTransform {
    transform(formData, formValue) {
        // console.log('pronting formadata in nw pipe', formData, formValue);
        // const formGroup = {};
        // let form: FormGroup;

        const toSend = formData.filter(element => {
            if (!element?.isDependant) {
                // console.log('inside ifcomditomn', element)
                return element;
            } else {
                const controlName = element.dependsOnConrtol;
                if (element?.dependsOnValue.findIndex(val => val === formValue[controlName]) > -1) {
                    console.log('control.name new pipe', formValue[controlName]);
                    return element;
                } else {
                    return element;
                }
                // return false;
            }
        });
        console.log('tosend', toSend);
        return toSend;
        // throw new Error('Method not implemented.');
        // ...args: any[]
    }
}