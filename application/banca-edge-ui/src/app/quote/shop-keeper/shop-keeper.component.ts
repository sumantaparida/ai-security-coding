import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { LoaderService } from '@app/_services/loader.service';
import { QuoteService } from '../quote.service';

@Component({
  selector: 'app-shop-keeper',
  templateUrl: './shop-keeper.component.html',
  styleUrls: ['./shop-keeper.component.css'],
})
export class ShopKeeperComponent implements OnInit {
  fedVal;

  customerId;

  shopTypeMaster;

  occupancyType;

  quoteId;

  productKey = [];

  shopKeeperForm: FormGroup;

  existingQuoteId;

  finalQuote;

  quoteInput;

  coverObj = {};

  discountError = false;

  // shops = [
  //   { value: 'occp', viewValue: 'Occupancy' },
  //   { value: 'proId', viewValue: 'ProductId' },
  //   { value: 'orgCode', viewValue: 'OrgCode' },
  // ];

  buildingType = [
    { value: '1', viewValue: 'Puckka' },
    { value: '2', viewValue: 'Kutcha' },
  ];

  businessFl0pMonths = [
    { value: '3', viewValue: '3 Months' },
    { value: '6', viewValue: '6 Months' },
    { value: '9', viewValue: '9 Months' },
    { value: '12', viewValue: '12 Months' },
  ];

  paSumInsured = [
    { value: 0, viewValue: '0' },
    { value: 100000, viewValue: '100000' },
    { value: 200000, viewValue: '200000' },
    { value: 300000, viewValue: '300000' },
    { value: 400000, viewValue: '400000' },
    { value: 500000, viewValue: '500000' },
    { value: 600000, viewValue: '600000' },
    { value: 700000, viewValue: '700000' },
    { value: 800000, viewValue: '800000' },
    { value: 900000, viewValue: '900000' },
    { value: 1000000, viewValue: '1000000' },
  ];

  burgLoss = [
    { value: 25, viewValue: '25%' },
    { value: 50, viewValue: '50%' },
    { value: 75, viewValue: '75%' },
  ];

  isNoPolicyError: boolean;

  errorDetail: string;

  MyProp: any;

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private quoteService: QuoteService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.shopKeeperForm = new FormGroup({
      typeOfShop: new FormControl('', Validators.required),
      pincode: new FormControl('', [Validators.pattern('^[1-9][0-9]{5}$'), Validators.required]),
      building: new FormControl(''),
      buildingType: new FormControl(''),
      isElectrical: new FormControl('', Validators.required),
      electronicAppliance: new FormControl('', Validators.required),
      money: new FormControl('', Validators.required),
      plateGlass: new FormControl('', Validators.required),
      neonSign: new FormControl('', Validators.required),
      pedalCycle: new FormControl('', Validators.required),
      baggage: new FormControl('', Validators.required),
      portComp: new FormControl('', Validators.required),
      other: new FormControl({ value: 'Y', disabled: true }, Validators.required),
      pl: new FormControl('', Validators.required),
      fedility: new FormControl('', Validators.required),
      burglary: new FormControl('', Validators.required),
      lossPercent: new FormControl(''),
      // escalation: new FormControl('', Validators.required),
      searchCtrl: new FormControl(''),
      otherContent: new FormControl('', Validators.required),
      contentDesc: new FormControl(''),
      personalAccident: new FormControl('', Validators.required),
      discount: new FormControl('', Validators.required),
      discountValue: new FormControl('', Validators.required),
    });

    this.quoteService.getFromMaster('OccupancyType', 'BOM').subscribe((result) => {
      this.shopTypeMaster = result;
    });

    // this.oninitialSetValue();

