import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MustMatch } from '@app/_helpers/must-match.validator';
import { AccountService } from '@app/_services';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-register-customer',
  templateUrl: './register-customer.component.html',
  styleUrls: ['./register-customer.component.css']
})
export class RegisterCustomerComponent implements OnInit {

  registrationForm: FormGroup;
  isErrorMsg;
  errorMsg;
  isLoading;
  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: ['', Validators.required],
      confirmMobileNo: ['', Validators.required],
    }, {
      validator: MustMatch('mobileNo', 'confirmMobileNo')
    });
  }

  get rf() { return this.registrationForm.controls; }

  registerCustomer() {
    this.isLoading = true;
    const customerInfo = {

      firstName: this.registrationForm.get('firstName').value,
      lastName: this.registrationForm.get('lastName').value,
      organizationCode: "BOM",
      branchCode: "HQ",
      mobileNo: this.registrationForm.get('mobileNo').value,
      userName: this.registrationForm.get('confirmMobileNo').value,
      email: this.registrationForm.get('email').value,
      roles: ["CUSTOMER"]
    };

    this.accountService.registerCustomer(customerInfo).subscribe(customer => {
      // console.log('success', customer);
      this.isLoading = false;
      this.router.navigate(['/quickquote']);
    }, error => {
      this.isLoading = false;
      this.isErrorMsg = true;
      this.errorMsg = error.error.message;
    });
  }

  disabled() {
    if (this.registrationForm.valid) {
      return false;
    } else {
      return true;
    }
  }

}
