import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '@app/_services/loader.service';
import { QuoteService } from '../quote.service';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';

@Component({
  selector: 'app-ckyc-modal',
  templateUrl: './ckyc-modal.component.html',
  styleUrls: ['./ckyc-modal.component.css'],
})
export class CkycModalComponent implements OnInit {
  idType = [
    { id: 'PAN', value: 'PAN',code:'D07' },
    { id: 'AADHAAR', value: 'AADHAAR',code:'D03' },
    { id: 'VOTER', value: 'Voter Id',code:'D01'  },
  ];

  ckycForm: FormGroup;

  displayFileName;

  fileUploadError: boolean;

  totalSize;

  myFile;

  hasError = false;

  constructor(
    private dialogRef: MatDialogRef<CkycModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private quoteService: QuoteService,
    private loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.ckycForm = new FormGroup({
      docType: new FormControl('', Validators.required),
      docNumber: new FormControl('', Validators.required),
   
    });
    if(this.data.bankOrgCode==='BOM'){
      this.ckycForm.addControl('fileUpload',new FormControl('',Validators.required))
    }
  }

  selectedType(event) {
    console.log(event);
    const type = event.value;
    if (type === 'PAN') {
      this.ckycForm
        .get('docNumber')
        .setValidators(
        [  Validators.pattern('^[A-Z]{3}[ABCFGHLJPTK][A-Z][0-9]{4}[A-Z]$'),Validators.required]
        );
        this.ckycForm.removeControl('aadhaarName');
    } else if (type === 'AADHAAR') {
     this.ckycForm.addControl('aadhaarName',new FormControl('',Validators.required));
    } else {
      this.ckycForm
        .get('docNumber')
        .setValidators([Validators.pattern('/^([a-zA-Z]){3}([0-9]){7}?$/g;'),Validators.required]);
     this.ckycForm.removeControl('aadhaarName');
    }
  }

  getCkyc() {
    let payload = {
      gender: this.data.gender,
      file: this.myFile,
      reqId:this.data.quoteId,
       idType:this.ckycForm.get('docType').value,
       idNum:this.ckycForm.get('docNumber').value,
       dob:this.data.dob,
       customerId:this.data.customerId,
       insurerId:this.data.insurerId,
       coverType:this.data.coverType,
       pinCode:this.data.pinCode,
       fullName:this.ckycForm.get('aadhaarName') ? this.ckycForm.get('aadhaarName').value : this.data.fullName,
    };
    this.loaderService.showSpinner(true);
    this.quoteService.getCkyc(payload).subscribe(
      (res) => {
        console.log('result =', res);
        this.loaderService.showSpinner(false);
        if(res['status']==='Failed'){
          this.dialogRef.close(res);
        } else if (res['ckycNumber'] !== '' && res['ckycNumber'] !== null) {
        const docId = this.idType.find(id=>{return id.id === this.ckycForm.get('docType').value}).code
        res['docId'] = docId
          console.log('move forward');
          this.dialogRef.close(res);
        } else {
          console.log('stay');
          this.hasError = true;
        }
        // this.dialogRef.close(res);
      },
      (err) => {
        this.hasError = true;
        console.log('error', err);
        this.loaderService.showSpinner(false);
      },
    );
  }

  getFileDetails(e) {
    console.log(e.target.files, 'date--date');
    let fileList = e.target.files;
    console.log(fileList, fileList.files);
    // for (let i = 0; i < fileList.length; i++) {
    //   this.displayFileName.push(fileList.item(i).name);
    // }

    console.log('file---', this.displayFileName);

    this.fileUploadError = false;
    let canUpload;
    for (var i = 0; i < e.target.files.length; i++) {
      let size = e.target.files[i].size;
      canUpload = this.calculateFilesSize(size);
      console.log('size=', size);
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[i]);
    }
    reader.onload = () => {
      // console.log(reader.result);
      if (canUpload) {
        this.myFile = reader.result;
      }
    };
    console.log('print files', this.myFile);
  }

  calculateFilesSize(size) {
    console.log('totalsize  --', this.totalSize, size);
    this.totalSize = this.totalSize + size;
    if (this.totalSize / 1024 > 1000) {
      this.totalSize = this.totalSize - size;
      this.fileUploadError = true;
      return false;
    } else {
      let newArr = [];
      console.log('totalsize=', this.totalSize);
      let fSExt = ['Bytes', 'KB', 'MB'];
      let j = 0;
      while (size > 900) {
        size /= 1024;
        j++;
      }
      let exactSizeNumber = Math.round(this.totalSize * 100) / 100;
      let exactSize = Math.round(size * 100) / 100 + fSExt[j];
      newArr.push(exactSize);
      console.log('FILE SIZE = ', j, exactSize, exactSizeNumber, newArr);
      // alert(exactSize);
      console.log(this.totalSize / 1024);

      this.fileUploadError = false;
      return true;
    }
  }

}
