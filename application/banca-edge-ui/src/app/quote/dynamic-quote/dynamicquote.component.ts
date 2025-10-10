import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicQuoteService } from './services/dynamicquote.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { backToQueston, metaData } from './metaData/metadata';
import getValidatorsArray from './utils/validators.util';
import { BehaviorSubject, Subscription } from 'rxjs';
import * as moment from 'moment';
import { LoaderService } from '@app/_services/loader.service';

@Component({
  selector: 'app-dynamicquote',
  templateUrl: './dynamicquote.component.html',
  styleUrls: ['./dynamicquote.component.css']
})
export class DynamicquoteComponent implements OnInit , OnDestroy{
  screen;
  masterSub: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  allApiLoadedSubscription: Subscription;
  masterCount = 0;
  showHelp = false;
  hasDependentsControlArr = [];
  userInput = false;
  fieldValues={};
  customerId;
  backToQuestion = false;
 
  constructor(private dynamicQuoteService: DynamicQuoteService,
    private router: Router,
    private loaderService: LoaderService
  ) { }
  dynamicForm: FormGroup;
  ngOnInit(): void {
    this.dynamicForm = new FormGroup({})
    const [emptyString, quote, lob, customerId, quoteId] = this.router.url.split('/')
    this.customerId = customerId
    // console.log(emptyString, quote, lob, customerId, quoteId)
    if (!quoteId) {
      //Get metaData API Call
      // this.dynamicQuoteService.getMetaData(lob).subscribe((data)=>{
      //   this.screen = data;
      // this.fieldValues = metaData.quotePayload
      // })
      this.screen = JSON.parse(JSON.stringify(metaData));
      this.fieldValues = JSON.parse(JSON.stringify(metaData.quotePayload))
      // console.log(this.fieldValues)
      this.setPredefinedPayload(quote, lob, customerId)
      //get All non dependent Masters
      this.getMasters();

      //subscribing to masterSubscription to check whether all masters without dependencies are called by comparing with masterCount
      this.allApiLoadedSubscription = this.masterSub.subscribe((count) => {
        if (count === this.masterCount && count !== -1) {
          // this.allApiLoadedSubscription.unsubscribe();
          //generateInitialFieldValues
          // this.generateInitialFieldValues()
          //generate initial form
          this.generateInitialForm();
        }
      },(error)=>{
        console.log(error.errorMessage)
        // alert(error.errorMessage)
      });
      //Generate the quoteForm controls.

    } else {
      this.backToQuestion = true
      //Get metaData API Call
      // this.dynamicQuoteService.getMetaData(lob).subscribe((data)=>{
      //   this.screen = data;
      //   this.fieldValues = data.quotePayload
      // },(error)=>{
      //   console.log(error.errorMessage)
      //   alert(error.errorMessage)
      // })
      this.screen = JSON.parse(JSON.stringify(metaData));
      // this.fieldValues = backToQueston.quoteInput
      // console.log(this.fieldValues)
      //get quoteInfo from back to question
      this.loaderService.showSpinner(true);
      this.dynamicQuoteService.getBackQuote(quoteId).subscribe((data)=>{
        this.loaderService.showSpinner(false);
        this.fieldValues = data['quoteInput'];
      console.log(this.fieldValues)
        this.getMasters();
      },(error)=>{
        this.loaderService.showSpinner(false);
        console.log(error.errorMessage)
        alert(error.errorMessage)
      })
      

       //get All non dependent Masters
     


      //subscribing to masterSubscription to check whether all masters without dependencies are called by comparing with masterCount
        this.allApiLoadedSubscription = this.masterSub.subscribe((count) => {
          // console.log(count,this.masterCount)
          if (count === this.masterCount && count !== -1) {
            // this.allApiLoadedSubscription.unsubscribe();
            //generateInitialFieldValues
          // this.generateInitialFieldValues(backToQueston.quoteInput)
            //generate initial form
            this.generateInitialForm();
            this.backToQuestionForm();
          }
        },(error)=>{

          console.log(error.errorMessage)
          // alert(error.errorMessage)
        });
     
    }

  }

  ngOnDestroy(): void {
    console.log('calling destroy')
    this.screen = JSON.parse(JSON.stringify(metaData));
    this.fieldValues = JSON.parse(JSON.stringify(metaData.quotePayload))
  }

