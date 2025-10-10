import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displaySectionPipe',
})
export class DisplaySectionPipe implements PipeTransform {
  transform(
    applicationDetails:any,
    section: any,
    insurerId:any,
  ): boolean {
    console.log(applicationDetails,insurerId)
       if(!section.isArray){
        if(section.displayByInsurer && section.displayByInsurer?.length > 0){
          // console.log(insurerId,section.displayByInsurer?.includes(insurerId) )
          return  section.displayByInsurer?.includes(insurerId) ? applicationDetails[section.detailsKey] ? true : false : false;
        } else {
          return applicationDetails[section.detailsKey] ? true : false
        }
       }
       if(applicationDetails[section.detailsKey].length > 0 && applicationDetails[section.detailsKey].every(val => val ? val : false)){
            return true
       }
       return false
  }

  
}