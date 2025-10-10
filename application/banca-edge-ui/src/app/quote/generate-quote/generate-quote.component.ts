import { Component, ElementRef, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { maxvalueVal } from '@app/shared/validators/maxValue.validator';
import { LoaderService } from '@app/_services/loader.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { QuoteService } from '../quote.service';
import { FireForm, HealthForm } from './questionBase';

@Component({
  selector: 'app-generate-quote',
  templateUrl: './generate-quote.component.html',
  styleUrls: ['./generate-quote.component.css']
})
export class GenerateQuoteComponent implements OnInit, OnChanges {
  // formData = FireForm;
  formData = FireForm;
  form: FormGroup;
  isNoPolicyError = false;
  // data = FireForm;
  insureType;
  existingQuoteId;
  quoteInput;
  finalQuote;
  customerId;
  leadId;
  saMax;
  backtoQuestion = false;
  // valueChanges: Observable<FormGroup>;
  contentArr = [
    { type: '', sa: '' }
  ];
  quoteId;
  errorDetail;

  @ViewChild('noQuoteGenerated') MyProp: ElementRef;
  constructor(private quoteService: QuoteService, private router: Router, private loaderService: LoaderService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.customerId = params.customerId;
      this.leadId = params.leadId;
    });

    // data = FireForm;
    const formGroup = {};
    console.log('inside ngOninit');
    this.formData?.forEach(form => {
      if (!form.isDependant) {
        const validatorsArray = this.getValidatorsArray(form)
        formGroup[form?.controlName] = new FormControl('', validatorsArray);
        this.form = new FormGroup(formGroup);
      }
    });
    this.route.params.subscribe(params => {
      console.log(params, 'paramss');
      if (params.customerId) {
        this.customerId = params.customerId;
        console.log('this customer', this.customerId);
      }
      if (params.quoteId) {
        // this.isLoadingQuoteValue = true;
        this.loaderService.showSpinner(true);
        this.existingQuoteId = params.quoteId;

        // this.isLoading = true;
        this.callQuoteApi();
      }
    });
    this.form.valueChanges.subscribe(val => {
      let totalsa = 0;
      if (val.sa && val.saCONT) {
        totalsa = +val?.sa + +val?.saCONT;
      }
      else if (val.sa) {
        totalsa = +val?.sa;
      }
      else if (val.saCONT) {
        totalsa = +val?.saCONT;
      }
      // console.log(totalsa);
      this.saMax = totalsa > 50000000 ? true : false;
      // console.log(this.saMax);
    })


    // this.form.controls['toInsure'].valueChanges.subscribe(val => {
    //   console.log('vallll --', val);
    //   if (val == 2 || val == 1) {
    //     this.form.get('totalCost')?.setValue(this.form.get('totalSqft').value * this.form.get('costPerSqft').value);

    //     console.log(this.form.value, 'value fform,');
    //   }
    // });

    console.log(this.form.value, 'form value');

    // console.log('iinsde observalbe after change', this.valueChanges);

  }

  ngOnChanges(changes) {
    // console.log('calue after change', changes.hasOwnProperty('toInsure'));
  }

  callQuoteApi() {
    this.quoteService.backToQuote(this.existingQuoteId).subscribe(finalQuoteRes => {
      this.finalQuote = finalQuoteRes;
      this.quoteInput = this.finalQuote?.quoteInput;
      this.customerId = this.quoteInput?.customerId;

      // if route is from quote page
      this.setFormValue();
    });
  }

  setFormValue() {
    console.log(this.quoteInput);
    this.formData?.forEach(formControl => {
      if (!formControl.isDependant) {
        const controlName = formControl?.controlName;
        if (formControl.controlType === 'radio') {
          this.form.get(`${controlName}`).setValue(`${this.quoteInput[controlName]}`);
        }
        else {
          this.form.get(`${controlName}`).setValue(this.quoteInput[controlName]);
        }
      }
    });
    this.backtoQuestion = true;
    this.loaderService.showSpinner(false);
  }

  setContent(quoteInput) {
    console.log(this.form.getRawValue)
    const optedContentArr = Object.keys(this.form.getRawValue()).filter(controlKey => this.form.getRawValue()[controlKey] === 'yes');
    const contentData = optedContentArr.map(ele =>
    ({
      type: ele,
      sa: this.form.get('sa' + ele).value,
      coverId: 'FAP'
    }));
    // console.log('contentdata', this.form.get('sa' + 'BLDG').value);
    quoteInput['covers'] = contentData;
  }

  setBuilding(quoteInput) {
    const buildingData = {
      costofConstruction: this.form.get('costofConstruction').value,
      area: this.form.get('area').value,
      age: this.form.get('age').value,
      sa: this.form.get('costofConstruction').value * this.form.get('area').value,
      typeOfConstruction: "1"
    };
    quoteInput['bldg'] = buildingData;
  }


  onSubmit() {
    this.loaderService.showSpinner(true);
    console.log('form value', this.form.value);
    // if (this.form.value, this.form.get('toInsure').value === 'onlyBuilding') {
    // this.insureType = true;

    this.quoteInput = {
      lob: 'Fire',
      customerId: this.customerId,
      leadId: this.leadId,
      productType: 'Home',
      insuranceType: +this.form.get('insuranceType').value,
      occupancyType: 37,
      pincode: this.form.get('pincode').value,
      pt: +this.form.get('pt').value,
      ppt: 1,
    };
    if (this.form.get('insuranceType').value === '2') {
      this.setBuilding(this.quoteInput);
    } else if (this.form.get('insuranceType').value === '3') {
      this.setContent(this.quoteInput);

    } else if (this.form.get('insuranceType').value === '1') {
      this.setBuilding(this.quoteInput);
      this.setContent(this.quoteInput);

    }
    console.log('quoteInpuyt', this.quoteInput);
    this.quoteService.generateQuote(this.quoteInput).subscribe(result => {
      console.log('result of fire', result);
      const quote = result;
      this.quoteId = quote['quoteId'];
      // this.isLoading = false;
      // this.loaderService.showSpinner(false);


      if (quote['numQuotesExpected'] > 0) {
        this.loaderService.showSpinner(false);

        //  this.router.navigate(['quote/quote-result'], { queryParams: { quoteId: this.quoteId } });
        this.router.navigate(['quote/quote-result', this.quoteId]);
        // this.quoteService.getHealthQuote(quote['quoteId']).subscribe(finalQuote => {
        // });
      }
      else if (quote['numQuotesExpected'] == 0) {
        this.loaderService.showSpinner(false);

        this.isNoPolicyError = true;
        this.errorDetail = 'Oops.. We could not find any policies for you. you may have to adjust your search criteria.';
        this.MyProp.nativeElement.scrollIntoView({ behavior: "smooth" });

      }
    }, error => {
      this.loaderService.showSpinner(false);
      // this.isErrorMsg = true;
     // console.log('error kav', error);
      this.isNoPolicyError = true;
      if (error.error.details !== ''){
        this.errorDetail = error.error.details;
      } else if (error.error.message !== '') {
        this.errorDetail = error.error.message;
      } else if (error.error.error){
        this.errorDetail = error.error.error;
      } else{
        this.errorDetail = 'Oops.. We could not find any policies for you. you may have to adjust your search criteria.';
      }
      this.MyProp.nativeElement.scrollIntoView({ behavior: "smooth" });
    });
  }
  disableGenerateBtn() {
    if (this.form.valid && !this.saMax) {
      return true;
    } else {
      return false;
    }
  }
  getValidatorsArray(formData): any[] {
    const validatorsArray = [];
    Object.keys(formData.validators).forEach((validatorKey) => {
      if (validatorKey === 'required') {
        validatorsArray.push(Validators.required);
      } else if (validatorKey === 'minLength') {
        validatorsArray.push(
          Validators.minLength(formData.validators.minLength)
        );
      } else if (validatorKey === 'maxLength') {
        validatorsArray.push(
          Validators.maxLength(formData.validators.maxLength)
        );
      } else if (validatorKey === 'min') {
        validatorsArray.push(Validators.min(formData.validators.min));
      } else if (validatorKey === 'max') {
        validatorsArray.push(Validators.max(formData.validators.max));
      } else if (
        validatorKey === 'email' &&
        formData.validators[validatorKey]
      ) {
        validatorsArray.push(Validators.email);
      } else if (validatorKey === 'pattern') {
        validatorsArray.push(Validators.pattern(formData.validators.pattern));
      }
      else if (validatorKey === 'maxValue') {
        validatorsArray.push(maxvalueVal(formData.validators[validatorKey]));
      }
    });
    return validatorsArray;
  }

}
