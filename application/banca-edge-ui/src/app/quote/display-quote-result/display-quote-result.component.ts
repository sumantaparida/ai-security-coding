import { Component, OnInit } from '@angular/core';
import {quoteResult} from '../dynamic-quote/metaData/metadata'
import { MatDialog } from '@angular/material/dialog';
import { QuoteModalComponent } from './quote-modal-component/quote-modal.component';
import { FormControl, FormGroup } from '@angular/forms';
import { metaData } from './metadata/quote-display-metadata';
import getValidatorsArray from '../dynamic-quote/utils/validators.util';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '@app/_services/loader.service';
import { DynamicQuoteService } from '../dynamic-quote/services/dynamicquote.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { MintoproCkycModalComponent } from '../mintopro-ckyc-modal/mintopro-ckyc-modal.component';
import { AccountService } from '@app/_services';
import { PaymentApprovalComponent } from '@app/payment-approval/payment-approval.component';

@Component({
  selector: 'app-display-quote-result',
  templateUrl: './display-quote-result.component.html',
  styleUrls: ['./display-quote-result.component.css']
})
export class DisplayQuoteResultComponent implements OnInit {
  policyOptions;
  customerId;
  screenMetaData;
  quoteOptionForm: FormGroup;
  numberOfQuotes=5;
  quoteResult;
  quoteInput;
  quoteOptionFormValid = false;
  customiseOptions = false;
  overView = false;
  selectedIndex=-1;
  productDiscounts=['New Ncb Discount -35%','Voluntary Deductible','TPPD'];
  masterSub = new BehaviorSubject<boolean>(false)
  quoteId;
  errorList=[];
 productList=[];
 applicationNo;
 selectedProduct
 isBranchUser
 user;
 isBankCustomer;
  // addOns=[{
  //   label:'PA Owner Driver',
  //   highlighted:false,
  // },
  // {
  //   label:'Select PA Passenger Cover',
  //   highlighted:false,
  //   select:true,
  //   optionClick:false,
  //   options:[{id:'0',value:'none'},{id:'10000',value:'10000'}],
  //   value:'Select PA Passenger Cover'
  // }];

  productListing:[]
  constructor(public dialog: MatDialog,
    private dynamicQuoteService: DynamicQuoteService,
    private router: Router,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private accountService: AccountService
  ) {
     
   }

  ngOnInit(): void {
    this.isBranchUser = this.accountService.isBranchUser;
    console.log('is branch user in buy now = ', this.isBranchUser);
    this.accountService.user.subscribe((x) => (this.user = x));
    if (this.user['bankCustomer'] == 'false') {
      this.isBankCustomer = false;
    } else if (this.user['bankCustomer'] == 'true') {
      this.isBankCustomer = true;
    }
    this.screenMetaData = metaData;
    this.policyOptions = metaData.policyOptions
    this.route.params.subscribe(params=>{
      this.quoteId = params.quoteId
      this.loaderService.showSpinner(true)
      this.customerId = params['customerId']
      this.getQuote(params,'init')
    })
    this.masterSub.subscribe(completed=>{
      if(completed){
        this.generateOptionForm()
      }
    })
    
   }

   getQuote(params,type?){
   const getSubscribe = this.dynamicQuoteService.getQuote(params.quoteId).subscribe(res=>{
    console.log(res)
      this.loaderService.showSpinner(false)
      getSubscribe.unsubscribe()
      this.quoteResult = res;
      this.quoteInput = res['quoteInput']
      this.getErrorProducts(res['productQuote'])
      window.scrollTo(0, 0)
      // console.log('yo ')
      type==='init' ?  this.getMasters() : '';
    },(error)=>{
    this.loaderService.showSpinner(false);

      alert(error)
    }
    );
   }

   getErrorProducts(productList:[{}]){
    this.productList = [];
    this.errorList =[];
      productList.forEach(product=>{
        if(product.hasOwnProperty('quoteErrorResponse')){
          this.errorList.push({
            ...product['quoteErrorResponse'],
            insurerName:product['insurerName'],
            imageUrl:product['insurerImageUrl']
          })
        } else {
          this.productList.push(product)
        }
      })
      // console.log(this.errorList)
   }

   getMasters(){
    console.log('addONsRerun')
    let masters = []
    let count = 0
    this.policyOptions.forEach(form=>{
      if(form.mastercall){
        masters.push(form.mastercall)
      }
    })
    // console.log('masters',masters)
    this.policyOptions.forEach(form=>{
      if(form.mastercall){
      this.dynamicQuoteService.getMasters(form.mastercall).subscribe((options: []) => {
          options.length > 0 ? form.options = options : null;
          if(form.hasOwnProperty('addOnOptions')){
            this.reformOption(options,form)
          }
           ++count;
           if(count === masters.length){
            this.masterSub.next(true)
           }
        },(error)=>{
          console.log(error.errorMessage)
          // alert(error.errorMessage)
        })
      }
    })
  }

