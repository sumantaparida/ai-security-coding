import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'optionValueChange',
})
export class OptionValueChangePipe implements PipeTransform {
  transform(options: any[], formData, checkVal): any[] {
    console.log(checkVal);
    // console.log(options);
    // console.log(medicalformGroup);
    if (formData.optionValChange) {
      if (checkVal !== false && checkVal !== '') {
        const requiredOption = formData.optionValuesLimits.find((optionValue) => {
          return optionValue.frequency === checkVal;
        }).options;
        // console.log(requiredOption);
        options = requiredOption;
        return options;
      }
    } else {
      // console.log('outer array');
      return options;
    }
  }
}
