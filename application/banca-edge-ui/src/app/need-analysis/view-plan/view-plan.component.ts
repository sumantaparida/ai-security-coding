import { Component, OnInit, Input } from '@angular/core';
import { UserDataService } from '../user-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import { MediaObserver } from '@angular/flex-layout';
import { query } from '@angular/animations';
import { LoaderService } from '@app/_services/loader.service';
import { AccountService } from '@app/_services';
import { aesDecrypt } from '@app/shared/utils/aesEncrypt';

@Component({
  selector: 'app-view-plan',
  templateUrl: './view-plan.component.html',
  styleUrls: ['./view-plan.component.css'],
})
export class ViewPlanComponent implements OnInit {
  customerId;

  selectedPriority: string;

  colorClass;

  currentCustomer;

  orgCode;

  planPriorities = [
    { name: 'Must Have', id: 3, checked: false },
    { name: 'Important', id: 2, checked: true },
    { name: 'Consider', id: 1, checked: true },
    { name: 'Not Needed', id: 0, checked: true },
  ];

  insuranceProducts = [
    {
      name: 'Child Education',
      score: 0,
      value: 'childEducation',
      img: '../../../assets/images/Child_Education_ICON_og.svg',
    },
    {
      name: 'Critical Illness',
      score: 0,
      value: 'ci',
      img: '../../../assets/images/Critical_illness_ICON.svg',
    },
    { name: 'Cyber Theft', score: 0, value: 'cyber', img: '../../../assets/icons/cyber_theft.svg' },
    {
      name: 'Health Insurance',
      score: 0,
      value: 'health',
      img: '../../../assets/images/Health_Hospi_ICON.svg',
    },
    {
      name: 'Home Insurance',
      score: 0,
      value: 'home',
      img: '../../../assets/images/Home_Insurance_ICON.svg',
    },
    {
      name: 'Regular Income',
      score: 0,
      value: 'income',
      img: '../../../assets/images/Regular_Income_ICON.svg',
    },
    {
      name: 'Protection',
      score: 0,
      value: 'protection',
      img: '../../../assets/images/Protection_ICON.svg',
    },
    {
      name: 'Saving Traditional',
      score: 0,
      value: 'savings',
      img: '../../../assets/images/Savings Traditional_ICON.svg',
    },
    {
      name: 'Saving Unit Linked',
      score: 0,
      value: 'ulip',
      img: '../../../assets/images/Saving_Unit_Linked_ICON_og.svg',
    },
    {
      name: 'Car',
      score: 0,
      value: 'car',
      img: '../../../assets/images/Car_Insurance_ICON_og.svg',
    },
    {
      name: 'Two Wheeler',
      score: 0,
      value: '2w',
      img: '../../../assets/icons/quick-quote/two_wheeler.svg',
    },
    {
      name: 'Travel',
      score: 0,
      value: 'travel',
      img: '../../../assets/icons/quick-quote/travel.svg',
    },
    {
      name: 'Personal Accident',
      score: 0,
      value: 'pa',
      img: '../../../assets/icons/quick-quote/personal_accident.svg',
    },
    {
      name: 'Life Annuity',
      score: 0,
      value: 'ann',
      img: '../../../assets/images/Saving_Unit_Linked_ICON_og.svg',
    },
    // {
    //   name: 'Fire Insurance',
    //   score: 0,
    //   value: 'sme',
    //   img: '../../../assets/icons/quick-quote/standard_fire_special_perils.svg',
    // },
    {
      name: 'Shop Keeper',
      score: 0,
      value: 'sme',
      img: '../../../assets/images/Home_Insurance_ICON.svg',
    },
    {
      name: 'Offline Policies',
      score: 0,
      value: 'offline',
      img: '../../../assets/icons/quick-quote/offline_policies.svg',
    },
  ];

  quoteData;

  insuranceProductsCopy;

  productKey;

  constructor(
    private userDataService: UserDataService,
    private route: ActivatedRoute,
    public media: MediaObserver,
    private router: Router,
    private loaderService: LoaderService,
    private accountService: AccountService,
  ) {}

