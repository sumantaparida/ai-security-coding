import { Component, Inject, OnInit } from "@angular/core";
import { ValidationErrors } from "@angular/forms";
import { AbstractControl } from "@angular/forms";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-customer-mobile-no-dob-modal",
  templateUrl: "./customer-mobile-no-dob-modal.component.html",
  styleUrls: ["./customer-mobile-no-dob-modal.component.css"],
})
export class CustomerMobileNoDobModalComponent implements OnInit {
  formgp: FormGroup;
  maxDate: Date;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<CustomerMobileNoDobModalComponent>
  ) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();
    this.maxDate = new Date(currentYear - 18, currentMonth, currentDate);
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    console.log(this.data);
    this.formgp = new FormGroup({});
    if (this.data.mobilenumber === "" && this.data.dob === "") {
      this.formgp.addControl(
        "mobileNo",
        new FormControl("", [
          Validators.required,
          mobileNoValidator.atleast10Digit,
          mobileNoValidator.plus10Digit,
        ])
      );
      this.formgp.addControl("dob", new FormControl("", Validators.required));
    } else if (this.data.mobilenumber === "" && this.data.dob !== "") {
      this.formgp.addControl(
        "mobileNo",
        new FormControl("", [
          Validators.required,
          mobileNoValidator.atleast10Digit,
          mobileNoValidator.plus10Digit,
        ])
      );
    } else if (this.data.mobilenumber !== "" && this.data.dob === "") {
      this.formgp.addControl("dob", new FormControl("", Validators.required));
    }
    console.log(this.formgp);
  }
  onSubmit() {
    console.log(this.data.customerdetail);
    for (let key in this.formgp.value) {
      if (key === "dob") {
        const date = new Date(this.formgp.get(`${key}`).value),
          mnth = ("0" + (date.getMonth() + 1)).slice(-2),
          day = ("0" + date.getDate()).slice(-2);
        const dob = [date.getFullYear(), mnth, day].join("-");
        this.data.customerdetail[key] = dob;
      } else {
        this.data.customerdetail[key] = this.formgp.get(`${key}`).value;
      }
    }
    this.dialogRef.close(this.data.customerdetail);
  }
}

export class mobileNoValidator {
  static atleast10Digit(control: AbstractControl): ValidationErrors | null {
    if (control.value !== "") {
      if (control.value.toString().length < 10) return { atleast10Digit: true };
    }
    return null;
  }
  static plus10Digit(control: AbstractControl): ValidationErrors | null {
    if (control.value !== "") {
      if (control.value.toString().length > 10) return { atleast10Digit: true };
    }
    return null;
  }
}
