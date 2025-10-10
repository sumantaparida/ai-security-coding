import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadManagementService } from '@app/lead-management/service/lead-management.service';
import { CustomersService } from '@app/mycustomers/services/customers.service';
import { SelectInsurerModelCisComponent } from '@app/select-insurer-model-cis/select-insurer-model-cis.component';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { LoaderService } from '@app/_services/loader.service';
import { SelectInsurerModelComponent } from '../select-insurer-model/select-insurer-model.component';

@Component({
  selector: 'app-lead-quotes',
  templateUrl: './lead-quotes.component.html',
  styleUrls: ['./lead-quotes.component.css'],
})
export class LeadQuotesComponent implements OnInit {
  cif: number;

  isLoading;

  quickQuoteForm: FormGroup;

  quoteData;

  isPlanCompleted;

  customerData;

  userDetails;

  productKey = [];

  insuranceProductsCopy = [];

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
    {
      name: 'Cyber Theft',
      score: 0,
      value: 'cyber',
      img: '../../../assets/images/anon-hacker-behind-pc.svg',
    },
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
      name: 'Fire Insurance',
      score: 0,
      value: 'sme',
      img: '../../../assets/icons/quick-quote/standard_fire_special_perils.svg',
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
      name: 'Personal Accident',
      score: 0,
      value: 'pa',
      img: '../../../assets/icons/quick-quote/personal_accident.svg',
    },
    {
      name: 'Motor Insurance',
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
      name: 'Offline Policies',
      score: 0,
      value: 'offline',
      img: '../../../assets/icons/quick-quote/offline_policies.svg',
    },
    {
      name: 'Shop Keeper',
      score: 0,
      value: 'sme',
      img: '../../../assets/images/Home_Insurance_ICON.svg',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public media: MediaObserver,
    private router: Router,
    private customerService: CustomersService,
    public dialog: MatDialog,
    // private spinner: NgxSpinnerService,
    private loaderService: LoaderService,
    private leadManagement: LeadManagementService,
  ) {}

  ngOnInit(): void {
    // this.isLoading = true;
    this.route.params.subscribe((params) => {
      if (params.CIF) {
        this.cif = params.CIF;
        this.customerService.getCustomerByCif(this.cif).subscribe((customerinfo) => {
          this.customerData = customerinfo;
          if (this.customerData?.planCompleted) {
            this.isPlanCompleted = true;
          } else {
            this.isPlanCompleted = false;
            this.customerService.getQuickQuote().subscribe(() => {}); // 07/12/2021. Not sure why this is required. Will see for sometime, and remove this if no changes are done.
          }
        });
      } else {
        this.cif = null;
      }
    });
    // this.isLoading = true;
    // this.spinner.show();
    this.loaderService.showSpinner(true);
    this.customerService.getQuickQuote().subscribe(
      (quote) => {
        // this.isLoading = false;
        this.loaderService.showSpinner(false);
        // this.spinner.hide();
        this.quoteData = quote;
        this.productKey = Object.keys(this.quoteData);

        this.insuranceProductsCopy = this.insuranceProducts.filter((arr) => {
          if (this.productKey.indexOf(arr.value) > -1) {
            return arr;
          }
        });
      },
      () => {
        this.loaderService.showSpinner(false);
        const message = 'Unable to fetch Data, Please try after sometime.';
        this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
      },
    );
    this.quickQuoteForm = new FormGroup({
      policyName: new FormControl(''),
    });
  }

  openSelectInsurer(product) {
    console.log('PRINTING PRODUCTS', product);
    const selectedProduct = this.quoteData[product.value];
    console.log('SELECTED PRODUCT', selectedProduct);
    // this.loaderService.showSpinner(true);
    // if not BOM User
    this.loaderService.showSpinner(true);

    if (this.customerData['organizationCode'] !== 'BOM') {
      const reqBody = {
        lob: selectedProduct.lob,
        productType: selectedProduct.productType,
        cifNo: this.cif,
        channel: 'Branch',
      };

      this.leadManagement.createLead(reqBody).subscribe(
        (response) => {
          this.loaderService.showSpinner(false);

          if (response['responseCode'] === 0) {
            const message = 'Lead has been created Successfully';
            this.dialog.open(PolicyErrorModalComponent, {
              data: message,
              panelClass: 'dialog-width',
            });
            this.router.navigate(['lead-management', 'viewleads']);
          } else if (response['responseCode'] !== 0) {
            this.openErrorModal(response['responseMessage']);
          }
        },
        (error) => {
          this.loaderService.showSpinner(false);
          const message = 'Unable to fetch the data.';
          this.openErrorModal(message);
        },
      );
    }

    // if it is BOM User

    if (this.customerData['organizationCode'] == 'BOM') {
      const dialogRef = this.dialog.open(SelectInsurerModelComponent, {
        data: {
          lob: selectedProduct.lob,
          productType: selectedProduct.productType,
        },
      });

      dialogRef.afterClosed().subscribe((insurerId) => {
        console.log('PRINTING INSURER ID', insurerId);
        if (insurerId !== '') {
          const reqBody = {
            lob: selectedProduct.lob,
            productType: selectedProduct.productType,
            insurerId,
            cifNo: this.cif,
            channel: 'Branch',
          };
          this.leadManagement.createLead(reqBody).subscribe(
            (response) => {
              if (response['responseCode'] === 0) {
                this.router.navigate(['lead-management', 'viewleads']);
                const message = 'Lead has been created Successfully';
                this.dialog.open(PolicyErrorModalComponent, {
                  data: message,
                  panelClass: 'dialog-width',
                });
              } else if (response['responseCode'] !== 0) {
                this.openErrorModal(response['responseMessage']);
              }
            },
            () => {
              this.loaderService.showSpinner(false);
              const message = 'Unable to fetch the data.';
              this.openErrorModal(message);
            },
          );
        }
      });
    }
  }
  openErrorModal(message) {
    this.dialog.open(PolicyErrorModalComponent, {
      data: message,
      panelClass: 'dialog-width',
    });
  }
}
