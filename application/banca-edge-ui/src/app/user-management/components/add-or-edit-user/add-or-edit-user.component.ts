import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/_models/user';
import { LoaderService } from '@app/_services/loader.service';
import { UserService } from '@app/_services/user.service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { userFormData } from '@app/user-management/services/form-service.service';
import { UserManagementService } from '@app/user-management/services/user-managent.service';
import { error } from 'console';
// import { User } from "src/app/models/user.model";
// import { userFormData } from "src/app/shared/mock-data/form-data";
// import { UserService } from "../../services/user.service";
import * as moment from 'moment';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-add-or-edit-user',
  templateUrl: './add-or-edit-user.component.html',
  styleUrls: ['./add-or-edit-user.component.css'],
})
export class AddOrEditUserComponent implements OnInit {
  formData = userFormData;
  formFields: FormGroup;
  currentUser: User;
  userToBeEdited: User;
  newUser: User;
  isAddView = false;
  usernameToEdit: string;
  masterCount = 0;
  allApiLoaded: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  allApiLoadedSubscription: Subscription;
  org;
  values;
  branchOptions;
  minDate;
  maxDate;
  isAdminBranchUser = false;
  isUamBranchUser = false;
  isInsurer;
  admin;
  userGroupOptions;
  userGroupOptionsCopy;
  isInsurerUser;
  isBranchUser;
  insurerAdmin = false;
  constructor(
    public userManService: UserManagementService,

    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private loaderService: LoaderService,
    private accountService: AccountService,
  ) {}

  ngOnInit(): void {
    this.minDate = new Date();
    this.loaderService.showSpinner(true);

    this.accountService.user.subscribe((user) => {
      if (user) {
        this.org = user['organizationCode'];
      }
    });
    this.newUser = new User();
    this.route.params.subscribe((param) => {
      if (param.username) {
        console.log(param.username);
        this.isAddView = false;
        // this.usernameToEdit = window.atob(param.username);
        this.usernameToEdit = param.username;
        console.log(this.usernameToEdit);
      } else {
        this.isAddView = true;
      }
    });
    this.userManService.user.subscribe((user) => {
      this.currentUser = user;
    });
    if (!this.isAddView) {
      this.userManService.getUserInfoByID(this.usernameToEdit).subscribe((data: any) => {
        console.log('✅DATA', data);
        data['insurerId'] = data['insurerId'].toString();
        data['licenseCode'] = data['licenseCode']?.slice(2);
        // data['sendEmailOnCreate'] = true
        console.log('got the data from API', data);
        this.userToBeEdited = data;
        if (data['isInsurerUser']) {
          this.isInsurerUser = true;
        } else {
          this.isBranchUser = true;
        }

        this.allApiLoadedSubscription = this.allApiLoaded.subscribe((count) => {
          console.log('got the count', count, this.masterCount);
          if (count === this.masterCount && count !== 0) {
            console.log('final form data', this.formData);

            this.allApiLoadedSubscription.unsubscribe();
            this.constructAnswersForEditFirstTime();
          }
        });
        this.fetchMastersData();
      });
    } else {
      this.allApiLoadedSubscription = this.allApiLoaded.subscribe((count) => {
        console.log('got the count', count, this.masterCount);
        if (count === this.masterCount && count !== 0) {
          console.log('final form data', this.formData);
          this.allApiLoadedSubscription.unsubscribe();
          this.constructAnswersForFirstTime();
        }
      });
      this.fetchMastersData();
    }
  }

