import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hepInfo',
})
export class HelpInfoPipe implements PipeTransform {
  transform(element): helpDesc[] {
    let description = [];
    if(element['productType'] === 'GC'){
        switch (element?.insurerCode) {
            case 134:
              description = USGIStatus;
              break;
            case 113:
              description = BajajStatus;
              break;
            case 130:
              description = BaxaStatus;
              break;
      
            default:
              break;
          }
    } else {
        switch (element?.insurerCode) {
            case 134:
              description = USGIStatus;
              break;
            case 113:
              description = BajajStatus;
              break;
            case 130:
              description = BaxaStatus;
              break;
      
            default:
              break;
          }
    }
   

    return description;
  }
}

interface helpDesc {
  status?: string;
  description?: string;
}

const BaxaStatus: helpDesc[] = [
    { status: 'New Business User', description: 'Verification in progress' }, 
    { status: 'Pending Document', description: 'Documents are Pending. Please contact sales Team to complete the requirement.' },
    { status: 'Branch User', description: 'Documents are getting verified' }, 
    { status: 'Medical TPA', description: 'Medicals required.Please contact sales Team to cordinate and complete the requirement.' }, 
    { status: 'Underwriting', description: 'Case is awaiting underwriters decision' }, 
    { status: 'Payment Pending',description: 'Payment is Pending' },
    { status: 'Payment Collected', description: 'Payment collection completed' }, 
    { status: 'Policy Status', description: 'Final Policy Status' }, 

];
const BajajStatus: helpDesc[] = [
];
const USGIStatus: helpDesc[] = [];