  setPredefinedPayload(quote, lob, customerId){
    const items = {quote,lob,customerId}
    Object.keys(this.fieldValues).forEach(key=>{
      if(this.fieldValues[key].hasOwnProperty('predefinedValue')){
        this.fieldValues[key] = items[this.fieldValues[key]['predefinedValue']]
      }
    })
  }

  onHelp() {
    this.showHelp = !this.showHelp
  }

  getMasters() {
    const formWithMasters = [];
    let apiCount = 0;
    //getting all the masterURl which is not dependent and also checking removing duplicate masterUrls(if any)
    if(!this.backToQuestion){
      this.screen.sections.forEach((section) => {
        section.formData.forEach((form) => {
          if (form.callMaster && !form.masterCallIsDependent && formWithMasters.findIndex(existForm => existForm.masterUrl === form.masterUrl) === -1) {
            formWithMasters.push(form);
          }
        });
      });
      // getting the masterCount Length to comapre
      this.masterCount = formWithMasters.length
      if (this.masterCount === 0) {
        this.masterSub.next(apiCount)}
      else {
        formWithMasters.forEach((form) => {
        this.loaderService.showSpinner(true);

          this.dynamicQuoteService.getMasters(form.masterUrl).subscribe((options: []) => {
        this.loaderService.showSpinner(false);

            options.length > 0 ? form.options = options : null;
            if(form.filteredOptions){
              form.filteredOptions = form.options
            }
            ++apiCount;
            this.masterSub.next(apiCount)
          },(error)=>{
        this.loaderService.showSpinner(false);

            console.log(error.errorMessage)
            // alert(error.errorMessage)
          })
        })
      }
    } else {
      this.screen.sections.forEach((section) => {
        section.formData.forEach((form) => {
          if (form.callMaster && formWithMasters.findIndex(existForm => existForm.masterUrl === form.masterUrl) === -1) {
            formWithMasters.push(form);
          } else if (form.optionDependent){
            this.onFocus(form)
          }
        });
      });
    }
    console.log(formWithMasters)
    // getting the masterCount Length to comapre
    this.masterCount = formWithMasters.length
    if (this.masterCount === 0) {
      this.masterSub.next(apiCount)}
    else {
      formWithMasters.forEach((form) => {
      console.log('apiCount',apiCount)

        if (form.callMaster && form.masterCallIsDependent){
          if(form.callType === 'get'){
            const payloadValArr = form.masterCallDependentControlValue.map(controlName => {
              return this.fieldValues[controlName]
            })
            const payloadtoString = payloadValArr.join('/')
            const url = form.masterUrl + payloadtoString
            // dependent masters api calls
        this.loaderService.showSpinner(true);

            this.dynamicQuoteService.getMasters(url).subscribe((options: []) => {
        this.loaderService.showSpinner(false);

              form.options = options.length ? options : form.options
              if(form.filteredOptions){
                form.filteredOptions = form.options
              }
                ++apiCount;
                this.masterSub.next(apiCount)
              
            },(error)=>{
        this.loaderService.showSpinner(false);

              console.log(error.errorMessage)
              // alert(error.errorMessage)
            })
          } else if(form.callType === 'post') {
            let payload = { }
            form.masterCallDependentControlValue.forEach(dependentControl=>{
    
              payload={...payload,[dependentControl]: this.fieldValues[dependentControl] ? this.fieldValues[dependentControl] : '' }
            })
        this.loaderService.showSpinner(true);
            
            this.dynamicQuoteService.getFecthDetails(form.masterUrl,payload).subscribe((options: [])=>{
        this.loaderService.showSpinner(false);

              // console.log(options)
              form.options = options.length ? options : form.options
              if(form.filteredOptions){
                form.filteredOptions = form.options
              }
                ++apiCount;
                this.masterSub.next(apiCount)
              
            },(error)=>{
        this.loaderService.showSpinner(false);

              console.log(error)
              // alert(error)
            })
          }
        } else if (form.callMaster && !form.masterCallIsDependent){
        this.loaderService.showSpinner(true);

          this.dynamicQuoteService.getMasters(form.masterUrl).subscribe((options: []) => {
        this.loaderService.showSpinner(false);

            options.length > 0 ? form.options = options : null;
            if(form.filteredOptions){
              form.filteredOptions = form.options
            }
            ++apiCount;
            this.masterSub.next(apiCount)
          },(error)=>{
        this.loaderService.showSpinner(false);

            console.log(error.errorMessage)
            // alert(error.errorMessage)
          })
        }
      })
    }
   
  }