  reformOption(options,form){
    options.forEach(option=>{
      if(option.type === 'SINGLE'){
        const tempOption = {...option,highlighted:false}
        form.addOnOptions.push(tempOption)
      } else if (option.type === 'SELECT'){
        const tempOption = {...option,highlighted:false,
          select:true,
          selectedVal:'',
          optionClick:false, value:option.name}
        form.addOnOptions.push(tempOption)
      }
    })
  }

  generateOptionForm(){
    this.quoteOptionForm = new FormGroup({})
    this.policyOptions.forEach(optionForm=>{
     if ( optionForm.type === 'Radio') {
      const validators = getValidatorsArray(optionForm)
        this.quoteOptionForm.addControl(optionForm.controlName, new FormControl('',validators))
        if(optionForm.hasDefaultVlaue){
          if(optionForm.defaltValue){
            this.quoteOptionForm.get(optionForm.controlName).setValue(optionForm.defaltValue)
          } else {
            const reqVal=this[optionForm.getDefaultValFrom][optionForm.controlName]
            this.quoteOptionForm.get(optionForm.controlName).setValue(reqVal)
          }
         
         }
     } else if (optionForm.type === 'input') {
      optionForm.inputForms.forEach(form=>{
        if(form.getMin || form.getMax){
          form.validators.min = this.getValue(form.getMin,this[form.getMin[0]])
          form.validators.max = this.getValue(form.getMax,this[form.getMax[0]])
        }
        const validators = getValidatorsArray(form)
        this.quoteOptionForm.addControl(form.controlName, new FormControl('',validators))
        if(form.hasDefaultVlaue){
          const reqVal=this[form.getDefaultValFrom][form.controlName]
          this.quoteOptionForm.get(form.controlName).setValue(reqVal)
         }
      })
     }
    
    })
   
    this.quoteOptionFormValid = true
    console.log('optionForm',this.quoteOptionForm)
  }

  getValue(form,data){
    // console.log(form,data)
    if(!Array.isArray(form)) return this[form]
    let reqLevel = data;
    form[2].forEach(tag=>{
      if(typeof tag ==='string' && tag.split('-').length>1){
        const [tagName,index] = tag.split('-')
        reqLevel = index? reqLevel[tagName][+index] : reqLevel[tagName]
      } else {
        if(tag) reqLevel = reqLevel[tag]
      }
    })
    // console.log(reqLevel)
    return reqLevel[form[1]];
  }

  showDetails(index){
    this.selectedIndex = index
  }

  resetIndex(){
    this.selectedIndex=-1;
  }

  highlight(addOn){
    console.log('hi')
    addOn.highlighted = !addOn.highlighted
  }

  dropdown(addOn){
    addOn.optionClick = !addOn.optionClick
  }
  optionSelect(addOn,option){
    if(option.id !== '0'){
      addOn.value = option.value
    } else {addOn.value = addOn.label}
  }
  
  returnToQuote(){
    console.log(this.customerId,this.quoteResult['quoteId'])
    this.router.navigate(['quote/motor',this.customerId, this.quoteResult['quoteId']]);
  }

  overViewAction(){
    this.overView = !this.overView
  }

  openBreakUp(product,index){
    console.log(product);
    const dialogRef = this.dialog.open(QuoteModalComponent,{
      data:{type:'premiumBreakup',content:product}
    })
  }

  mbCustomise(){
      this.customiseOptions = true;
  }

  onRadioChange(e){
    console.log(e,this.quoteOptionForm)
    const val = e.target.value
    this.quoteOptionForm.get('policyType').setValue(val)
  }

  policyOptionChanges(val){
    console.log(val)
  }

  closeTab(e){
    this.customiseOptions = e
  }

  onBuyNow(product){
    console.log(product)
    this.selectedProduct = product;
   const payload =  this.createPayload(this.screenMetaData.createApplicationPayload)
  //  console.log(payload)
    this.ckycCheck(
        this.quoteInput.customerId,
        payload,
        this.selectedProduct,
      );
  }

  createPayload(payload){
    Object.keys(payload).forEach(tag=>{
      if(payload[tag].hasChildren){
        let tempObj = {};
        Object.keys(payload[tag].children).forEach(childTag=>{
          const reqVal = this.getValue(payload[tag].children[childTag],this[payload[tag].children[childTag][0]])
          tempObj = {...tempObj,[childTag]:reqVal}
        })
        payload[tag]={...tempObj}
      } else {
        const reqVal = this.getValue(payload[tag],this[payload[tag][0]])
        console.log(payload[tag],reqVal)
        payload[tag] = reqVal;
      }
     
    })
    console.log(payload)
    return payload;
  }