  fetchMastersData() {
    const masterCodes = [];
    const medicalMasterCodes = [];
    this.formData.forEach((form) => {
      if (
        form.isLoadedFromMaster &&
        form.masterValue &&
        masterCodes.indexOf(form.masterValue) === -1
      ) {
        masterCodes.push(form.masterValue);
      }
    });
    this.masterCount = masterCodes.length;
    let apiCount = 0;
    masterCodes.forEach((master) => {
      this.userManService.getDropdownFromMaster(master).subscribe((dropdown: any[]) => {
        this.loaderService.showSpinner(false);
        this.formData.forEach((form) => {
          if (this.isAddView) {
            if (form.isLoadedFromMaster && form.masterValue && master === form.masterValue) {
              form.options = dropdown;
            }
            if (form.controlName === 'branchCode') {
              this.branchOptions = form.options;
              this.branchOptions.forEach((items) => {
                items['display'] = `${items['value']} - ${items['id']}`;
              });
              // this.branchOptions.sort()
              this.branchOptions.sort((a, b) => a.value.localeCompare(b.value));
            } else if (form.controlName === 'userGroups') {
              let unwantedRoles = [
                'ADMIN_POSP',
                'GI_POSP',
                'LI_POSP',
                'LRR',
                'PAYMENT_APPROVER',
                'ZONE_USER',
                'CUSTOMER',
              ];
              this.userGroupOptions = form.options.filter((userRoles) => {
                if (!unwantedRoles.includes(userRoles.value)) {
                  return userRoles;
                }
              });
            }
          } else if (!this.isAddView) {
            console.log('prinitng', form.masterValue);
            if (form.isLoadedFromMaster && form.masterValue && master === form.masterValue) {
              form.options = dropdown;
              console.log('dropdown=', dropdown);
            }

            if (form.controlName === 'branchCode') {
              // this.branchOptions = form.options
              this.branchOptions = form.options;
              this.branchOptions.forEach((items) => {
                items['display'] = `${items['value']} - ${items['id']}`;
                this.branchOptions.sort((a, b) => a.value.localeCompare(b.value));
              });
            } else if (form.controlName === 'userGroups') {
              // let unwantedRoles = ['17', '14', '15', '16', '18', '10', '3', '9'];
              let unwantedRoles = [
                'ADMIN_POSP',
                'GI_POSP',
                'LI_POSP',
                'LRR',
                'PAYMENT_APPROVER',
                'ZONE_USER',
                'CUSTOMER',
              ];

              this.userGroupOptions = form.options.filter((userRoles) => {
                if (!unwantedRoles.includes(userRoles.value)) {
                  return userRoles;
                }
              });
              console.log('usergroups', this.userGroupOptions, form.options);

              //new
              if (this.userToBeEdited?.insurerUser) {
                // let id = ['2', '4', '6'];
                let id = ['INSURER_SALES'];
                this.userGroupOptions = this.userGroupOptions.filter((obj) =>
                  id.includes(obj.value),
                );
                console.log('usergroups1', this.userGroupOptions);

                this.userGroupOptionsCopy = [...this.userGroupOptions];
                this.userGroupOptionsCopy.forEach((val) => {
                  val.disabled = false;
                  if (val.value === 'INSURER_SALES') {
                    val.disabled = true;
                  }
                });
              } else {
                // let id = ['4', '5', '8', '11', '7'];
                let id = ['INSURER_SALES', 'INSURER_OPS', 'GUEST_USER', 'CUSTOMER_CONSENT', 'SP'];
                this.userGroupOptions = this.userGroupOptions.filter(
                  (obj) => !id.includes(obj.value),
                );
                console.log('usergroups2', this.userGroupOptions);

                this.userGroupOptionsCopy = [...this.userGroupOptions];
                this.userGroupOptionsCopy.forEach((val) => {
                  val.disabled = false;
                  if (val.value === 'BRANCH_USER') {
                    val.disabled = true;
                  }
                });
              }

              // this.userGroupOptionsCopy = [...this.userGroupOptions];
            }
            // if(form.controlName === 'userGroups' && this.userToBeEdited?.isInsurerUser){
            //     this.userManService.getDropdownFromMaster('getAllAuthGroups').subscribe((dropdown: any[]) => {
            //         this.formData.forEach(form => {
            //                 let id = ['2','4', '6' ]
            //                 this.values = dropdown.filter(obj => id.includes(obj.id))
            //                 const requiredIndex = this.values.findIndex(val => {
            //                     return val.value === 'INSURER_SALES';
            //                 })
            //                 this.values.forEach(val => {

            //                     val.disabled = false
            //                 })
            //                 this.values[requiredIndex]['disabled'] = true;

            //            if(form.controlName === 'userGroups'){
            //                 form.options = this.values;
            //            }
            //         });
            //     });
            //     this.formFields.get('userGroups').setValue(['INSURER_SALES'])

            // }
            // if(form.controlName === 'userGroups' && this.userToBeEdited?.isInsurerUser === false){
            //     console.log('🚗BRANCH USER')
            //     this.userManService.getDropdownFromMaster('getAllAuthGroups').subscribe((dropdown: any[]) => {
            //         this.formData.forEach(form => {
            //             let id = ['4','5', '8', '9', '11']
            //             this.values = dropdown.filter(obj => !id.includes(obj.id))
            //             const requiredIndex = this.values.findIndex(val => {
            //                 return val.value === 'BRANCH_USER';
            //             })
            //             this.values.forEach(val => {

            //                 val.disabled = false
            //             })
            //             this.values[requiredIndex]['disabled'] = true;

            //              if(form.controlName === 'userGroups'){
            //              form.options = this.values;
            //             }
            //         });
            //     });
            //     this.formFields.get('userGroups').setValue(['BRANCH_USER'])

            // }
          }
        });
        ++apiCount;
        this.allApiLoaded.next(apiCount);
      });
    });
  }