  generateInitialForm() {
    this.screen.sections.forEach((section) => {
     if (!section.isSectionDependent){
      section.formData.forEach( (form) => {
        if (!form.isDependent) {
          this.generateFields(form,section)
        }
      })
     }
    })
  }

  backToQuestionForm(){
    this.screen.sections.forEach((section) => {
      if(section.isSectionVisible){
      // console.log('section',section)
        section.formData.forEach( (form) => {
          if(form.hasDependents && form.isFormVisible){
            // console.log('has depenedents form',form)
            form.dependentType.forEach(type=>{
              if(type === 'form'){ 
                // console.log(form)
                form.formDependentConditions.forEach(formDependentCondition=>{
                  let conditionTrue = false
                  if(form.controlType === 'fetch'){
                     conditionTrue  = (true)
                  } else {
                     conditionTrue  = (formDependentCondition.changeDependsOnVal.length === 0 && this.fieldValues[form.payloadTag] ? true: formDependentCondition.changeDependsOnVal.includes(this.fieldValues[form.payloadTag]))
                  }
                // console.log('conditionTrue',form.controlName,conditionTrue)
                const fieldsUnderChange = section.formData.filter(reqForm=>{
                  return  formDependentCondition.formDependentControls.includes(reqForm.controlName)
                })
                if(formDependentCondition.changeType === 'visibility'){
                  // console.log('isvisible true',fieldsUnderChange)
                  this.setVisibility(fieldsUnderChange,'field',conditionTrue,section)
                }
              })
              } else if(type === 'section'){
                form.sectionDependentConditions.forEach(sectionDependentCondition=>{
                  let conditionTrue = false
                  if(form.controlType === 'fetch'){
                     conditionTrue  = (true)
                  } else {
                   conditionTrue  = (sectionDependentCondition.changeDependsOnVal.length === 0  && this.fieldValues[form.payloadTag]? true: sectionDependentCondition.changeDependsOnVal.includes(this.fieldValues[form.payloadTag]))
                  }
                  const sectionsUnderChange = this.screen.sections.filter(section=>{
                    return  sectionDependentCondition.sectionIndex.includes(section.sectionIndex)
                  })
                  if(sectionDependentCondition.changeType === 'visibility'){
                  // console.log('issectionvisible true',sectionsUnderChange)

                    this.setVisibility(sectionsUnderChange,'section',conditionTrue,section)
                  }
                })
              }
            })
           
          }
      })
      }
      
    })
    this.backToQuestion = false
  }

  setVisibility(arrOfElem,type,conditionTrue,section){
      
      if(conditionTrue){
        // console.log(arrOfElem,type)
        arrOfElem.forEach(element=>{
          if(type === 'field'){
            //this enables individual form
            this.generateFields(element,section)
           element.isFormVisible = true;
          } 
        else  if(type === 'section'){
          //this enables individual sections which should be visible and adds all non dependentForm
            // this.addAllSectionFields(element)
            element.formData.forEach(form=>{
              if(!form.isDependent){
                this.generateFields(form,element)
                form.isFormVisible = true
              }
            })
          element.isSectionVisible = true}
        })
    }  
  }



 

  removeAllSectionFields(section) {
    section.formData.forEach(form => {
      this.removeFields(form,section)
    })
  }

