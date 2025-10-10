import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.css'],
})
export class HelpPageComponent implements OnInit {
  user;

  orgCode;

  pdfArr = [
    // { img: '../../../../assets/logos/future-generali.svg', name: 'Future Generali', subtitle: 'Total Insurance Solution', question: 'Future Generali- Insurer flow', value: 'fgInsurer' },

    {
      img: '../../../../assets/logos/future-generali.svg',
      name: 'Future Generali',
      subtitle: 'Total Insurance Solution',
      question: 'Future Generali - Health',
      value: 'fgHealth',
    },
    {
      img: '../../../../assets/logos/future-generali.svg',
      name: 'Future Generali',
      subtitle: 'Total Insurance Solution',
      question: 'Future Generali - Motor',
      value: 'fgMotor',
    },
    {
      img: '../../../../assets/logos/future-generali.svg',
      name: 'Future Generali',
      subtitle: 'Total Insurance Solution',
      question: 'Future Generali - Travel',
      value: 'fgTravel',
    },
    {
      img: '../../../../assets/logos/future-generali.svg',
      name: 'Future Generali',
      subtitle: 'Total Insurance Solution',
      question: 'Future Generali - Personal Accident',
      value: 'fgPa',
    },
    {
      img: '../../../../assets/logos/future-generali.svg',
      name: 'Future Generali',
      subtitle: 'Total Insurance Solution',
      question: 'SP Approval',
      value: 'spApproval',
    },
    {
      img: '../../../../assets/logos/future-generali.svg',
      name: 'Future Generali',
      subtitle: 'Total Insurance Solution',
      question: 'Payment Approval',
      value: 'paymentApproval',
    },

    // { img: '../../../../assets/logos/manipal-cigna.svg', name: 'ManipalCigna', subtitle: 'Health Insurance', question: 'Manipal Cigna - Insurer Flow', value: 'manipalInsurer' },

    {
      img: '../../../../assets/logos/manipal-cigna.svg',
      name: 'ManipalCigna',
      subtitle: 'Health Insurance',
      question: 'Manipal Cigna - Health',
      value: 'manipalHealth',
    },

    {
      img: '../../../../assets/logos/manipal-cigna.svg',
      name: 'ManipalCigna',
      subtitle: 'Health Insurance',
      question: 'Manipal Cigna - Personal Accident',
      value: 'manipalPa',
    },
    {
      img: '../../../../assets/logos/lic.svg',
      name: 'LIC',
      subtitle: 'Life Insurance',
      question: 'LIC - Life',
      value: 'licLife',
    },
  ];

  constructor(private accountService: AccountService) {
    this.accountService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.orgCode = this.user.organizationCode;
    if (this.user?.insurerUser) {
      console.log('inside true', this.user?.insurerId);
      if (this.user?.insurerId === 132) {
        this.pdfArr.push({
          img: '../../../../assets/logos/future-generali.svg',
          name: 'Future Generali',
          subtitle: 'Total Insurance Solution',
          question: 'Future Generali- Insurer flow',
          value: 'fgInsurer',
        });
      } else if (this.user?.insurerId === 151) {
        console.log('inside 151');
        this.pdfArr.push({
          img: '../../../../assets/logos/manipal-cigna.svg',
          name: 'ManipalCigna',
          subtitle: 'Health Insurance',
          question: 'Manipal Cigna - Insurer Flow',
          value: 'manipalInsurer',
        });
      }
    }
  }

  downloadPdf(insurer) {
    if (insurer === 'manipalHealth') {
      window.open(
        'https://s3.amazonaws.com/lastdecimal.brokeredge.data/brochure/Manipal_Cigna_Health_PDF_13_10.pdf',
        '_blank',
      );
    } else if (insurer === 'manipalPa') {
      window.open(
        'https://s3.amazonaws.com/lastdecimal.brokeredge.data/brochure/Manipal_Cigna_PA_13_10.pdf',
        '_blank',
      );
    } else if (insurer === 'manipalInsurer') {
      window.open(
        'https://s3.amazonaws.com/lastdecimal.brokeredge.data/brochure/Manipal_cigna_Insurer_flow_29_09.pdf',
        '_blank',
      );
    } else if (insurer === 'fgHealth') {
      window.open(
        'https://s3.amazonaws.com/lastdecimal.brokeredge.data/brochure/Future_Generali-Health_13_10.pdf',
        '_blank',
      );
    } else if (insurer === 'fgPa') {
      window.open(
        'https://s3.amazonaws.com/lastdecimal.brokeredge.data/brochure/Future_Generali_Personal_Accident_13_10.pdf',
        '_blank',
      );
    } else if (insurer === 'fgTravel') {
      window.open(
        'https://s3.amazonaws.com/lastdecimal.brokeredge.data/brochure/Future_Generali_Travel_13_10.pdf',
        '_blank',
      );
    } else if (insurer === 'fgMotor') {
      window.open(
        'https://s3.amazonaws.com/lastdecimal.brokeredge.data/brochure/Future_Generali_Motor_13_10.pdf',
        '_blank',
      );
    } else if (insurer === 'spApproval') {
      window.open(
        'https://s3.amazonaws.com/lastdecimal.brokeredge.data/brochure/SP_Approval.pdf',
        '_blank',
      );
    } else if (insurer === 'fgInsurer') {
      window.open(
        'https://s3.amazonaws.com/lastdecimal.brokeredge.data/brochure/FG_Insurer_Flow_28_09.pdf',
        '_blank',
      );
    } else if (insurer === 'paymentApproval') {
      window.open(
        'https://s3.amazonaws.com/lastdecimal.brokeredge.data/brochure/Payment_Approval.pdf',
        '_blank',
      );
    } else if (insurer === 'licLife') {
      window.open(
        'https://s3.amazonaws.com/lastdecimal.brokeredge.data/brochure/LIC_Life_13_10.pdf',
        '_blank',
      );
    }
  }
}