  constructAnswersForFirstTime() {
    this.formFields = new FormGroup({});
    this.formData.forEach((form) => {
      if (!form.isDependent) {
        const validators = this.getValidatorsArray(form);

        if (
          form.initiallyDisabled &&
          form.controlName !== 'userName' &&
          form.controlName !== 'isInsurerUser'
        ) {
          if (form.controlType === 'checkbox') {
            this.formFields.addControl(
              form.controlName,
              new FormControl(
                this.isAddView ? true : this.userToBeEdited[form.controlName],
                validators,
              ),
            );
          } else {
            this.formFields.addControl(
              form.controlName,
              new FormControl(this.currentUser[form.controlName], validators),
            );
          }
          this.formFields.get(form.controlName).disable();
        } else {
          if (form.controlType === 'checkbox') {
            this.formFields.addControl(form.controlName, new FormControl(false, validators));
          } else {
            this.formFields.addControl(form.controlName, new FormControl('', validators));
          }
        }
      }
    });
    this.formFields.addControl('searchCtrl', new FormControl());
    if (this.formFields?.get('userGroups')) {
      this.formFields?.get('userGroups')?.disable();
    }
  }

  constructAnswersForEditFirstTime() {
    this.formFields = new FormGroup({});
    this.formData.forEach((form, index) => {
      // console.log('hi form', index);
      // console.log('form dependent', form.isDependent);
      const validators = this.getValidatorsArray(form);
      if (!form.isDependent) {
        if (form.controlType === 'checkbox' && form.controlName !== 'sendEmailOnCreate') {
          console.log('looking', form.controlName);
          this.formFields.addControl(
            form.controlName,
            new FormControl(
              this.userToBeEdited[form.controlName] === ''
                ? this.userToBeEdited[form.controlName]
                : true,
              validators,
            ),
          );
        } else if (form.controlType !== 'checkbox') {
          console.log(typeof this.userToBeEdited[form.controlName], form.controlName);

          this.formFields.addControl(
            form.controlName,
            new FormControl(
              typeof this.userToBeEdited[form.controlName] == 'object'
                ? [...this.userToBeEdited[form.controlName]]
                : this.userToBeEdited[form.controlName],
              validators,
            ),
          );
          console.log(this.userToBeEdited[form.controlName], this.formFields);
        }

        if (form.initiallyDisabled) {
          this.formFields.get(form.controlName)?.disable();
        }
      } else if (form.isDependent) {
        // console.log("else creating control", form.controlName,this.formFields.get(form.dependsOnControl).value);
        const dependentResult = form.fieldVisibleIfDependentValueIn.some((field) => {
          return this.formFields.get(form.dependsOnControl)?.value === field;
        });
        // console.log(dependentResult)
        if (dependentResult) {
          if (form.controlType === 'checkbox') {
            this.formFields.addControl(
              form.controlName,
              new FormControl(
                this.userToBeEdited[form.controlName]
                  ? this.userToBeEdited[form.controlName]
                  : false,
                validators,
              ),
            );
          } else {
            this.formFields.addControl(
              form.controlName,
              new FormControl(this.userToBeEdited[form.controlName], validators),
            );
          }
          if (form.initiallyDisabled) {
            this.formFields.get(form.controlName).disable();
          }
        }
      }
    });
    if (this.userToBeEdited?.insurerUser) {
      this.checkInsurerIsAdmin(this.userToBeEdited?.userGroups);
    } else {
      this.checkBranchUserIsAdmin(this.userToBeEdited?.userGroups);
    }

    this.formFields.addControl('searchCtrl', new FormControl());
    if (!this.isAddView) {
      console.log('this.form', this.formFields);
      this.formFields.get('userGroups').setValue([...this.userToBeEdited?.userGroups]);
    }
    // this.alterUserRoles('isInsurerUser', this.formFields.get('isInsurerUser').value);

    console.log(this.formFields);
  }