  ngOnInit() {
    this.loaderService.showSpinner(true);
    let user = {};
    user = JSON.parse(aesDecrypt(sessionStorage.getItem('user')));
    this.orgCode = user['organizationCode'];
    console.log(this.orgCode, 'ssss', user[''], aesDecrypt(sessionStorage.getItem('user')));

    this.route.params.subscribe((params) => {
      if (params.customerId) {
        this.customerId = params.customerId;
        console.log('customerid is', this.customerId);
      }
    });

    // *--commented during Union bank demo--*

    // this.userDataService.getCustomerById(this.customerId).subscribe((customer) => {
    //   // this.currentCustomer = customer;
    //   this.loaderService.showSpinner(false);

    //   let arr = customer['customerNeeds']['plan'];
    //   Object.keys(customer['customerNeeds']['plan']).forEach((key) => {
    //     console.log(key, 'kkkkkkkkkeeeee');
    //     let index = this.insuranceProducts.findIndex((element) => {
    //       return element.value === key;
    //     });
    //     console.log('matched', index);
    //     if (index > -1) {
    //       this.insuranceProducts[index]['score'] = customer['customerNeeds']['plan'][key]['score'];
    //     }
    //   });
    //   console.log(this.insuranceProducts);
    //   this.insuranceProducts.sort(this.compareValues('score', 'desc'));
    //   console.log('sorted array', this.insuranceProducts.sort(this.compareValues('score', 'desc')));
    // });
    this.getAvailablePlanForCustomer();

    // this.userDataService.getAvailablePlansForCustomer(this.customerId).subscribe((plans) => {
    //   // this.currentCustomer = customer;
    //   this.loaderService.showSpinner(false);

    //   let arr = plans;
    //   Object.keys(plans).forEach((key) => {
    //     console.log(key, 'kkkkkkkkkeeeee');
    //     let index = this.insuranceProducts.findIndex((element) => {
    //       return element.value === key;
    //     });
    //     console.log('matched', index);
    //     if (index > -1) {
    //       this.insuranceProducts[index]['score'] = plans[key]['score'];
    //     }
    //   });
    //   console.log(this.insuranceProducts);
    //   this.insuranceProducts.sort(this.compareValues('score', 'desc'));
    //   console.log('sorted array', this.insuranceProducts.sort(this.compareValues('score', 'desc')));
    // });
  }

  getAvailablePlanForCustomer() {
    this.userDataService.getAvailablePlansForCustomer(this.customerId).subscribe(
      (plans) => {
        console.log(plans, '--.,');
        this.loaderService.showSpinner(false);

        this.quoteData = plans;
        this.productKey = Object.keys(this.quoteData);
        console.log('product key=', this.productKey);
        this.insuranceProductsCopy = this.insuranceProducts.filter((arr) => {
          if (this.productKey.indexOf(arr.value) > -1) {
            return arr;
          }
        });
        console.log('test', this.insuranceProductsCopy);

        Object.keys(plans).forEach((key) => {
          // this.insuranceProductsCopy = this.insuranceProducts;
          const index = this.insuranceProductsCopy.findIndex((ele) => {
            return ele.value === key;
          });
          if (index > -1) {
            this.insuranceProductsCopy[index]['score'] = plans[key]['score'];
          }
        });
        this.insuranceProductsCopy.sort(this.compareValues('score', 'desc'));
      },
      (error) => {
        this.loaderService.showSpinner(false);
      },
    );
  }

  compareValues(key, order) {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === 'desc' ? comparison * -1 : comparison;
    };
  }

  routeToQuote(productValue) {
    console.log('value--=', productValue, this.orgCode);
    if (productValue === 'health') {
      this.router.navigate(['quote/health-detail', this.customerId]);
    } else if (productValue === 'car') {
      this.router.navigate(['quote/motor', this.customerId]);
    } else if (productValue === 'savings') {
      this.router.navigate(['quote/saving-traditionals', this.customerId]);
    } else if (productValue === 'childEducation') {
      this.router.navigate(['quote/children-plan', this.customerId]);
    } else if (productValue === 'protection') {
      this.router.navigate(['quote/life-protections', this.customerId]);
    } else if (productValue === 'pa') {
      this.router.navigate(['quote/pa-insurance', this.customerId]);
    } else if (productValue === 'travel') {
      this.router.navigate(['quote/travel-detail', this.customerId]);
    } else if (productValue === 'ann') {
      this.router.navigate(['/quote/annuiti', this.customerId]);
    } else if (productValue === 'offline') {
      if (this.orgCode === 'CSB') {
        this.router.navigate(['/offline-policies/new-application', this.customerId]);
      } else {
        this.router.navigate(['lms/new-application', this.customerId, 'digital']);
      }
    }
  }
}
