import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({ name: 'displaySectionAndFormPipe' }) 
export class DisplaySectionAndFormPipe implements PipeTransform {
  transform(
    controlValue,
    controlName,
  ): boolean {
    console.log('controlValue',controlValue);
    console.log('controlName',controlName);

   return true
  }
}