  getValidatorsArray(formData): any[] {
    const validatorsArray = [];
    Object.keys(formData.validators).forEach((validatorKey) => {
      if (validatorKey === 'required') {
        validatorsArray.push(Validators.required);
      } else if (validatorKey === 'minLength') {
        validatorsArray.push(Validators.minLength(formData.validators.minLength));
      } else if (validatorKey === 'maxLength') {
        validatorsArray.push(Validators.maxLength(formData.validators.maxLength));
      } else if (validatorKey === 'min') {
        validatorsArray.push(Validators.min(formData.validators.min));
      } else if (validatorKey === 'max') {
        validatorsArray.push(Validators.max(formData.validators.max));
      } else if (validatorKey === 'email' && formData.validators[validatorKey]) {
        validatorsArray.push(Validators.email);
      } else if (validatorKey === 'pattern') {
        validatorsArray.push(Validators.pattern(formData.validators.pattern));
      }
    });
    return validatorsArray;
  }

  onDateChanged(controlName, event: MatDatepickerInputEvent<Date>) {
    console.log(controlName, event);
    if (this.isAddView) {
      this.newUser[controlName] = moment(new Date(event.value)).format('YYYY-MM-DD');
    } else {
      this.userToBeEdited[controlName] = moment(new Date(event.value)).format('YYYY-MM-DD');
    }
  }

  selectedInsurerUser() {
    this.formFields.get('userGroups').reset();

    this.userGroupOptionsCopy = [...this.userGroupOptions];

    this.isInsurer = true;
    this.formFields.get('userGroups').setValue(['INSURER_SALES']);
    console.log(this.formFields);

    this.formData.forEach((form) => {
      if (form.controlName === 'userGroups') {
        // let id = ['2', '4', '6'];
        let id = [ 'INSURER_SALES'];

        this.userGroupOptionsCopy = form.options.filter((obj) => id.includes(obj.value));

        this.userGroupOptionsCopy.forEach((val) => {
          val.disabled = false;
          if (val.value === 'INSURER_SALES') {
            val.disabled = true;
          }
        });
      }
    });
  }
  selectedBranchUser() {
    this.userGroupOptionsCopy = [...this.userGroupOptions];
    this.formFields.get('userGroups').reset();

    this.formData.forEach((form) => {
      if (form.controlName === 'isInsurerUser') {
        // let id = ['4', '5', '8', '11', '7'];
        let id = ['INSURER_SALES', 'INSURER_OPS', 'GUEST_USER', 'CUSTOMER_CONSENT', 'SP'];

        this.userGroupOptionsCopy = this.userGroupOptionsCopy.filter(
          (obj) => !id.includes(obj.value),
        );
        this.formFields.get('userGroups').setValue(['BRANCH_USER']);
        this.userGroupOptionsCopy.forEach((val) => {
          val.disabled = false;
          if (val.value === 'BRANCH_USER') {
            val.disabled = true;
          }
        });
      }

      if (form.controlName === 'userGroups') {
        console.log(form.options, 'options');
      }
    });
  }