  addAllSectionFields(section) {
    section.formData.forEach(form => {
      if (!form.isDependent) {
        this.generateFields(form,section)
      }
    })
  }

 
  generateFields(form,section) {
    // console.log('inside generate form for',form.controlName)
    // console.log('backtoquestion',this.backToQuestion,form)
    const validators = getValidatorsArray(form)
    if (form.callMaster && form.masterCallIsDependent && !this.backToQuestion) {
      if(form.callType === 'get'){
        const payloadValArr = form.masterCallDependentControlValue.map(controlName => {
          return this.dynamicForm.get(controlName).value
        })
        const payloadtoString = payloadValArr.join('/')
        const url = form.masterUrl + payloadtoString
        // dependent masters api calls
        this.loaderService.showSpinner(true);

        this.dynamicQuoteService.getMasters(url).subscribe((options: []) => {
        this.loaderService.showSpinner(false);

          form.options = options.length ? options : form.options
          if(form.filteredOptions){
            form.filteredOptions = form.options
          }
          if(!this.dynamicForm.get(form.controlName)){
            this.addControl(form,validators)
          }
          form.isFormVisible = true;
        },(error)=>{
        this.loaderService.showSpinner(false);

          console.log(error.errorMessage)
          // alert(error.errorMessage)
        })
      } else if(form.callType === 'post') {
        console.log(form.controlName)
        let payload = {
        }
        form.masterCallDependentControlValue.forEach(dependentControl=>{
          payload={...payload,[dependentControl]: this.dynamicForm.get(dependentControl) ? this.dynamicForm.get(dependentControl).value : '' }
        })

        this.dynamicQuoteService.getFecthDetails(form.masterUrl,payload).subscribe((options: [])=>{
          console.log(options)
          form.options = options.length ? options : form.options
          if(!this.dynamicForm.get(form.controlName)){
            this.addControl(form,validators)
          }
          form.isFormVisible = true;
        },(error)=>{
          console.log(error)
          // alert(error)
        })
      }
   
      // this.dynamicForm.addControl(form.controlName, new FormControl(this.fieldValues[form.controlName] ? this.fieldValues[form.controlName] : '' , validators))
 
      // form.isFormVisible = true;
    }else {
      if(!this.dynamicForm.get(form.controlName)){
        this.addControl(form,validators)
      }
      form.isFormVisible = true;
    }

    if(form.defaultValue && !this.backToQuestion){
      if(!form.defaultValueDependency.condition){
        this.dynamicForm.get(form.controlName)?.value ? '' : this.dynamicForm.get(form.controlName)?.setValue(form.defaultValueDependency.value);
      } else if (form.defaultValueDependency.condition === 'selectFromFormOption'){
        // console.log(section)
        const depForm = section.formData.find(reqForm=>{
         return reqForm.controlName === form.defaultValueDependency.control
        })
        const depFormValue = this.dynamicForm.get(depForm.controlName).value;
        // console.log('depFormValue',depFormValue)
        const reqVal = depForm.options.find(option=>{
          return option.id === depFormValue
        })[form.defaultValueDependency.value]
         this.dynamicForm.get(form.controlName)?.setValue(reqVal);

      }
      this.onInputValue(form.defaultValue,form,section,false)
    }

    if(form.initiallyDisabled){
      if(this.dynamicForm.get(form.controlName).value) this.dynamicForm.get(form.controlName).disable();
      // console.log(form.controlName)
    }

    

  }

  addControl(form,validators){
    if(form.controlType === 'date'){
      console.log(moment(this.fieldValues[form.controlName],"YYYY-MM-DD").format())
      this.dynamicForm.addControl(form.controlName, new FormControl(
        (this.fieldValues[form.controlName] === '' 
        || this.fieldValues[form.controlName] === null 
        || this.fieldValues[form.controlName] === undefined) ? '' : moment(this.fieldValues[form.controlName],"YYYY-MM-DD").format(), validators))
    } else {
    this.dynamicForm.addControl(form.controlName, new FormControl(
      (this.fieldValues[form.controlName] === '' 
      || this.fieldValues[form.controlName] === null 
      || this.fieldValues[form.controlName] === undefined) ? '' : this.fieldValues[form.controlName], validators))
    }
  }

  runOptionConditions(form){
    switch(form.optionCondition?.conditionName){
      case 'limitValues':  this.limitValues(form.optionDependentOnControl,form.optionCondition.limit,form)
      break;
      default:  form.options
    }
  }


