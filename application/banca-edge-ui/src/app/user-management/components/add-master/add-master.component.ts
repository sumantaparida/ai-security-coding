import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@app/_services';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { FormService, masterFormData } from '@app/user-management/services/form-service.service';
import { UserManagementService } from '@app/user-management/services/user-managent.service';

@Component({
  selector: 'app-add-master',
  templateUrl: './add-master.component.html',
  styleUrls: ['./add-master.component.css'],
})
export class AddMasterComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public formService: FormService,
    public userManService: UserManagementService,
    private dialog: MatDialog,
    private accountService: AccountService,
  ) {}

  selectedMaster = 'lov_Code';
  formDataNew = [];
  selected = 'UAM_LovCode';
  coverMaster;
  dropDownList;
  masterCount = 0;
  org;
  screens;
  masterData;
  masterType;
  coverTypeDetails = [
    { masterType: 'Branch', detailsTag: 'branchDetails' },
    { masterType: 'Medical_Question', detailsTag: 'medicalQuestionDto' },
    { masterType: 'Lov_Code', detailsTag: 'lovDetails' },
    { masterType: 'Covers', detailsTag: 'coverDetails' },
  ];
  // @Input() form !: IForm;
  // fb = inject(FormBuilder);
  dynamicForm: FormGroup = this.formBuilder.group({});
  masterForm: FormGroup = this.formBuilder.group({
    mastertName: new FormControl(''),
  });

  ngOnInit() {
    this.accountService.user.subscribe((user) => {
      if (user) {
        this.org = user['organizationCode'];
      }
    });
    // this.formCreation()

    this.userManService.getDropdownForMaster('DocumentTemplates', 'UAM').subscribe((covers) => {
      this.coverMaster = covers;
    });

    this.route.params.subscribe((param) => {
      if (param.masterType) {
        this.masterType = param.masterType;
        this.masterForm.get('mastertName').setValue(param.masterType);
        this.userManService.getMasterData(param.masterType, param.id).subscribe((value) => {
          this.masterData = value;
          this.onMasterChange(
            param.masterType,
            this.coverTypeDetails.find((cover) => cover.masterType === param.masterType).detailsTag,
          );
        });
      }
    });
  }

  navigateTo() {
    this.router.navigate(['user-management/']);
  }

  // formCreation(){

  // // Test Data from FormService

  //     // const formStructure = this.formService.getFormStructure();
  //     // let newFormStructure = formStructure['screens']
  //     // let newFormStructure = formStructure[0].screens

  //   // let formGroup: Record<string, any> = {};
  //   // newFormStructure?.forEach(control => {
  //   //   let controlValidators: Validators[] = [];

  //   //   if (control.validators) {
  //   //     control.validators.forEach(validation => {
  //   //       if (validation.validatorName === 'required') controlValidators.push(Validators.required);
  //   //       if (validation.validatorName === 'email') controlValidators.push(Validators.email);
  //   //       if (validation.validatorName === 'minlength') controlValidators.push(Validators.minLength);
  //   //       if (validation.validatorName === 'maxlength') controlValidators.push(Validators.maxLength);
  //   //       if (validation.validatorName === 'pattern') controlValidators.push(Validators.pattern);
  //   //       // Add more built-in validators as needed

  //   //     });
  //   //     formGroup[control.name] = [control.value || '', controlValidators];
  //   //      this.formDataNew.push(control)

  //   //   }

  //   //   if(control.isLoadedFromMaster === true && control.type === 'select'){

  //   //   const masterCodes = [];
  //   //   if (
  //   //     control.masterValue &&
  //   //     masterCodes.indexOf(control.masterValue) === -1
  //   //   ) {
  //   //     masterCodes.push(control.masterValue);
  //   //   }

  //   //   this.masterCount = masterCodes.length

  //   //   }

  //   // //

  //   //   // console.log('✅NEWFORMDATA',this.formDataNew)

  //   // this.dynamicForm = this.formBuilder.group(formGroup);

  //   // });

  //   // let masterCodes = [];
  //   // newFormStructure?.forEach(items => {
  //   //   if (
  //   //     items.masterValue &&
  //   //     masterCodes.indexOf(items.masterValue) === -1
  //   //   ) {
  //   //     masterCodes.push(items.masterValue);
  //   //   }
  //   // })

  //   // masterCodes.forEach(master => {
  //   //   this.userManService.getDropdownFromMaster(master).subscribe((dropdown: any[]) => {

  //   //     newFormStructure.forEach(controls => {
  //   //       if(controls.masterValue && master === controls.masterValue){
  //   //         controls.options = dropdown
  //   //       }

  //   //     })

  //   //     // THe Values Here has to be Pushed to OPtions Array

  //   //     // this.dropDownList = dropdown;
  //   //     // console.log('🚗DROPLIST',this.dropDownList);
  //   //     // this.selectBranchForm = new FormGroup({
  //   //     //   branch: new FormControl(this.currentUser.branchCode),
  //   //     //   searchBranch: new FormControl('')
  //   //     // });
  //   //   }, error => {
  //   //     // this.branchList = [];
  //   //   });
  //   // })

  //   //

  // }

  validationFunc(validators, controlValidators) {
    validators.forEach((validation) => {
      if (validation.validatorName === 'required') controlValidators.push(Validators.required);
      if (validation.validatorName === 'email') controlValidators.push(Validators.email);
      if (validation.validatorName === 'minlength') controlValidators.push(Validators.minLength);
      if (validation.validatorName === 'maxlength') controlValidators.push(Validators.maxLength);
      if (validation.validatorName === 'pattern')
        controlValidators.push(Validators.pattern(validation.pattern));
    });
  }

  onMasterChange(event, type?) {
    this.formDataNew = [];

    const formData = {
      formType: 'Long',
      online: true,
      productId: event.value ? event.value : event,
    };

    // Actual API Values

    this.userManService.getFormData(formData).subscribe(
      (values) => {
        // const formStructure =  values['screens']
        // console.log('🚗FORMSS', formStructure[0].screens)
        // let newFormStructure = formStructure['screens']
        this.formDataNew = [];
        let newFormStructure = values['screens'];
        // let newFormStructure = masterFormData['screens']
        this.screens = newFormStructure;

        let formGroup: Record<string, any> = {};
        newFormStructure?.forEach((control) => {
          let controlValidators: Validators[] = [];
          this.validationFunc(control.validators, controlValidators);
          if (!control.isDependent) {
            // console.log(control.name,control.radioOptions)
            formGroup[control.name] = [
              type
                ? typeof this.masterData[type][control.name] === 'boolean'
                  ? this.masterData[type][control.name].toString()
                  : this.masterData[type][control.name]
                : control.value || '',
              controlValidators,
            ];
            this.formDataNew.push(control);
          }

          if (control.isLoadedFromMaster === true && control.type === 'select') {
            const masterCodes = [];
            if (control.masterValue && masterCodes.indexOf(control.masterValue) === -1) {
              masterCodes.push(control.masterValue);
            }

            masterCodes.forEach((master) => {
              this.userManService.getDropdownFromMasterForUam(master).subscribe(
                (dropdown: any[]) => {
                  newFormStructure.forEach((controls) => {
                    if (controls.masterValue && master === controls.masterValue) {
                      controls.options = dropdown;
                    }
                  });

                  // THe Values Here has to be Pushed to OPtions Array

                  // this.dropDownList = dropdown;
                  // console.log('🚗DROPLIST',this.dropDownList);
                  // this.selectBranchForm = new FormGroup({
                  //   branch: new FormControl(this.currentUser.branchCode),
                  //   searchBranch: new FormControl('')
                  // });
                },
                (error) => {
                  // this.branchList = [];
                },
              );
            });

            //    this.userManService.getDropdownFromMaster('getAllBranches').subscribe((dropdown: any[]) => {
            //   this.dropDownList = dropdown;
            //   console.log(this.dropDownList);
            //   // this.selectBranchForm = new FormGroup({
            //   //   branch: new FormControl(this.currentUser.branchCode),
            //   //   searchBranch: new FormControl('')
            //   // });
            // }, error => {
            //   // this.branchList = [];
            // });

            // if(control.id === this.selectedMaster){
            // this.formDataNew.push(control)

            // }

            this.masterCount = masterCodes.length;
          }

          this.dynamicForm = this.formBuilder.group(formGroup);
          console.log(this.dynamicForm);
          if (this.masterData && this.dynamicForm.get('isCoverAvailable')) {
            this.onRadioChange(
              this.formDataNew.find((form) => form.name === 'isCoverAvailable'),
              this.dynamicForm.get('isCoverAvailable').value,
              this.coverTypeDetails.find((cover) => cover.masterType === this.masterType)
                .detailsTag,
            );
          }
        });
      },
      (error) => {
        const message = error ? error : 'Something went wrong.Please try again';
        const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
        dialogRef.afterClosed().subscribe((data) => {
          // navigate
          // this.router.navigate(['/user/view-user']);
        });
      },
    );
  }

  getErrorMessage(control) {
    const formControl = this.dynamicForm.get(control.name);
    for (let validation of control.validators) {
      if (formControl.hasError(validation.validatorName)) {
        return validation.message;
      }
    }
    return '';
  }

  onRadioChange(control, event, type?) {
    console.log(control, event, type);
    if (control.hasDependents) {
      this.screens.forEach((form) => {
        if (form.isDependent && form.dependentControl === control.name) {
          console.log(form);
          if (
            form.isVisibleIf.findIndex((keyVal) => keyVal === (event.value ? event.value : event)) >
            -1
          ) {
            let controlValidators: Validators[] = [];
            this.validationFunc(control.validators, controlValidators);
            if (form.name === 'coverIdName') {
              this.dynamicForm.addControl(
                form.name,
                new FormControl(type ? this.masterData[type]['coverId'] : '', ...controlValidators),
              );
            } else {
              this.dynamicForm.addControl(
                form.name,
                new FormControl(type ? this.masterData[type][form.name] : '', ...controlValidators),
              );
            }
            this.formDataNew.findIndex((reqform) => reqform.name === form.name) === -1
              ? this.formDataNew.push(form)
              : '';
            console.log(this.formDataNew);
          } else {
            console.log(form.name);
            this.dynamicForm.get(form.name) ? this.dynamicForm.removeControl(form.name) : '';
            this.formDataNew = this.formDataNew.filter((reqform) => reqform.name !== form.name);
          }
        }
      });
    }
  }

  onSubmit() {
    console.log('inside onsubmit');
    let newFormControls = this.dynamicForm.value;
    let reqBody = {};

    if (this.masterForm.get('mastertName').value === 'Lov_Code') {
      let reqBody = {
        masterType: this.masterForm.get('mastertName').value,
        masterData: {
          id: this.dynamicForm?.get('id').value,
          masterName: this.dynamicForm?.get('masterName').value,
          productId: this.dynamicForm?.get('productId').value,
          value: this.dynamicForm?.get('value').value,
        },
        orgCode: this.org,
      };

      this.userManService.submitMaster(reqBody).subscribe((res) => {
        if (res.returnCode !== 0) {
          const message = res.returnMessage;
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
          dialogRef.afterClosed().subscribe((data) => {
            // navigate
            // this.router.navigate(['/user/view-user']);
          });
        } else {
          const message = res.returnMessage;
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
          dialogRef.afterClosed().subscribe((data) => {
            this.dynamicForm.reset();
            // navigate
            // this.router.navigate(['/user/view-user']);
          });
        }
      });
    } else if (this.masterForm.get('mastertName').value === 'Covers') {
      let reqBody = {
        masterType: this.masterForm.get('mastertName').value,
        masterData: {
          productName: this.formDataNew
            .find((control) => control.name === 'productId')
            .options.find((option) => option.id === this.dynamicForm.get('productId').value).value,
          productId: this.dynamicForm?.get('productId')?.value,
          lob: this.dynamicForm?.get('Lob')?.value,
          isCoverAvailable: this.dynamicForm?.get('IsCover')?.value,
          coverId: '',
          coverName: '',
          helpText: this.dynamicForm?.get('helpText')?.value,
          coverType: this.dynamicForm?.get('coverType')?.value,
          insuredObject: this.dynamicForm?.get('insuredObj')?.value,
          benifitDesc: this.dynamicForm?.get('benefitDesc')?.value,
          separateSi: this.dynamicForm?.get('seperateSi')?.value,
        },
        orgCode: this.org,
      };
      if (this.formDataNew.findIndex((form) => form.name === 'coverIdName') > -1) {
        reqBody.masterData['coverId'] = this.dynamicForm.get('coverIdName').value;
        const formIndex = this.formDataNew.findIndex((form) => form.name === 'coverIdName');
        reqBody.masterData['coverName'] = this.formDataNew[formIndex].options.find(
          (option) => option.id === this.dynamicForm.get('coverIdName').value,
        ).value;
      } else {
        reqBody.masterData['coverId'] = this.dynamicForm.get('coverId').value;
        reqBody.masterData['coverName'] = this.dynamicForm.get('coverName').value;
      }
      this.userManService.submitMaster(reqBody).subscribe((res) => {
        if (res.returnCode !== 0) {
          const message = res.returnMessage;
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
          dialogRef.afterClosed().subscribe((data) => {
            // navigate
            // this.router.navigate(['/user/view-user']);
          });
        } else {
          const message = res.returnMessage;
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
          dialogRef.afterClosed().subscribe((data) => {
            this.dynamicForm.reset();
            // navigate
            // this.router.navigate(['/user/view-user']);
          });
        }
      });
    } else if (this.masterForm.get('mastertName').value === 'Medical_Question') {
      console.log(this.dynamicForm);
      let reqBody = {
        masterType: this.masterForm.get('mastertName').value,
        masterData: {
          productId: this.dynamicForm?.get('productId')?.value,
          type: this.dynamicForm?.get('type')?.value,
          code: this.dynamicForm?.get('code')?.value,
          questionId: this.dynamicForm?.get('questionId')?.value,
          questionType: this.dynamicForm?.get('questionType')?.value,
          questionText: this.dynamicForm?.get('questionText')?.value,
          formData: null,
          positiveAnswer: this.dynamicForm?.get('positiveAnswer')?.value,
          restrictOnNegative:
            this.dynamicForm?.get('restrictOnNegative')?.value === 'true' ? true : false,
        },
        orgCode: this.org,
      };
      console.log(reqBody);
      this.userManService.submitMaster(reqBody).subscribe((res) => {
        if (res.returnCode !== 0) {
          const message = res.returnMessage;
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
          dialogRef.afterClosed().subscribe((data) => {
            // navigate
            // this.router.navigate(['/user/view-user']);
          });
        } else {
          const message = res.returnMessage;
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
          dialogRef.afterClosed().subscribe((data) => {
            this.dynamicForm.reset();
            // navigate
            this.router.navigate(['/user/view-user']);
          });
        }
      });
    } else if (this.masterForm.get('mastertName').value === 'Branch') {
      this.submitBranchMaster();
    }
  }

  // getErrorMessage(control: any) {
  //   const formControl = this.dynamicForm.get(control.name);

  //   if (!formControl) {
  //     return '';
  //   }

  //   for (let validation of control.validations) {
  //     if (formControl.hasError(validation.name)) {
  //       return validation.message;
  //     }
  //   }

  //   return '';
  // }

  // addOnSelectionChange(event: any){
  //   console.log('😁',event.value)
  //   this.selectedMaster = event.value
  //   this.formDataNew = [];
  //   // this.formCreation()
  // }

  submitBranchMaster() {
    console.log(this.dynamicForm);
    // let reqBody = {
    //   masterType: 'Branch',
    //   masterData: {
    //     branchCode: '792',
    //     branchName: 'Alapulaaaa',
    //     branchCategory: 'NA',
    //     branchArea: 'Kerala',
    //     zoneCode: '998',
    //     zoneName: 'Kerala zone',
    //     ifscCode: 'KALBR000002',
    //     addressLine1: 'hshsjj.jsjjskisdhdhhhs',
    //     addressLine2: 'hhdhjs9sks/kslkaall',
    //     addressLine3: 'hhdhjs9sks/kslkaall',
    //     pincode: '5682901',
    //     cluster: 'Aluvvaaa',
    //     latitude: '',
    //     longitude: '',
    //   },
    //   orgCode: 'CSB',
    // };
    let reqBody = {
      masterType: this.masterForm.get('mastertName').value,
      masterData: {
        branchName: this.dynamicForm?.get('branchName')?.value,
        branchCode: this.dynamicForm?.get('branchCode')?.value,
        branchCategory: this.dynamicForm?.get('branchCategory')?.value,
        branchArea: this.dynamicForm?.get('branchArea')?.value,
        zoneCode: this.dynamicForm?.get('zoneCode')?.value,
        zoneName: this.dynamicForm?.get('zoneName')?.value,
        ifscCode: this.dynamicForm?.get('ifscCode')?.value,
        addressLine1: this.dynamicForm?.get('addressLine1')?.value,
        addressLine2: this.dynamicForm?.get('addressLine2')?.value,
        addressLine3: this.dynamicForm?.get('addressLine3')?.value,
        pincode: this.dynamicForm?.get('pincode')?.value,
        cluster: this.dynamicForm?.get('cluster')?.value,
        latitude: this.dynamicForm?.get('latitude')?.value,
        longitude: this.dynamicForm?.get('longitude')?.value,
      },
      orgCode: this.org,
    };
    console.log(reqBody);
    this.userManService.submitMaster(reqBody).subscribe((res) => {
      if (res.returnCode !== 0) {
        const message = res.returnMessage;
        const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
        dialogRef.afterClosed().subscribe((data) => {
          // navigate
          // this.router.navigate(['/user-management/view-master']);
        });
      } else {
        const message = res.returnMessage;
        const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
        dialogRef.afterClosed().subscribe((data) => {
          this.dynamicForm.reset();
          // navigate
          this.router.navigate(['/user-management/view-master', { queryParams: { id: 3 } }]);
        });
      }
    });
  }
}