  // onSelectionChangedNew(control, event) {}
  onSelectionChanged(controlName, event) {
    console.log('controledu', controlName, event);

    if (controlName === 'isInsurerUser' && event.value === true) {
      this.formFields?.get('userGroups')?.enable();
      this.isInsurerUser = true;
      this.isBranchUser = false;
      console.log('controledu', controlName);
      this.selectedInsurerUser();
    } else if (controlName === 'isInsurerUser' && event.value === false) {
      this.formFields?.get('userGroups')?.enable();
      this.isInsurerUser = false;
      this.isBranchUser = true;
      this.selectedBranchUser();
    }
    console.log(controlName, event);
    console.log("check this value", this.isBranchUser);
    if (controlName === 'userGroups' && event.value) {
      
      if (this.isInsurerUser) {
        this.checkInsurerIsAdmin(event.value);
      } else if (this.isBranchUser) {
        console.log('coming inside brnach user');
        this.checkBranchUserIsAdmin(event.value);
      }
    }

    //   dunoo what logic is this so commenting 04 march 2025 by vk
    // -----
    //roles = roles.findIndex((role) => role === 'UAM_USER') > -1
    //   ? roles?.splice(
    //       0,
    //       roles?.findIndex((role) => role === 'UAM_USER'),
    //     )
    //   : '';

    // roles = roles?.findIndex((role) => role === 'REPORT_USER') > -1
    //   ? roles?.splice(
    //       0,
    //       roles?.findIndex((role) => role === 'REPORT_USER'),
    //     )
    //   :  '';
    // ----
    //   }

    if (this.isAddView) {
      this.newUser[controlName] = event.value;
      console.log('new user', this.newUser);
    } else {
      this.userToBeEdited[controlName] = event.value;
      console.log('edit user', this.userToBeEdited);
    }
    // this.alterUserRoles(controlName, event);
  }

  checkInsurerIsAdmin(roles) {
    console.log('check ROLES', roles);
    this.formFields.get('userGroups').setValue([...roles]);

    if (roles.includes('ADMIN')) {
      this.insurerAdmin = true;
      this.userGroupOptionsCopy.forEach((val) => {
        val.disabled = false;
        if (val.value === 'REPORT_USER' || val.value === 'INSURER_SALES') {
          val.disabled = true;
          this.formFields.get('userGroups').setValue(['REPORT_USER', ...roles]);
        }
      });
    } else {
      this.insurerAdmin = false;
      this.userGroupOptionsCopy.forEach((val) => {
        if (val.value === 'REPORT_USER') {
          val.disabled = false;
        }
      });
      this.formFields.get('userGroups').setValue([...roles]);
    }
    console.log(this.formFields.get('userGroups').value);
  }

