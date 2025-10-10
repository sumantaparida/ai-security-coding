import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from '@app/mycustomers/services/customers.service';
import * as moment from 'moment';
import { QuoteService } from '../quote.service';

@Component({
  selector: 'app-quote-through-qr',
  templateUrl: './quote-through-qr.component.html',
  styleUrls: ['./quote-through-qr.component.css'],
})
export class QuoteThroughQrComponent implements OnInit {
  quoteForm: FormGroup;

  eighteenYearsAgo: Date;

  seventyYearsAgo: Date;

  customerDetails;

  productId;

  cifNo;

  planDetails = [
    {
      basePremium: 127,
      gst: 23,
      planName: 'Bronze',
      netPremium: 127,
      planId: 1,
      premium: 150,
      sa: 500000,
    },
    {
      basePremium: 254,
      gst: 46,
      planName: 'Silver',
      netPremium: 254,
      planId: 2,
      premium: 300,
      sa: 750000,
    },
    {
      basePremium: 424,
      gst: 76,
      planName: 'Gold',
      netPremium: 424,
      planId: 3,
      premium: 500,
      sa: 1000000,
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customersService: CustomersService,
    private quoteService: QuoteService,
  ) {}

  ngOnInit(): void {
    this.quoteForm = new FormGroup({
      plan: new FormControl('', Validators.required),
    });
    this.route.params.subscribe((param) => {
      if (param.cifNo) {
        this.cifNo = param.cifNo;
      }
      if (param.productId) {
        this.productId = param.productId;
      }
    });
    this.customersService.getCustomerByCif(this.cifNo).subscribe((customer) => {
      this.customerDetails = customer;
    });
  }

  onBuyNowClicked() {
    const randomQuoteId = this.getRandomString(32);
    const selectedPlan = this.planDetails.find(
      (plan) => plan.planId === this.quoteForm.get('plan').value,
    );
    console.log('randomQuoteId', randomQuoteId);
    console.log('selectedPlan', selectedPlan);
    const reqBody = {
      customerId: this.customerDetails.customerId,
      lob: 'Health',
      productType: 'PA',
      productId: this.productId,
      planId: selectedPlan.planId,
      productName: 'ManipalCigna Lifestyle Protection Group Policy',
      insurerId: 151,
      insurerName: 'ManipalCigna',
      pt: 1,
      ppt: 1,
      selectedMode: 0,
      sa: selectedPlan.sa, // Bronze 500000, Silver 750000, Gold: 1000000
      pb: {
        basePremium: selectedPlan.basePremium, // Bronze 914, Silver 1265, Gold: 1576
        gst: selectedPlan.gst, // Bronze 165, Silver 228, Gold: 284
        totalPremium: selectedPlan.premium, // Bronze 1079, Silver 1493, Gold: 1860
        base: [
          {
            coverId: 'HOSP',
            displayName: 'Base Cover',
            sa: 0,
            netPremium: selectedPlan.netPremium, // Bronze 914, Silver 1265, Gold: 1576
            premium: selectedPlan.premium, // Bronze 1079, Silver 1493, Gold: 1860
            selected: true,
          },
        ],
        addon: [],
      },
      quoteInput: {
        customerId: this.customerDetails.customerId,
        lob: 'Health',
        productType: 'PA',
        quoteId: randomQuoteId, // Add any randon string seq
        sa: selectedPlan.sa, // Bronze 500000, Silver 750000, Gold: 1000000
        deductible: 0,
        tenure: 1,
        pincode: this.customerDetails.addressList[0].postalcode,
        dogh: true,
        members: [
          {
            dob: this.customerDetails.dob,
            gender: this.customerDetails.gender,
            relationshipId: 1,
            rating: 'NS',
            sa: selectedPlan.sa,
          },
        ],
      },
    };
    console.log('reqBody', reqBody);
    this.quoteService.createHealthApplication(this.productId, reqBody).subscribe((res) => {
      this.router.navigate(['proposal', this.productId, res['applicationNo'], 'Long']);
    });
  }

  getRandomString(length) {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }
}
