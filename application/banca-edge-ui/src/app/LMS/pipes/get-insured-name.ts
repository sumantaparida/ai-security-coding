import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Pipe({ name: 'getInsuredName' })
export class GetInsuredName implements PipeTransform {

    transform(insureds: any[], insuredCode): string {
        return insureds.find(insured => insured.id === insuredCode).name;
    }

}