  removeFields(form,section) {
    // console.log('remove',form)
    if(form.hasDependents){
      this.dynamicForm.get(form.controlName)?.setErrors({makeInvalid:true})
      this.handleSectionAndFormDependentCondtitons('',form,section)
    }
    if(this.dynamicForm.get(form.controlName)) this.dynamicForm.removeControl(form.controlName)
    form.isFormVisible = false;
      this.fieldValues[form.controlName]=''
      if(form.additionalPayload?.length>0){
        form.additionalPayload.forEach(payload=>{
          this.fieldValues[payload.payloadTag] = ''
        })
    }
    if(form.masterCallIsDependent || form.searchUrl)
      {
        // console.log('removing options',form.controlName)
        form.option = []
        form.filteredOptions ? form.filteredOptions = [] : '';
      }
  }

  onFocus(form){
    if(form.optionDependent){
      this.runOptionConditions(form)
    }
  }

async onInputValue(selectedOption,form,section,userInput?) {
  userInput ? this.userInput = true : this.userInput = false
  // this.handleSectionAndFormDependentCondtitons(selectedOption,form,section)
  // handle Fetch Api calls
  if(form.controlType==='fetch'){
    this.loaderService.showSpinner(true);

      this.dynamicQuoteService.getFecthDetails(form.fetchUrl,selectedOption.value).subscribe(res=>{
        this.loaderService.showSpinner(false);

        if(res['responseCode'] === '0'){
          this.handleSectionAndFormDependentCondtitons(true,form,section)
        }
      },(error)=>{
        this.loaderService.showSpinner(false);

        this.handleSectionAndFormDependentCondtitons(true,form,section)

        // console.log(error.errorMessage)
        // alert(error.errorMessage)
      })
  } else if (form.controlType==='date') {
    moment(selectedOption).format('YYYY-MM-DD')
    console.log(selectedOption)
    this.handleSectionAndFormDependentCondtitons(selectedOption,form,section)
  } else {
    this.handleSectionAndFormDependentCondtitons(selectedOption,form,section)
  }
  if(form.controlType === 'date'){
    // console.log('selectedOption',this.dynamicForm.get(form.controlName)?.value,selectedOption)
    this.fieldValues[form.payloadTag] =  moment(this.dynamicForm.get(form.controlName)?.value).format('YYYY-MM-DD')
    
  } else{
    this.fieldValues[form.payloadTag] = await this.dynamicForm.get(form.controlName)?.value;
  }
    if(form.additionalPayload?.length>0 ){
      form.additionalPayload.forEach(payload=>{
        const reqVal = form.options.find(option=>{
         return this.dynamicForm.get(form.controlName).value === option.id
        })[payload.optionValueTag]
        this.fieldValues[payload.payloadTag] = reqVal
      })
}
  
 
   this.userInput = false;
  //  console.log(this.fieldValues)
  }

  handleSectionAndFormDependentCondtitons(selectedOption,form,section){
    if(form.hasDependents){
      // console.log(selectedOption,form,section)
      form.dependentType?.forEach(type=>{
        if(type === 'form'){ 
          form.formDependentConditions.forEach(formDependentCondition=>{
          const conditionTrue  = (formDependentCondition.changeDependsOnVal.length === 0 && (this.dynamicForm.get(form.controlName)?.valid || this.dynamicForm.get(form.controlName)?.disabled ))? true: formDependentCondition.changeDependsOnVal.includes(selectedOption)
          // console.log('conditionTrue',form.controlName,conditionTrue)
          const fieldsUnderChange = section.formData.filter(reqForm=>{
            return  formDependentCondition.formDependentControls.includes(reqForm.controlName)
          })
          if(formDependentCondition.changeType === 'visibility'){
            this.visibilityCheck(fieldsUnderChange,'field',conditionTrue,section)
          }
        })
        } else if(type === 'section'){
          form.sectionDependentConditions.forEach(sectionDependentCondition=>{
            const conditionTrue  = (sectionDependentCondition.changeDependsOnVal.length === 0  && (this.dynamicForm.get(form.controlName)?.valid || this.dynamicForm.get(form.controlName)?.disabled ))? true: sectionDependentCondition.changeDependsOnVal.includes(selectedOption)
            const sectionsUnderChange = this.screen.sections.filter(section=>{
              return  sectionDependentCondition.sectionIndex.includes(section.sectionIndex)
            })
            if(sectionDependentCondition.changeType === 'visibility'){
              this.visibilityCheck(sectionsUnderChange,'section',conditionTrue,section)
            }
          })
        }
      })
    }
    if(form.hasControlReset){
      form.controlToReset.forEach(control=>{
        // console.log('reset',control)
        if(this.dynamicForm.get(control)?.disabled){
        this.dynamicForm.get(control)?.enable();
          this.dynamicForm.get(control)?.reset();
        } else {
          this.dynamicForm.get(control)?.reset();
        }
      })
      // console.log(this.dynamicForm)
    }
    
  }