    this.route.params.subscribe((params) => {
      this.customerId = params.customerId;

      if (params.quoteId) {
        this.existingQuoteId = params.quoteId;
        this.callQuoteApi();
      }
    });
  }

  recalFedValue() {
    if (this.shopKeeperForm.get('building').value === 'Y') {
      const totalCost =
        this.shopKeeperForm.get('areaOfBuilding').value *
        this.shopKeeperForm.get('costOfConstruct').value;
      this.fedVal = (totalCost + this.shopKeeperForm.get('otherContent').value) / 10;
    } else {
      this.fedVal = this.shopKeeperForm.get('otherContent').value / 10;
    }
    if (this.shopKeeperForm.get('fedility').value === 'Y') {
      this.shopKeeperForm.get('fedilitySum').setValue(this.fedVal);
    }
  }

  callQuoteApi() {
    this.quoteService.backToQuote(this.existingQuoteId).subscribe((finalQuoteRes) => {
      this.finalQuote = finalQuoteRes;
      this.quoteInput = this.finalQuote?.quoteInput;
      // this.quoteInput = this.finalQuote;
      // if route is from quote page
      this.setFormValue();
      this.oninitialSetValue();
    });
  }

  setFormValue() {
    this.shopKeeperForm.get('typeOfShop').setValue(this.quoteInput.occupancyType);
    this.shopKeeperForm.get('pincode').setValue(this.quoteInput.pincode);
    if (this.quoteInput.bldg) {
      this.shopKeeperForm.get('building').setValue('Y');
      this.shopKeeperForm.addControl(
        'buildingType',
        new FormControl('', [Validators.required, Validators.min(100), Validators.max(50000000)]),
      );
      this.shopKeeperForm.addControl(
        'areaOfBuilding',
        new FormControl('', [Validators.required, Validators.min(200), Validators.max(50000000)]),
      );
      this.shopKeeperForm.addControl(
        'costOfConstruct',
        new FormControl('', [Validators.required, Validators.min(1000), Validators.max(50000000)]),
      );
      this.shopKeeperForm.get('areaOfBuilding').setValue(this.quoteInput.bldg.area);
      this.shopKeeperForm.get('costOfConstruct').setValue(this.quoteInput.bldg.costofConstruction);
      this.shopKeeperForm.get('buildingType').setValue(this.quoteInput.bldg.typeOfConstruction);
    } else {
      this.shopKeeperForm.get('building').setValue('N');
    }
    if (this.quoteInput.discountValue) {
      this.shopKeeperForm.get('discount').setValue('Y');
      this.shopKeeperForm.get('discountValue').setValue(this.quoteInput.discountValue);
    } else {
      this.shopKeeperForm.get('discount').setValue('N');
    }
    // if (this.quoteInput.covers['type'] === 'AC') {
    //   this.shopKeeperForm.get('ac').setValue(this.quoteInput.covers[0].sa);
    // }
    this.shopKeeperForm.get('isElectrical').setValue('N');
    this.shopKeeperForm.get('electronicAppliance').setValue('N');
    this.shopKeeperForm.get('money').setValue('N');
    this.shopKeeperForm.get('plateGlass').setValue('N');
    this.shopKeeperForm.get('neonSign').setValue('N');
    this.shopKeeperForm.get('pedalCycle').setValue('N');
    this.shopKeeperForm.get('baggage').setValue('N');
    this.shopKeeperForm.get('portComp').setValue('N');
    this.shopKeeperForm.get('pl').setValue('N');
    this.shopKeeperForm.get('fedility').setValue('N');
    this.shopKeeperForm.get('personalAccident').setValue('N');
    // this.shopKeeperForm.get('discount').setValue('N');
    // this.shopKeeperForm.get('escalation').setValue('N');

    this.quoteInput.covers.forEach((cover) => {
      if (cover.type === 'AC') {
        this.shopKeeperForm.get('isElectrical').setValue('Y');
        // this.shopKeeperForm.addControl(
        //   'ac',
        //   new FormControl(cover.sa, [
        //     Validators.required,
        //     Validators.min(0),
        //     Validators.max(100000),
        //   ]),
        // );
        // this.shopKeeperForm.addControl(
        //   'portableGen',
        //   new FormControl('', [Validators.required, Validators.min(0), Validators.max(100000)]),
        // );
        // this.shopKeeperForm.addControl(
        //   'electricalEQP',
        //   new FormControl('', [Validators.required, Validators.min(0), Validators.max(100000)]),
        // );
        // this.shopKeeperForm.get('ac').setValue(this.quoteInput.covers.type['AC'].sa);
        // this.shopKeeperForm.get('portableGen').setValue(this.quoteInput.covers[0].sa);
        // this.shopKeeperForm.get('electricalEQP').setValue(this.quoteInput.covers[0].sa);
      } else if (cover.type === 'ELCEQP') {
        this.shopKeeperForm.get('electronicAppliance').setValue('Y');
      } else if (cover.type === 'CASHTRANSIT') {
        this.shopKeeperForm.get('money').setValue('Y');
      } else if (cover.type === 'GP') {
        this.shopKeeperForm.get('plateGlass').setValue('Y');
      } else if (cover.type === 'NEON') {
        this.shopKeeperForm.get('neonSign').setValue('Y');
      } else if (cover.type === 'CYCLE') {
        this.shopKeeperForm.get('pedalCycle').setValue('Y');
      } else if (cover.type === 'BAGG') {
        this.shopKeeperForm.get('baggage').setValue('Y');
      } else if (cover.type === 'LAPTOP') {
        this.shopKeeperForm.get('portComp').setValue('Y');
      } else if (cover.coverId === 'FAP' && cover.type === 'CONT') {
        this.shopKeeperForm.get('other').setValue('Y');
      } else if (cover.type === 'LL') {
        this.shopKeeperForm.get('pl').setValue('Y');
      } else if (cover.type === 'PERSON' && cover.coverId == 'FID') {
        this.shopKeeperForm.get('fedility').setValue('Y');
      } else if (cover.type === 'PERSON' && cover.coverId == 'PA') {
        this.shopKeeperForm.get('personalAccident').setValue('Y');
      }
      // else if (cover.type === 'BLDG') {
      //   this.shopKeeperForm.get('escalation').setValue('Y');
      // }
      else if (cover.coverId === 'BURG' && cover.type === 'CONT') {
        this.shopKeeperForm.get('burglary').setValue('N');
      }
    });
  }

  oninitialSetValue() {
    this.quoteInput?.covers.forEach((cover) => {
      if (this.coverObj.hasOwnProperty(cover.type)) {
        this.coverObj[cover.coverId] = cover.sa;
      } else {
        this.coverObj[cover.type] = cover.sa;
        if (cover.type === 'PERSON' || cover.type === 'CONT') {
          this.coverObj['noOfPerson'] = cover.noOfUnits;
          this.coverObj['desc'] = cover.desc;
        }
      }
    });

    Object.keys(this.shopKeeperForm.controls).forEach((control) => {
      if (control === 'isElectrical' && this.shopKeeperForm.get(control).value === 'Y') {
        this.shopKeeperForm.addControl(
          'ac',
          new FormControl(this.coverObj['AC'], [
            Validators.required,
            Validators.min(0),
            Validators.max(100000),
          ]),
        );
        this.shopKeeperForm.addControl(
          'portableGen',
          new FormControl(this.coverObj['GENSET'], [
            Validators.required,
            Validators.min(0),
            Validators.max(100000),
          ]),
        );
        this.shopKeeperForm.addControl(
          'electricalEQP',
          new FormControl(this.coverObj['ELCOTH'], [
            (Validators.required, Validators.min(0), Validators.max(100000)),
          ]),
        );
      } else if (control === 'electrical' && this.shopKeeperForm.get(control).value !== 'Y') {
        this.shopKeeperForm.removeControl('ac');
        this.shopKeeperForm.removeControl('portableGen');
        this.shopKeeperForm.removeControl('electricalEQP');
      } else if (
        control === 'electronicAppliance' &&
        this.shopKeeperForm.get(control).value === 'Y'
      ) {
        this.shopKeeperForm.addControl(
          'electronicApplianceValue',
          new FormControl(this.coverObj['ELCEQP'], [
            Validators.required,
            Validators.min(0),
            Validators.max(100000),
          ]),
        );
      } else if (control === 'electronicApp' && this.shopKeeperForm.get(control).value !== 'Y') {
        this.shopKeeperForm.removeControl('electronicApplianceValue');
      } else if (control === 'money' && this.shopKeeperForm.get(control).value === 'Y') {
        this.shopKeeperForm.addControl(
          'moneyinTrans',
          new FormControl(this.coverObj['CASHTRANSIT'], [
            Validators.required,
            Validators.min(0),
            Validators.max(100000),
          ]),
        );
        this.shopKeeperForm.addControl(
          'moneyinSafe',
          new FormControl(this.coverObj['CASHSAFE'], [
            Validators.required,
            Validators.min(0),
            Validators.max(100000),
          ]),
        );
        this.shopKeeperForm.addControl(
          'moneyinCounter',
          new FormControl(this.coverObj['CASHCOUNTER'], [
            Validators.required,
            Validators.min(0),
            Validators.max(100000),
          ]),
        );
      } else if (control === 'money' && this.shopKeeperForm.get(control).value !== 'Y') {
        this.shopKeeperForm.removeControl('moneyinTrans');
        this.shopKeeperForm.removeControl('moneyinSafe');
        this.shopKeeperForm.removeControl('moneyinCounter');
      } else if (control === 'plateGlass' && this.shopKeeperForm.get(control).value === 'Y') {
        this.shopKeeperForm.addControl(
          'plateGlassContent',
          new FormControl(this.coverObj['GP'], [
            Validators.required,
            Validators.min(0),
            Validators.max(500000),
          ]),
        );
      } else if (control === 'plateGlass' && this.shopKeeperForm.get(control).value !== 'Y') {
        this.shopKeeperForm.removeControl('plateGlassContent');
      } else if (control === 'neonSign' && this.shopKeeperForm.get(control).value === 'Y') {
        this.shopKeeperForm.addControl(
          'neonSignContent',
          new FormControl(this.coverObj['NEON'], [
            Validators.required,
            Validators.min(0),
            Validators.max(500000),
          ]),
        );
      } else if (control === 'neonSign' && this.shopKeeperForm.get(control).value !== 'Y') {
        this.shopKeeperForm.removeControl('neonSignContent');
      } else if (control === 'pedalCycle' && this.shopKeeperForm.get(control).value === 'Y') {
        this.shopKeeperForm.addControl(
          'pedalCycleContent',
          new FormControl(this.coverObj['CYCLE'], [
            Validators.required,
            Validators.min(1000),
            Validators.max(10000),
          ]),
        );
      } else if (control === 'pedal' && this.shopKeeperForm.get(control).value !== 'Y') {
        this.shopKeeperForm.removeControl('pedalCycleContent');
      } else if (control === 'baggage' && this.shopKeeperForm.get(control).value === 'Y') {
        this.shopKeeperForm.addControl(
          'baggageContent',
          new FormControl(this.coverObj['BAGG'], [
            Validators.required,
            Validators.min(0),
            Validators.max(10000),
          ]),
        );
      } else if (control === 'baggage' && this.shopKeeperForm.get(control).value !== 'Y') {
        this.shopKeeperForm.removeControl('baggageContent');
      } else if (control === 'portComp' && this.shopKeeperForm.get(control).value === 'Y') {
        this.shopKeeperForm.addControl(
          'portCompContent',
          new FormControl(this.coverObj['LAPTOP'], [
            Validators.required,
            Validators.min(0),
            Validators.max(1000000),
          ]),
        );
      } else if (control === 'portComp' && this.shopKeeperForm.get(control).value !== 'Y') {
        this.shopKeeperForm.removeControl('portCompContent');
      } else if (control === 'other' && this.shopKeeperForm.get(control).value === 'Y') {
        this.shopKeeperForm.get('otherContent').setValue(this.coverObj['CONT']);
        this.shopKeeperForm.get('contentDesc').setValue(this.coverObj['desc']);

        // this.shopKeeperForm.addControl(
        //   'otherContent',
        //   new FormControl(this.coverObj['LL'], Validators.required),
        // );
      } else if (control === 'other' && this.shopKeeperForm.get(control).value !== 'Y') {
        this.shopKeeperForm.removeControl('otherContent');
        this.shopKeeperForm.removeControl('contentDesc');
      } else if (control === 'pl' && this.shopKeeperForm.get(control).value === 'Y') {
        this.shopKeeperForm.addControl(
          'plSum',
          new FormControl(this.coverObj['LL'], [
            Validators.required,
            Validators.min(0),
            Validators.max(500000),
          ]),
        );
      } else if (control === 'pl' && this.shopKeeperForm.get(control).value !== 'Y') {
        this.shopKeeperForm.removeControl('plSum');
      } else if (control === 'fedility' && this.shopKeeperForm.get(control).value === 'Y') {
        this.shopKeeperForm.addControl(
          'fedilityNoEmp',
          new FormControl(this.coverObj['noOfPerson'], [
            Validators.required,
            Validators.min(0),
            Validators.max(25),
          ]),
        );
        this.shopKeeperForm.addControl(
          'fedilitySum',
          new FormControl({ value: this.coverObj['PERSON'], disabled: true }, [
            Validators.required,
            Validators.min(0),
            Validators.max(500000),
          ]),
        );
      } else if (control === 'fedility' && this.shopKeeperForm.get(control).value !== 'Y') {
        this.shopKeeperForm.removeControl('fedilityNoEmp');
        this.shopKeeperForm.removeControl('fedilitySum');
      } else if (control === 'burglary' && this.shopKeeperForm.get(control).value === 'Y') {
        this.shopKeeperForm.addControl('burglaryYes', new FormControl('', Validators.required));
        this.shopKeeperForm.removeControl('lossPercent');
      } else if (control === 'burglary' && this.shopKeeperForm.get(control).value !== 'Y') {
        this.shopKeeperForm.get('lossPercent').setValue(this.coverObj['BURG']);

        this.shopKeeperForm.removeControl('burglaryYes');

        // this.shopKeeperForm.addControl(
        //   'lossPercent',
        //   new FormControl(this.coverObj['CONT'], Validators.required),
        // );
      } else if (control == 'personalAccident' && this.shopKeeperForm.get(control).value === 'Y') {
        this.shopKeeperForm.addControl('pa', new FormControl('', Validators.required));
        this.shopKeeperForm.get('pa').setValue(this.coverObj['PA']);
      } else if (control == 'personalAccident' && this.shopKeeperForm.get(control).value !== 'Y') {
        this.shopKeeperForm.removeControl('pa');
      } else if (control == 'discount' && this.shopKeeperForm.get(control).value === 'Y') {
        this.shopKeeperForm.addControl('discountValue', new FormControl(''));
        this.shopKeeperForm.get('discountValue').setValue(this.quoteInput.discountValue);
      } else if (control == 'discount' && this.shopKeeperForm.get(control).value !== 'Y') {
        this.shopKeeperForm.removeControl('discountValue');
      }
    });
  }

  onRadioChange(event, type: string) {
    const selectedValue = event.value;
    if (type === 'electrical' && selectedValue === 'Y') {
      this.shopKeeperForm.addControl(
        'ac',
        new FormControl('', [Validators.required, Validators.min(100), Validators.max(50000000)]),
      );
      this.shopKeeperForm.addControl(
        'portableGen',
        new FormControl('', [Validators.required, Validators.min(1000), Validators.max(50000000)]),
      );
      this.shopKeeperForm.addControl(
        'electricalEQP',
        new FormControl('', [Validators.required, Validators.min(1000), Validators.max(50000000)]),
      );
    } else if (type === 'electrical' && selectedValue !== 'Y') {
      this.shopKeeperForm.removeControl('ac');
      this.shopKeeperForm.removeControl('portableGen');
      this.shopKeeperForm.removeControl('electricalEQP');
    } else if (type === 'building' && selectedValue === 'Y') {
      this.shopKeeperForm.addControl(
        'areaOfBuilding',
        new FormControl('', [Validators.required, Validators.min(200), Validators.max(50000000)]),
      );
      this.shopKeeperForm.addControl(
        'costOfConstruct',
        new FormControl('', [Validators.required, Validators.min(1000), Validators.max(50000000)]),
      );
    } else if (type === 'building' && selectedValue !== 'Y') {
      this.shopKeeperForm.removeControl('areaOfBuilding');
      this.shopKeeperForm.removeControl('costOfConstruct');
    } else if (type === 'electronicApp' && selectedValue === 'Y') {
      this.shopKeeperForm.addControl(
        'electronicApplianceValue',
        new FormControl('', [Validators.required, Validators.min(0), Validators.max(100000)]),
      );
    } else if (type === 'electronicApp' && selectedValue !== 'Y') {
      this.shopKeeperForm.removeControl('electronicApplianceValue');
    } else if (type === 'money' && selectedValue === 'Y') {
      this.shopKeeperForm.addControl(
        'moneyinTrans',
        new FormControl('', [Validators.required, Validators.min(1000), Validators.max(10000000)]),
      );
      this.shopKeeperForm.addControl(
        'moneyinSafe',
        new FormControl('', [Validators.required, Validators.min(1000), Validators.max(10000000)]),
      );
      this.shopKeeperForm.addControl(
        'moneyinCounter',
        new FormControl('', [Validators.required, Validators.min(1000), Validators.max(10000000)]),
      );
    } else if (type === 'money' && selectedValue !== 'Y') {
      this.shopKeeperForm.removeControl('moneyinTrans');
      this.shopKeeperForm.removeControl('moneyinSafe');
      this.shopKeeperForm.removeControl('moneyinCounter');
    } else if (type === 'plateGlass' && selectedValue === 'Y') {
      this.shopKeeperForm.addControl(
        'plateGlassContent',
        new FormControl('', [Validators.required, Validators.min(1000), Validators.max(10000000)]),
      );
    } else if (type === 'plateGlass' && selectedValue !== 'Y') {
      this.shopKeeperForm.removeControl('plateGlassContent');
    } else if (type === 'neonSign' && selectedValue === 'Y') {
      this.shopKeeperForm.addControl(
        'neonSignContent',
        new FormControl('', [Validators.required, Validators.min(0), Validators.max(500000)]),
      );
    } else if (type === 'neonSign' && selectedValue !== 'Y') {
      this.shopKeeperForm.removeControl('neonSignContent');
    } else if (type === 'pedal' && selectedValue === 'Y') {
      this.shopKeeperForm.addControl(
        'pedalCycleContent',
        new FormControl('', [Validators.required, Validators.min(1000), Validators.max(10000)]),
      );
    } else if (type === 'pedal' && selectedValue !== 'Y') {
      this.shopKeeperForm.removeControl('pedalCycleContent');
    } else if (type === 'baggage' && selectedValue === 'Y') {
      this.shopKeeperForm.addControl(
        'baggageContent',
        new FormControl('', [Validators.required, Validators.min(0), Validators.max(10000)]),
      );
    } else if (type === 'baggage' && selectedValue !== 'Y') {
      this.shopKeeperForm.removeControl('baggageContent');
    } else if (type === 'portComp' && selectedValue === 'Y') {
      this.shopKeeperForm.addControl(
        'portCompContent',
        new FormControl('', [Validators.required, Validators.min(0), Validators.max(1000000)]),
      );
    } else if (type === 'portComp' && selectedValue !== 'Y') {
      this.shopKeeperForm.removeControl('portCompContent');
    } else if (type === 'pl' && selectedValue === 'Y') {
      this.shopKeeperForm.addControl(
        'plSum',
        new FormControl('', [Validators.required, Validators.min(0), Validators.max(500000)]),
      );
    } else if (type === 'pl' && selectedValue !== 'Y') {
      this.shopKeeperForm.removeControl('plSum');
    } else if (type === 'fidelity' && selectedValue === 'Y') {
      let fedVal;
      if (this.shopKeeperForm.get('building').value === 'Y') {
        const totalCost =
          this.shopKeeperForm.get('areaOfBuilding').value *
          this.shopKeeperForm.get('costOfConstruct').value;
        fedVal = (totalCost + this.shopKeeperForm.get('otherContent').value) / 10;
      } else {
        fedVal = this.shopKeeperForm.get('otherContent').value / 10;
      }
      this.shopKeeperForm.addControl(
        'fedilityNoEmp',
        new FormControl('', [Validators.required, Validators.min(0), Validators.max(25)]),
      );
      this.shopKeeperForm.addControl(
        'fedilitySum',
        new FormControl({ value: fedVal, disabled: true }, [
          Validators.required,
          Validators.min(0),
          Validators.max(500000),
        ]),
      );
    } else if (type === 'fidelity' && selectedValue !== 'Y') {
      this.shopKeeperForm.removeControl('fedilityNoEmp');
      this.shopKeeperForm.removeControl('fedilitySum');
    } else if (type === 'burglary' && selectedValue === 'Y') {
      this.shopKeeperForm.removeControl('lossPercent');
    } else if (type === 'burglary' && selectedValue !== 'Y') {
      this.shopKeeperForm.addControl(
        'lossPercent',
        new FormControl('', [Validators.required, Validators.min(0), Validators.max(500000)]),
      );
    } else if (type === 'personalAccident' && selectedValue === 'Y') {
      this.shopKeeperForm.addControl('pa', new FormControl('', Validators.required));
    } else if (type === 'personalAccident' && selectedValue !== 'Y') {
      this.shopKeeperForm.removeControl('pa');
    } else if (type === 'discount' && selectedValue === 'Y') {
      this.shopKeeperForm.addControl('discountValue', new FormControl('', Validators.required));
    } else if (type === 'discount' && selectedValue !== 'Y') {
      this.shopKeeperForm.removeControl('discountValue');
    }
  }

  generateQuote() {
    this.checkDiscountLoading();
    if (!this.discountError) {
      Object.keys(this.shopKeeperForm.controls).forEach(() => {});

      const reqBody = {
        lob: 'Fire',
        customerId: this.customerId,
        productType: 'Shop',
        insuranceType: 3,
        occupancyType: this.shopKeeperForm.get('typeOfShop').value,
        pincode: this.shopKeeperForm.get('pincode').value,
        pt: 1,
        ppt: 1,
        // bldg: {
        //   age: 1,
        //   year: 1,
        //   costofConstruction: this.shopKeeperForm.get('costOfConstruct').value,
        //   area: this.shopKeeperForm.get('areaOfBuilding').value,
        //   sa:
        //     this.shopKeeperForm.get('areaOfBuilding').value *
        //     this.shopKeeperForm.get('costOfConstruct').value,

        //   typeOfConstruction: this.shopKeeperForm.get('buildingType').value,
        // },
        covers: [],
      };

      if (this.shopKeeperForm.get('building').value === 'Y') {
        reqBody['insuranceType'] = 1;
      }

      if (this.shopKeeperForm.get('discount').value === 'Y') {
        reqBody['discountValue'] = this.shopKeeperForm.get('discountValue').value;
      } else {
        reqBody['discountValue'] = 0;
      }

      if (this.shopKeeperForm.get('building').value === 'Y') {
        const bldgObj = {
          age: 1,
          year: 1,
          costofConstruction: this.shopKeeperForm.get('costOfConstruct').value,
          area: this.shopKeeperForm.get('areaOfBuilding').value,
          sa:
            this.shopKeeperForm.get('areaOfBuilding').value *
            this.shopKeeperForm.get('costOfConstruct').value,

          typeOfConstruction: this.shopKeeperForm.get('buildingType').value,
        };
        reqBody['bldg'] = bldgObj;
      }

      if (this.shopKeeperForm.get('electronicAppliance').value === 'Y') {
        reqBody.covers.push({
          type: 'ELCEQP',
          sa: this.shopKeeperForm.get('electronicApplianceValue').value,
          coverId: 'FAP',
        });
      }
      if (this.shopKeeperForm.get('isElectrical').value === 'Y') {
        reqBody.covers.push(
          {
            type: 'AC',
            sa: this.shopKeeperForm.get('ac').value,
            coverId: 'FAP',
          },
          {
            type: 'GENSET',
            sa: this.shopKeeperForm.get('portableGen').value,
            coverId: 'FAP',
          },
          {
            type: 'ELCOTH',
            sa: this.shopKeeperForm.get('electricalEQP').value,
            coverId: 'FAP',
          },
        );
      }
      if (this.shopKeeperForm.get('money').value === 'Y') {
        reqBody.covers.push(
          {
            type: 'CASHTRANSIT',
            sa: this.shopKeeperForm.get('moneyinTrans').value,
            coverId: 'FAP',
          },
          {
            type: 'CASHCOUNTER',
            sa: this.shopKeeperForm.get('moneyinCounter').value,
            coverId: 'FAP',
          },
          {
            type: 'CASHSAFE',
            sa: this.shopKeeperForm.get('moneyinSafe').value,
            coverId: 'FAP',
          },
        );
      }
      if (this.shopKeeperForm.get('plateGlass').value === 'Y') {
        reqBody.covers.push({
          type: 'GP',
          sa: this.shopKeeperForm.get('plateGlassContent').value,
          coverId: 'FAP',
        });
      }
      if (this.shopKeeperForm.get('neonSign').value === 'Y') {
        reqBody.covers.push({
          type: 'NEON',
          sa: this.shopKeeperForm.get('neonSignContent').value,
          coverId: 'FAP',
        });
      }
      if (this.shopKeeperForm.get('pedalCycle').value === 'Y') {
        reqBody.covers.push({
          type: 'CYCLE',
          sa: this.shopKeeperForm.get('pedalCycleContent').value,
          coverId: 'FAP',
        });
      }
      if (this.shopKeeperForm.get('baggage').value === 'Y') {
        reqBody.covers.push({
          type: 'BAGG',
          sa: this.shopKeeperForm.get('baggageContent').value,
          coverId: 'FAP',
        });
      }
      if (this.shopKeeperForm.get('portComp').value === 'Y') {
        reqBody.covers.push({
          type: 'LAPTOP',
          sa: this.shopKeeperForm.get('portCompContent').value,
          coverId: 'FAP',
        });
      }
      if (this.shopKeeperForm.get('other').value === 'Y') {
        reqBody.covers.push({
          type: 'CONT',
          sa: this.shopKeeperForm.get('otherContent').value,
          coverId: 'FAP',
          desc: this.shopKeeperForm.get('contentDesc').value,
        });
      }

      if (this.shopKeeperForm.get('pl').value === 'Y') {
        reqBody.covers.push({
          type: 'LL',
          sa: this.shopKeeperForm.get('plSum').value,
          coverId: 'LL',
        });
      }

      if (this.shopKeeperForm.get('fedility').value === 'Y') {
        reqBody.covers.push({
          type: 'PERSON',
          sa: this.shopKeeperForm.get('fedilitySum').value,
          coverId: 'FID',
          noOfUnits: this.shopKeeperForm.get('fedilityNoEmp').value,
        });
      }

      if (this.shopKeeperForm.get('burglary').value === 'Y') {
        reqBody.covers.push({
          type: 'CONT',
          coverId: 'BURG',
          sa: 100,
        });
      } else if (this.shopKeeperForm.get('burglary').value !== 'Y') {
        reqBody.covers.push({
          type: 'CONT',
          coverId: 'BURG',
          sa: this.shopKeeperForm.get('lossPercent').value,
        });
      }

      if (this.shopKeeperForm.get('personalAccident').value === 'Y') {
        reqBody.covers.push({
          type: 'PERSON',
          sa: this.shopKeeperForm.get('pa').value,
          coverId: 'PA',
          noOfUnits: 1,
        });
      }

      // if (this.shopKeeperForm.get('escalation').value === 'Y') {
      //   reqBody.covers.push({
      //     type: 'BLDG',
      //     coverId: 'ESCL',
      //   });
      // }

      this.quoteService.generateQuote(reqBody).subscribe(
        (result) => {
          const quote = result;
          this.quoteId = quote['quoteId'];
          if (quote['numQuotesExpected'] > 0) {
            this.loaderService.showSpinner(false);

            //  this.router.navigate(['quote/quote-result'], { queryParams: { quoteId: this.quoteId } });
            this.router.navigate(['quote/quote-result', this.quoteId]);
            // this.quoteService.getHealthQuote(quote['quoteId']).subscribe(finalQuote => {
            // });
          } else if (quote['numQuotesExpected'] == 0) {
            this.loaderService.showSpinner(false);

            this.isNoPolicyError = true;
            this.errorDetail =
              'Oops.. We could not find any policies for you. you may have to adjust your search criteria.';
            this.MyProp.nativeElement.scrollIntoView({ behavior: 'smooth' });
          }
        },
        (error) => {
          this.loaderService.showSpinner(false);
          // this.isErrorMsg = true;
          // console.log('error kav', error);
          this.isNoPolicyError = true;
          if (error.error.details !== '') {
            this.errorDetail = error.error.details;
          } else if (error.error.message !== '') {
            this.errorDetail = error.error.message;
          } else if (error.error.error) {
            this.errorDetail = error.error.error;
          } else {
            this.errorDetail =
              'Oops.. We could not find any policies for you. you may have to adjust your search criteria.';
          }
          this.MyProp.nativeElement.scrollIntoView({ behavior: 'smooth' });
        },
      );
    }
  }

  onShopChange(event) {
    this.occupancyType = event.value;
  }

  checkDiscountLoading() {
    const discountOption = this.shopKeeperForm.get('discount').value;
    const discountValue = this.shopKeeperForm.get('discountValue')?.value;
    const discountDecimalVal = discountValue?.toString().split('.')[1]?.length;
    let messageError = false;
    if (discountOption === 'Y') {
      if (discountValue === 0 || discountDecimalVal > 2) {
        messageError = true;
      } else if (discountValue > 60 || discountDecimalVal > 2) {
        messageError = true;
      } else if (discountDecimalVal > 2) {
        messageError = true;
      } else {
        messageError = false;
      }
    }
    if (messageError) {
      this.discountError = true;
      const message =
        'Values Cannot be set to 0, Allowed Values are from 0.01 to 60 for Discount and from -0.01 for Loading ';

      const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
        data: message,
        panelClass: 'dialog-width',
      });
      dialogRef.afterClosed().subscribe(() => {
        // navigate
      });
    } else {
      this.discountError = false;
    }
  }
}