  knowMore(){
    const dialogRef = this.dialog.open(QuoteModalComponent,{
      data:{type:'knowMore',errorList:this.errorList}
    })
  }

  ckycCheck(customerId, createApplicationData, selectedProduct) {
    this.dynamicQuoteService.getCustomerById(customerId).subscribe((customer) => {
      this.loaderService.showSpinner(false);
      console.log('customer =', customer);
      if (customer['ckycNumber'] !== '' || customer['ckycRefNo'] !== '') {
        createApplicationData['ckycNumber'] = customer['ckycNumber'];
        createApplicationData['ckycRefNo'] = customer['ckycRefNo'];
        this.callCreateApplication(selectedProduct, createApplicationData);
      } else {
          this.handleMintProCkyc(customer, createApplicationData, selectedProduct);
      }
    });
  }

  handleMintProCkyc(customer, createApplicationData, selectedProduct) {
    const dialogRef = this.dialog.open(MintoproCkycModalComponent, {
      data:{
        quoteId: this.quoteInput.quoteId,
        dob: customer.dob,
        fullName: customer.firstName + customer.lastName,
        gender: customer.gender,
        customerId: customer.customerId,
        insurerId: selectedProduct.insurerId,
        coverType:this.quoteInput.productType,
        pinCode:this.quoteInput.pincode,
        bankOrgCode: this.user['organizationCode']
      },
    });
    dialogRef.afterClosed().subscribe(res=>{
      if (res['returnCode'] === 0){
        createApplicationData['ckycNumber'] = res['ckycNumber'];
        createApplicationData['panNumber'] = res['panNo']
        this.callCreateApplication(selectedProduct, createApplicationData);
      }
    })
  }

  callCreateApplication(selectedProduct, createApplicationData) {
    this.loaderService.showSpinner(true);
    console.log(selectedProduct,this.screenMetaData.createApplicationUrl)
    this.dynamicQuoteService.createApplication(selectedProduct.productId,this.screenMetaData.createApplicationUrl,createApplicationData)
      .subscribe(
        (result) => {
          this.loaderService.showSpinner(false);
          const applicationArr = result;
          this.applicationNo = applicationArr['applicationNo'];
       
            this.router.navigate([
              '/proposal',
              selectedProduct.productId,
              this.applicationNo,
              'Long',
            ]);
          },
        (error) => {
          this.loaderService.showSpinner(false);
         alert(error)
        },
      );
  }

  onUpdateQuote(event){
    // console.log(this.quoteOptionForm)
    this.screenMetaData.policyOptions.forEach(option=>{
      console.log(option)
      if(option.type==='Radio' ){
        this.quoteOptionForm.get(option.controlName).value !== '' ? this.quoteInput[option.controlName] = this.quoteOptionForm.get(option.controlName).value : delete this.quoteInput[option.controlName]
      } else if ( option.type === 'input'){
        option.inputForms.forEach(inputForm=>{
        this.quoteOptionForm.get(inputForm.controlName).value !== '' ? this.quoteInput[inputForm.controlName] = this.quoteOptionForm.get(inputForm.controlName).value : delete this.quoteInput[inputForm.controlName]

        })
      } else if ( option.type === 'option-select'){
       option.addOnOptions.forEach(addOnOption=>{
        if(addOnOption.type==='SINGLE'){
          addOnOption.highlighted ? this.quoteInput[addOnOption.tag] = true : delete this.quoteInput[addOnOption.tag];
        } else if (addOnOption.type==='SELECT'){
          addOnOption.selectedVal ? this.quoteInput[addOnOption.tag] = addOnOption.selectedVal : delete this.quoteInput[addOnOption.tag]
        }
       })
        
      }
    })
    this.loaderService.showSpinner(true);

    const submitSub =this.dynamicQuoteService.submitQuote(this.quoteInput,this.screenMetaData.quoteUpdateUrl).subscribe(data=>{
      this.loaderService.showSpinner(false);
      submitSub.unsubscribe()
      // console.log(data)
      if (data['numQuotesExpected'] > 0) {
        this.loaderService.showSpinner(true);

        this.getQuote(data)

        //  this.router.navigate(['quote/display-quote-result'], { queryParams: { quoteId: this.quoteId } });
        // this.router.navigate(['quote/display-quote-result',this.customerId, data['quoteId']]);
        // this.quoteService.getHealthQuote(quote['quoteId']).subscribe(finalQuote => {
        // });
      }
      else if (data['numQuotesExpected'] == 0) {

        alert('There are no policies available for the provided quote')

      }
    },(error)=>{
      this.loaderService.showSpinner(false);

        console.log(error)
    })
    console.log(this.quoteInput)
  }
}