  visibilityCheck(arrOfElem, type,conditionTrue,section){
    // console.log('visibilityCheck',arrOfElem,type,conditionTrue)
    if(conditionTrue){
        arrOfElem.forEach(element=>{
          if(type === 'field'){
            //this enables individual form
            this.generateFields(element,section)
          } 
        else  if(type === 'section'){
          //this enables individual sections which should be visible and adds all non dependentForm
            this.addAllSectionFields(element)
          element.isSectionVisible = true}
        })
    }  else {
        arrOfElem.forEach(element=>{
          if(type === 'field'){
            this.removeFields(element,section)
          }  
        else if(type === 'section'){
          //this gets individual sections whose should be visible.
          this.removeAllSectionFields(element)
          element.isSectionVisible = false}
      })
    } 
    }


    handleSearchableDropDownInput(event,form,api?){
      console.log(event.target.value,form)
      if(api){
        if(form.options.length>0) form.options = [];
        let payload = {
          searchData:event.target.value
        }
        form.fetchCallDependentControlValue.forEach(dependentControl=>{
          payload={...payload,[dependentControl]: this.dynamicForm.get(dependentControl) ? this.dynamicForm.get(dependentControl).value : '' }
        }
        
        )
        console.log(payload)
        this.loaderService.showSpinner(true);

        this.dynamicQuoteService.getFecthDetails(form.searchUrl,payload).subscribe(res=>{
        this.loaderService.showSpinner(false);

          console.log(res)
          form.options=res
        },(error)=>{
        this.loaderService.showSpinner(false);

          console.log(error)
          // alert(error)
        })
      } else {
       
        form.filteredOptions = form.options.filter(option=>{
         return option.id.toLowerCase().includes(event.target.value.toLowerCase()) || option.value.toLowerCase().includes(event.target.value.toLowerCase())
        })
      }
     
      // form.options=[{
      //   id:'Hero Honda Splender',
      //   value:'Hero Honda Splender'
      // }]
    }


    onQuoteSubmit(){
      this.loaderService.showSpinner(true);

    this.dynamicQuoteService.submitQuote(this.fieldValues,this.screen.quoteSubmitUrl).subscribe(data=>{
      this.loaderService.showSpinner(false);
      // console.log(data)
      if (data['numQuotesExpected'] > 0) {
        this.loaderService.showSpinner(false);

        //  this.router.navigate(['quote/display-quote-result'], { queryParams: { quoteId: this.quoteId } });
        this.router.navigate(['quote/display-quote-result',this.customerId, data['quoteId']]);
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

    }

    limitValues(dependentControl,limit,form){
      const [val,type,condition] = limit.split("-");
      if(type === 'years'){
        const year = moment(this.fieldValues[dependentControl] ? moment(this.fieldValues[dependentControl],"YYYY-MM-DD")  : this.dynamicForm.get(dependentControl)?.value).format('YYYY');
        const numOfYears = [year]
        for(let i = val; i>0 ; i--){
          if(condition === 'before') numOfYears.push( moment(this.fieldValues[dependentControl] ? moment(this.fieldValues[dependentControl],"YYYY-MM-DD") : this.dynamicForm.get(dependentControl)?.value).subtract(val,'years').format('YYYY'))
          if(condition === 'after') numOfYears.push( moment(this.fieldValues[dependentControl] ? moment(this.fieldValues[dependentControl],"YYYY-MM-DD") :   this.dynamicForm.get(dependentControl)?.value).add(val,'years').format('YYYY'))
        }
        let generateLimitedOptions = []
        console.log(numOfYears)
        numOfYears.forEach(year=>{
            generateLimitedOptions.push({id:year,value:year})
        })
        form.options=generateLimitedOptions
      }

    }
    
  }