  checkBranchUserIsAdmin(roles) {
    console.log(this.formFields.get('userGroups'), roles, this.userGroupOptionsCopy);
    // this.formFields.get('userGroups').setValue([...roles]);

    if (roles.includes('ADMIN')) {
      this.isAdminBranchUser = true;
      this.isUamBranchUser = false;
      this.userGroupOptionsCopy.forEach((val) => {
        if (
          val.value === 'UAM_USER' ||
          val.value === 'REPORT_USER' ||
          val.value === 'BRANCH_USER'
        ) {
          val.disabled = true;
        } else {
          val.disabled = false;
        }
      });
      this.formFields.get('userGroups').setValue([...roles]);
      console.log('VALUES', this.formFields.get('userGroups').value);
    } else if (roles.includes('UAM_USER')) {
      this.isUamBranchUser = true;
      this.isAdminBranchUser = false;
      this.userGroupOptionsCopy.forEach((val) => {
        if (val.value === 'ADMIN' || val.value === 'REPORT_USER' || val.value === 'BRANCH_USER') {
          val.disabled = true;
        } else {
          val.disabled = false;
        }
      });
      this.formFields.get('userGroups').setValue([...roles]);
      console.log('VALUES', this.formFields.get('userGroups').value);
    } else {
      this.isUamBranchUser = false;
      this.isAdminBranchUser = false;
      this.userGroupOptionsCopy.forEach((val) => {
        if (val.value !== 'BRANCH_USER') {
          console.log(val);
          val.disabled = false;
        } else return true;
      });
      console.log(this.formFields);
      this.formFields.get('userGroups')?.setValue([...roles]);
    }
  }

  // alterUserRoles(controlName, event) {
  //   let value = event.hasOwnProperty('value') ? event.value : event;
  //   console.log(value, 'innn');
  //   if (controlName === 'isInsurerUser' && value === true) {
  //     this.formFields.get('userGroups').reset();

  //     this.userGroupOptionsCopy = [...this.userGroupOptions];
  //     console.log(value);
  //     this.isInsurer = true;
  //     this.formFields.get('userGroups').setValue(['INSURER_SALES']);
  //     console.log(this.formFields);

  //     this.formData.forEach((form) => {
  //       if (form.controlName === 'userGroups') {
  //         // let id = ['2', '4', '6'];
  //         let id = ['ADMIN', 'INSURER_SALES', 'REPORT_USER'];

  //         this.userGroupOptionsCopy = form.options.filter((obj) => id.includes(obj.value));

  //         this.userGroupOptionsCopy.forEach((val) => {
  //           val.disabled = false;
  //           if (val.value === 'INSURER_SALES') {
  //             val.disabled = true;
  //           }
  //         });
  //       }
  //     });

  //     if (controlName === 'userGroups' && event.value) {
  //       if (this.formFields.get('userGroups').value.includes('ADMIN')) {
  //         console.log('VALUES', this.userGroupOptionsCopy, value);

  //         this.userGroupOptionsCopy.forEach((val) => {
  //           val.disabled = false;
  //           if (val.value === 'INSURER_SALES' || val.value === 'REPORT_USER') {
  //             val.disabled = true;
  //             this.formFields.get('userGroups').setValue(['INSURER_SALES', 'REPORT_USER', 'ADMIN']);
  //           }
  //         });
  //       } else {
  //         console.log('VALUES', this.userGroupOptionsCopy, value);

  //         this.userGroupOptionsCopy.forEach((val) => {
  //           val.disabled = false;
  //           if (val.value === 'INSURER_SALES') {
  //             val.disabled = true;
  //             this.formFields.get('userGroups').setValue(['INSURER_SALES']);
  //           }
  //         });
  //       }
  //     }
  //   } else if (controlName === 'isInsurerUser' && value === false) {
  //     this.userGroupOptionsCopy = [...this.userGroupOptions];
  //     this.formFields.get('userGroups').reset();

  //     this.isInsurer = false;

  //     //   this.userManService.getDropdownFromMaster('getAllAuthGroups').subscribe((dropdown: any[]) => {
  //     this.formData.forEach((form) => {
  //       if (controlName === form.controlName) {
  //         //   if (form.controlName === 'userGroups') {
  //         // let id = ['4', '5', '8', '11', '7'];
  //         let id = ['INSURER_SALES', 'INSURER_OPS', 'GUEST_USER', 'CUSTOMER_CONSENT', 'SP'];

  //         this.userGroupOptionsCopy = this.userGroupOptionsCopy.filter(
  //           (obj) => !id.includes(obj.value),
  //         );
  //         this.formFields.get('userGroups').setValue(['BRANCH_USER']);
  //         this.userGroupOptionsCopy.forEach((val) => {
  //           val.disabled = false;
  //           if (val.value === 'BRANCH_USER') {
  //             val.disabled = true;
  //           }
  //         });
  //       }

  //       if (form.controlName === 'userGroups') {
  //         console.log(form.options, 'options');
  //       }
  //     });
  //     //   });
  //     //   let rolesArr = [];

  //     //   this.userToBeEdited.userGroups.forEach((val) => {
  //     //     rolesArr.push(val);
  //     //   });
  //     //   this.formFields.get('userGroups').setValue(['BRANCH_USER', ...rolesArr]);
  //   }
  //   console.log(this.formData, event.value);
  //   // if (controlName === 'userGroups' && event.value) {
  //   //   if (this.formFields.get('userGroups').value.includes('ADMIN')) {
  //   //     console.log('VALUES', this.values, value);

  //   //     this.userGroupOptionsCopy.forEach((val) => {
  //   //       val.disabled = false;
  //   //       if (val.value === 'INSURER_SALES' || val.value === 'REPORT_USER') {
  //   //         val.disabled = true;
  //   //         this.formFields.get('userGroups').setValue(['INSURER_SALES', 'REPORT_USER', 'ADMIN']);
  //   //       }
  //   //     });
  //   //   } else if (!this.formFields.get('userGroups').value.includes('ADMIN')) {
  //   //   }
  //   // }

  //   // NEWCONDITION
  // }

  onCheckboxChanged(controlName, event) {
    if (controlName === 'sp' && event.checked === true) {
      console.log(this.userGroupOptionsCopy);
      // this.userManService.getDropdownFromMaster('getAllAuthGroups').subscribe((dropdown: any[]) => {
      // this.formData.forEach((form) => {
      //   if (controlName === form.controlName) {
      //     let id = ['4', '5', '8', '9', '11'];
      //     this.values = dropdown.filter((obj) => !id.includes(obj.id));

      //     this.values.forEach((val) => {
      //       val.disabled = false;
      //       if (val.value === 'SP' || val.value === 'BRANCH_USER') {
      //         val.disabled = true;
      //       }
      //     });
      //     console.log('VALUES', this.values);

      //   }
      //   if (form.controlName === 'userGroups') {
      //     form.options = this.values;
      //   }
      // });
      this.formFields.get('userGroups').value.push('SP');
      // });
    } else if (controlName === 'sp' && event.checked === false) {
      console.log(this.userGroupOptionsCopy);

      // this.userManService.getDropdownFromMaster('getAllAuthGroups').subscribe((dropdown: any[]) => {
      //   this.formData.forEach((form) => {
      //     if (controlName === form.controlName) {
      //       let id = ['4', '5', '8', '9', '11', '7'];
      //       this.values = dropdown.filter((obj) => !id.includes(obj.id));
      //       const requiredIndex = this.values.findIndex((val) => {
      //         return val.value === 'BRANCH_USER';
      //       });
      //       this.values.forEach((val) => {
      //         val.disabled = false;
      //       });
      //       this.values[requiredIndex]['disabled'] = true;
      //     }
      //     if (form.controlName === 'userGroups') {
      //       form.options = this.values;
      //     }
      //   });
      let otherThanSP = this.formFields.get('userGroups').value.filter((val) => val !== 'SP');
      console.log('otherthan', otherThanSP, this.formFields.get('userGroups').value);
      this.formFields.get('userGroups').setValue(otherThanSP);
      // });
    }
    if (this.isAddView) {
      this.newUser[controlName] = event.checked;
    } else {
      this.userToBeEdited[controlName] = event.checked;
      console.log('edit user', this.userToBeEdited);
    }
  }

  onDropdownSelectionChange(event) {}
  onRadioChange(a, b) {}

  onRolesSelectionChange(event) {
    console.log(event.target.value, 'targetted');
  }

  onDataChanged(controlName, event) {
    console.log(controlName, event);
    if (this.isAddView) {
      this.newUser[controlName] = event.target.value;
    } else {
      this.userToBeEdited[controlName] = event.target.value;
    }
  }

  navigateTo() {
    this.router.navigate(['user-management/']);
  }

  onBranchChange($event) {}

  onSubmit() {
    this.loaderService.showSpinner(true);
    if (this.isAdminBranchUser) {
      this.formFields.get('userGroups').value.push('UAM_USER');
      this.formFields.get('userGroups').value.push('REPORT_USER');
    } else if (this.isUamBranchUser) {
      this.formFields.get('userGroups').value.push('ADMIN');
      this.formFields.get('userGroups').value.push('REPORT_USER');
    }

    this.formData.forEach((form) => {
      if (this.formFields.get(form.controlName)) {
        if (form.controlType === 'date') {
          this.newUser[form.valueType] = moment(
            new Date(this.formFields.get(form.controlName).value),
          ).format('YYYY-MM-DD');
        } else if (form.prefix === true) {
          this.newUser[form.valueType] =
            form.prefixValue + this.formFields.get(form.controlName).value;
        } else {
          this.newUser[form.valueType] = this.formFields.get(form.controlName).value;
        }
      }
    });
    console.log('the form', this.formData);
    this.formData.forEach((form) => {
      if (this.formFields.get(form.controlName)) {
        console.log(
          'form.controlName',
          form.controlName,
          this.formFields.get(form.controlName).value,
        );
      }
    });
    if (this.isAddView) {
      if (this.formFields.get('isInsurerUser').value === false) {
        this.newUser.sp = this.formFields.get('sp')?.value;
      } else {
        // this.newUser['mappedBranchCode'] = ['9999'];
      }
      // this.newUser.isInsurerUser = this.currentUser['isInsurerUser'];
      this.newUser.sendEmailOnCreate = this.formFields.get('sendEmailOnCreate').value;
      // this.newUser.branchCode = '1150';
      console.log('hello', this.newUser);
      this.newUser.organizationCode = this.org;
      this.userManService.registerUser(this.newUser).subscribe(
        (user: any) => {
          // if (user['responseCode'] === 409){
          this.loaderService.showSpinner(false);

          const message = user['responseMessage'] ? user['responseMessage'] : '';
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
          dialogRef.afterClosed().subscribe((data) => {
            // navigate
            this.router.navigate(['/user-management']);
          });
          // }else{
          // console.log("added user successfully", user);
          // }
        },
        (error) => {
          this.loaderService.showSpinner(false);
          const message = error['responseMessage']
            ? error['responseMessage']
            : 'Unable to register User, Please try after Sometime.';
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
        },
      );
    } else {
      console.log('hello', this.userToBeEdited);
      this.userToBeEdited['licenseCode'] = 'SP' + this.userToBeEdited['licenseCode'];
      if (this.isAdminBranchUser) {
        this.userToBeEdited.userGroups.push('UAM_USER');
        this.userToBeEdited.userGroups.push('REPORT_USER');
      } else if (this.isUamBranchUser) {
        this.userToBeEdited.userGroups.push('ADMIN');
        this.userToBeEdited.userGroups.push('REPORT_USER');
      } else if (this.insurerAdmin) {
        this.userToBeEdited.userGroups.push('REPORT_USER');
      }
      console.log('before emoved duplicates', this.userToBeEdited);

      this.userToBeEdited.userGroups = [...new Set(this.userToBeEdited.userGroups)];
      console.log('removed duplicates', this.userToBeEdited);
      this.userManService.updateUser(this.userToBeEdited).subscribe((user) => {
        this.loaderService.showSpinner(false);
        let cMessage = '';
        if (user['responseCode'] === 0) {
          cMessage = 'Success';
        }
        // console.log("updated user", user);
        const message = user['responseMessage'] ? user['responseMessage'] : cMessage;
        const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
          data: message,
          panelClass: 'dialog-width',
        });
        dialogRef.afterClosed().subscribe((data) => {
          // navigate
          this.router.navigate(['/user-management']);
        });
      });
    }
  }
}
