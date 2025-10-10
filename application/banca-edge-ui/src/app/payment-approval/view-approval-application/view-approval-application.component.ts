import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ComprehensiveInsuranceSystemService } from '@app/comprehensive-insurance-system/services/comprehensive-insurance-system.service';
import { forkJoin } from 'rxjs';
import { PaymentApprovalService } from '../services/payment-approval.service';
import { LoaderService } from '@app/_services/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from '@app/_services';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { SimpleYesNoModalComponent } from '@app/shared/components/simple-yes-no-modal/simple-yes-no-modal.component';
import { CisModalComponent } from '@app/comprehensive-insurance-system/components/cis-modal/cis-modal.component';
import { bgrInsuranceType, insurerNameList, occupancyType, occupyingType, proposerRelationship } from './view-approval-masterList';
import { LmsService } from '@app/LMS/services/lms.service';


@Component({
  selector: 'app-view-approval-application',
  templateUrl: './view-approval-application.component.html',
  styleUrls: ['./view-approval-application.component.css']
})
export class ViewApprovalApplicationComponent implements OnInit {
  appNo;
  user;
  orgCode;
  cisApp;
  panelOpenState = false;
  applicationDetails;
  paymentId;
  insurerId;
  reqValData;
  element;
  proposerRelationship = proposerRelationship;
  insurerNameList = insurerNameList;
  bgrInsuranceType = bgrInsuranceType;
  occupancyType =occupancyType;
  occupyingType =occupyingType
  layoutMetaData = [
    {
    detailsKey:'productInfo',
    label: 'Policy Details',
    expandedByDefault: true,
    detailsData: [{
      name: 'Insurer Application number',
      key: 'productInfo',
      valueTag: 'insurerApplicationNo'
    },
    {
      name: 'Product Name',
      key: 'productInfo',
      valueTag: 'productName'
    }, {
      name: 'SP Code',
      key: 'agencyData',
      valueTag: 'spCode'
    
    }, {
      name: 'SP Name',
      key: 'agencyData',
      valueTag: 'spName'
    }, {
      name: 'Status',
      key: 'productInfo',
      valueTag: 'status'
    }, {
      name: 'Branch Code',
      key: 'productInfo',
      valueTag: 'branchCode'
    }, {
      name: 'Lead generator',
      key: 'agencyData',
      valueTag: 'lgCode'
    }, {
      name: 'Sum Assured',
      key: 'productInfo',
      valueTag: 'sumAssured'
    }, {
      name: 'Policy Term',
      key: 'productInfo',
      valueTag: 'pt'
    }, {
      name: 'Premium paying term',
      key: 'productInfo',
      valueTag: 'ppt'
    }
      , {
      name: 'Total Premium with GST',
      key: 'productInfo',
      valueTag: 'netPremium'
    }
      , {
      name: 'Base Premium',
      key: 'productInfo',
      valueTag: 'basePremium'
    }
      , {
      name: 'GST',
      key: 'productInfo',
      valueTag: 'gst'
    },{
      name: 'Insurance Type',
      key: 'productInfo',
      valueTag: 'insuranceType',
      getDiffVAl: true,
      getDetailFrom:'bgrInsuranceType',
    },
    {
      name: 'Insurance Type',
      key: 'productInfo',
      valueTag: 'insurancetocover',
    },
    {
      name: 'Occupancy Type',
      key: 'productInfo',
      valueTag: 'typeOfOccupancy',
    },  {
      name: 'Area',
      key: 'productInfo',
      valueTag: 'area'
    }, {
      name: 'Total Cost Of Construction',
      key: 'productInfo',
      valueTag: 'totalCostOfConstruction'
    }, {
      name: 'Age of Building',
      key: 'productInfo',
      valueTag: 'age'
    }, {
      name: 'Has Basement',
      key: 'productInfo',
      valueTag: 'hasBasement'
    }, {
      name: 'Occupying the premises as',
      key: 'productInfo',
      valueTag: 'owner',
      getDiffVAl: true,
      getDetailFrom:'occupyingType',
    }, {
      name: 'Hypothecation',
      key: 'productInfo',
      valueTag: 'hypothecation'
    }, {
      name: 'Branch Name',
      key: 'productInfo',
      valueTag: 'hypBranchName'
    }
      , {
      name: 'Loan Account Number',
      key: 'productInfo',
      valueTag: 'hypLoanAccountNo'
    }
      , {
      name: 'Vehicle Registartion Number',
      key: 'productInfo',
      valueTag: 'vehicleRegno'
    }
      , {
      name: 'Chassis Number',
      key: 'productInfo',
      valueTag: 'chassisNo'
    }
      , {
      name: 'Engine Number',
      key: 'productInfo',
      valueTag: 'engineNo'
    }
      , {
      name: 'IDV',
      key: 'productInfo',
      valueTag: 'idv'
    }
      , {
      name: 'Bank Name',
      key: 'productInfo',
      valueTag: 'bankName'
    }
      , {
      name: 'Branch Name',
      key: 'productInfo',
      valueTag: 'branchName'
    }
      , {
      name: 'Add on',
      key: 'productInfo',
      valueTag: 'addOn'
    }
      , {
      name: 'No Claim Bonus%',
      key: 'productInfo',
      valueTag: 'currNcb'
    }, {
      name: 'Transfer of NCB%',
      key: 'productInfo',
      valueTag: 'transferOfNCBPercent'
    }
      , {
      name: 'Make Name',
      key: 'productInfo',
      valueTag: 'makeName'
    }
      , {
      name: 'Model Name',
      key: 'productInfo',
      valueTag: 'modelName'
    }
      , {
      name: 'Own Damage(Years)',
      key: 'productInfo',
      valueTag: 'od'
    }
      , {
      name: 'Third Party(Years)',
      key: 'productInfo',
      valueTag: 'tp'
    }
      , {
      name: 'Seating Capacity',
      key: 'productInfo',
      valueTag: 'seatingCapacity'
    }
      , {
      name: 'Engine CC',
      key: 'productInfo',
      valueTag: 'engineCC'
    }
    ]
  },{
    detailsKey:'policyAddress',
    label: 'Payment Info',
    expandedByDefault: true,
    detailsData: [{
      name: 'Payment Type',
      key: 'paymentInfo',
      valueTag: 'paymentType'
    },
    {
      name: 'Account No',
      key: 'paymentInfo',
      valueTag: 'bankAccountNo'
    }, {
      name: 'Instrument No',
      key: 'paymentInfo',
      valueTag: 'instrumentNo'
    
    }, {
      name: 'Premium Payable',
      key: 'paymentInfo',
      valueTag: 'amountCollected'
    }, {
      name: 'Payment Date',
      key: 'paymentInfo',
      valueTag: 'instrumentDate'
    },{
      name: 'Beneficiary  Name',
      key: 'productInfo',
      valueTag: 'insurerId',
      getDiffVAl: true,
      getDetailFrom:'insurerNameList',
    }
    ]
  },{
    detailsKey:'productInfo',
    label: 'Proposer Details',
    expandedByDefault: true,
    detailsData: [{
      name: 'Title',
      key: 'proposer',
      valueTag: 'title'
    },
    {
      name: 'First Name',
      key: 'proposer',
      valueTag: 'firstName'
    },  {
      name: 'Middle Name',
      key: 'proposer',
      valueTag: 'middleName'
    }, {
      name: 'Last Name',
      key: 'proposer',
      valueTag: 'lastName'
    
    }, {
      name: 'Date of Birth',
      key: 'proposer',
      valueTag: 'dob'
    }, {
      name: 'Gender',
      key: 'proposer',
      valueTag: 'gender'
    }, {
      name: ' Marital Status',
      key: 'proposer',
      valueTag: 'maritalStatus'
    }, {
      name: 'Occupation',
      key: 'proposer',
      valueTag: 'occupation'
    }, {
      name: 'Pan Card',
      key: 'proposer',
      valueTag: 'panNo'
    }, {
      name: 'Email',
      key: 'proposer',
      valueTag: 'email'
    }
      , {
      name: 'Mobile No',
      key: 'proposer',
      valueTag: 'mobile'
    }
    ]
  },{
    detailsKey:'policyNominee',
    label: 'Policy Nominee',
    expandedByDefault: true,
    isArray:true,
    detailsData: [{
      name: 'Title',
      break:true,
      key: 'policyNominee',
      index:0,
      valueTag: 'title'
    },
    {
      name: 'First Name',
      key: 'policyNominee',
      index:0,
      valueTag: 'firstName'
    }, {
      name: 'Last Name',
      key: 'policyNominee',
      index:0,
      valueTag: 'lastName'
    
    }, {
      name: 'Date of Birth',
      key: 'policyNominee',
      index:0,
      valueTag: 'dob'
    }, {
      name: 'Gender',
      key: 'policyNominee',
      index:0,
      valueTag: 'gender'
    }, {
      name: 'Nominee Relationship',
      key: 'policyNominee',
      index:0,
      valueTag: 'insuredRel',
    },
    {
      name: 'Appointee Title',
      break:true,
      key: 'policyNominee',
      index:0,
      valueTag: 'appointeeTitle'
    },
    {
      name: 'Appointee First Name',
      key: 'policyNominee',
      index:0,
      valueTag: 'appointeeFirstName'
    }, {
      name: 'Appointee Last Name',
      key: 'policyNominee',
      index:0,
      valueTag: 'appointeeLastName'
    
    }, {
      name: 'Appointee Gender',
      key: 'policyNominee',
      index:0,
      valueTag: 'appointeeGender'
    },
    {
      name: 'Appointee Date of Birth',
      key: 'policyNominee',
      index:0,
      valueTag: 'appointeeDob'
    },
    {
      name: 'Appointee Marital Status',
      key: 'policyNominee',
      index:0,
      valueTag: 'appointeeMaritalStatus'
    }
    ]
  },{
    detailsKey:'insureds',
    label: 'Insurer Details',
    expandedByDefault: true,
    isArray:true,
    detailsData: [{
      name: 'Title',
      break:true,
      key: 'insureds',
      index:0,
      valueTag: 'title'
    },
    {
      name: 'First Name',
      key: 'insureds',
      index:0,
      valueTag: 'firstName'
    }, {
      name: 'Last Name',
      key: 'insureds',
      index:0,
      valueTag: 'lastName'
    
    }, {
      name: 'Date of Birth',
      key: 'insureds',
      index:0,
      valueTag: 'dob'
    }, {
      name: 'Gender',
      key: 'insureds',
      index:0,
      valueTag: 'gender'
    }, {
      name: ' Marital Status',
      key: 'insureds',
      index:0,
      valueTag: 'maritalStatus'
    }, {
      name: 'Proposer Relationship',
      key: 'insureds',
      index:0,
      valueTag: 'proposerRel',
      getDiffVAl: true,
      getDetailFrom:'proposerRelationship',
    },
    {
      name: 'Nominee Title',
      break:true,
      key: 'policyNominee',
      index:0,
      valueTag: 'title'
    },
    {
      name: 'Nominee First Name',
      key: 'policyNominee',
      index:0,
      valueTag: 'firstName'
    }, {
      name: 'Nominee Last Name',
      key: 'policyNominee',
      index:0,
      valueTag: 'lastName'
    
    }, {
      name: 'Nominee Gender',
      key: 'policyNominee',
      index:0,
      valueTag: 'gender'
    }
    ]
  }
  ,{
    detailsKey:'policyAddress',
    displayByInsurer:[134],
    label: 'Contact Info',
    expandedByDefault: true,
    detailsData: [{
      name: 'Policy Address Line 1',
      key: 'policyAddress',
      valueTag: 'addressline1'
    },
    {
      name: 'Policy Address Line 2 ',
      key: 'policyAddress',
      valueTag: 'addressline2'
    }, {
      name: 'Policy Address Line 3',
      key: 'policyAddress',
      valueTag: 'addressline3'
    
    }, {
      name: 'Pincode',
      key: 'policyAddress',
      valueTag: 'postalcode'
    }, {
      name: 'City',
      key: 'policyAddress',
      valueTag: 'city'
    }, {
      name: 'State',
      key: 'policyAddress',
      valueTag: 'state'
    },
    {
      break:true,
      name: 'Mailing Address Line 1',
      key: 'mailingAddress',
      valueTag: 'addressline1'
    },
    {
      name: 'Mailing Address Line 2 ',
      key: 'mailingAddress',
      valueTag: 'addressline2'
    }, {
      name: 'Mailing Address Line 3',
      key: 'mailingAddress',
      valueTag: 'addressline3'
    
    }, {
      name: 'Pincode',
      key: 'mailingAddress',
      valueTag: 'postalcode'
    }, {
      name: 'City',
      key: 'mailingAddress',
      valueTag: 'city'
    }, {
      name: 'State',
      key: 'mailingAddress',
      valueTag: 'state'
    }
    ]
  }
  ]
  constructor(
    private route: ActivatedRoute,
    private cisService: ComprehensiveInsuranceSystemService,
    private paymentService: PaymentApprovalService,
    private loaderService: LoaderService,
    private lmsService: LmsService,
    private accountService: AccountService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.accountService.user.subscribe((x) => (this.user = x));
    this.route.params.subscribe(param=>{
      this.appNo = param.appNo;
      this.cisApp = param.cisApp;
    })
    console.log(this.appNo,this.cisApp)
    this.element = this.paymentService.paymentDetails;
   this.paymentId = this.paymentService.paymentDetails?.paymentId;
   this.insurerId = this.paymentService.paymentDetails?.insurerId;

    this.generateApplicationView()
  }

  generateApplicationView(){
    const applicationForm = []
    const requiredDataForApp = [];
    if(this.cisApp){
      requiredDataForApp.push(this.cisService.getCisApplication(this.appNo));
      // const metaData= {
        
      // }
      forkJoin(requiredDataForApp).subscribe((data)=>{
          this.applicationDetails = data[0]
        this.insurerId = this.applicationDetails.productInfo?.insurerId;
          console.log(this.applicationDetails)
          this.preRunProcess();
      })
    }else{
      console.log('not CIS APP')
    }
  }
  onRejectClicked() {
    let rejectMessage;
    const dialogRef = this.dialog.open(CisModalComponent, {
      data: {type:'reject'},
      panelClass: 'dialog-width',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((message) => {
      console.log(message);
      rejectMessage = message
      const rejectPayload = this.applicationDetails
      rejectPayload.productInfo.statusCode = 17;
      rejectPayload.productInfo.status = 'PaymentRejected';
      rejectPayload.productInfo.remarks = rejectMessage;
      this.loaderService.showSpinner(true);
      this.paymentService.rejectPayment(this.paymentId).subscribe(
        (data) => {
          this.loaderService.showSpinner(false);
          this.loaderService.showSpinner(true);
          this.cisService.updateApplication(rejectPayload).subscribe(res=>{
          this.loaderService.showSpinner(false);

            if(res['message']!==''){
              const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                data: res['message'],
                panelClass: 'dialog-width',
              });
              dialogRef.afterClosed().subscribe(data=>{
                this.router.navigate(['/'])
              })
            }
          },error=>{
            this.loaderService.showSpinner(false);
            const message = error['responseMessage'];
            this.dialog.open(PolicyErrorModalComponent, {
              data: message,
              panelClass: 'dialog-width',
            });
          })
        },
        (error) => {
          this.loaderService.showSpinner(false);
          const message = error['responseMessage'];
          this.dialog.open(PolicyErrorModalComponent, {
            data: message,
            panelClass: 'dialog-width',
          });
        },
      );
      
    });
   
  }

  onApprove(){
    console.log('approve')
    const dialogRef = this.dialog.open(SimpleYesNoModalComponent, {
      data: 'I confirm that the customer has signed the debit authorization form to allow deduction of premium for this policy',
      panelClass: 'dialog-width',
    });
    dialogRef.afterClosed().subscribe((btn) => {
      if (btn === 'yes') {
        this.approvePayment(this.paymentId, this.insurerId, this.appNo, this.element);
      }
    });
  }
  approvePayment(paymentId, insurerId, appNo, element) {
    this.orgCode = this.user?.organizationCode;
    this.loaderService.showSpinner(true);
    if (element.cisApp) {
      this.paymentService.approvePayment(paymentId).subscribe(
        (data) => {
          this.loaderService.showSpinner(false);
          if (data['responseCode'] === 0) {
            if (this.orgCode === 'KB') {
              this.loaderService.showSpinner(true);
              this.paymentService.issueCisPolicy(appNo).subscribe(
                (data) => {
                  this.loaderService.showSpinner(false);
                  if (data['responseCode'] === 0) {
                    const dialogref = this.dialog.open(PolicyErrorModalComponent, {
                      data: data['responseMessage'],
                      panelClass: 'dialog-width',
                    });
                    dialogref.afterClosed().subscribe(() => {
                      if(data['checkCISStatus']){
                        this.loaderService.showSpinner(true);
                        this.lmsService.checkCisStatus(appNo).subscribe(
                          (cisStatus) => {
                            this.loaderService.showSpinner(false);
                            if (cisStatus['responseCode'] === '0') {
                              const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                                data: cisStatus['responseMessage'],
                                panelClass: 'dialog-width',
                              });
                              dialogRef.afterClosed().subscribe(() => {
                                this.router.navigate(['/cis']);
                              });
                            } else {
                              const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                                data: cisStatus['responseMessage'],
                                panelClass: 'dialog-width',
                              });
                            }
                            // newdialog.afterClosed().subscribe((result) => {});
                          },
                          (err) => {
                            this.loaderService.showSpinner(false);
                            const dataErr = {
                              message: 'Application not found',
                            };
                            this.dialog.open(CisModalComponent, {
                              data: err.message ? err : dataErr,
                              panelClass: 'dialog-width',
                            });
                            // newdialog.afterClosed().subscribe((result) => {});
                          },
                        );
                      } else {
                        this.loaderService.showSpinner(true);
                        this.paymentService.getFnaBase64(appNo).subscribe( (data) => {
                          this.loaderService.showSpinner(false);
                          const byte64Data = data['base64Pdf'];
                          const byteArray = new Uint8Array(
                            atob(byte64Data)
                              .split('')
                              .map((char) => char.charCodeAt(0)),
                          );
                          const blob = new Blob([byteArray], { type: 'application/pdf' });
                          // Here is your URL you can use
                          const url = window.URL.createObjectURL(blob);
                          window.open(url, '_blank');
                          this.router.navigate(['/cis']);
                        },
                        (error) => {
                          this.loaderService.showSpinner(false);
                          const message = error.responseMessage;
                          this.dialog.open(PolicyErrorModalComponent, {
                            data: message,
                            panelClass: 'dialog-width',
                          });
                          this.router.navigate(['/cis']);
                        },)
                       
                      }
                    });
                  } else {
                    const dialogref = this.dialog.open(PolicyErrorModalComponent, {
                      data: data['responseMessage'],
                      panelClass: 'dialog-width',
                    });
                    dialogref.afterClosed().subscribe(() => {
                      this.router.navigateByUrl('/cis');
                    });
                  }
                },
                (error) => {
                  this.loaderService.showSpinner(false);
                  const dialogref = this.dialog.open(PolicyErrorModalComponent, {
                    data: error.errorMessage,
                    panelClass: 'dialog-width',
                  });
                  dialogref.afterClosed().subscribe(() => {
                    this.router.navigateByUrl('/cis');
                  });
                },
              );
            } else {
              const dialogref = this.dialog.open(PolicyErrorModalComponent, {
                data: data['responseMessage'],
                panelClass: 'dialog-width',
              });

            }
          } else {
            const dialogref = this.dialog.open(PolicyErrorModalComponent, {
              data: data['responseMessage'],
              panelClass: 'dialog-width',
            });
          }
        },
        (err) => {
          const dialogref = this.dialog.open(PolicyErrorModalComponent, {
            data: err.errorMessage,
            panelClass: 'dialog-width',
          });
          this.loaderService.showSpinner(false);
        },
      );
    } else {
      this.paymentService.approvePayment(paymentId).subscribe(
        (data) => {
          if (insurerId === 512 && data['responseCode'] === 0) {
            this.paymentService.sendLeadToInsurer(appNo).subscribe(
              (policyData) => {
                if (policyData['isExternalNavigation']) {
                  const mapForm = document.createElement('form');
                  mapForm.method = policyData['method'];
                  // mapForm.target = '_blank';
                  mapForm.action = policyData['url'];
                  mapForm.style.display = 'none';
                  if (policyData['payload'] && Object.keys(policyData['payload']).length > 0) {
                    Object.keys(policyData['payload']).forEach((key) => {
                      const mapInput = document.createElement('input');
                      mapInput.type = 'hidden';
                      mapInput.name = key;
                      mapInput.value = policyData['payload'][key];
                      mapForm.appendChild(mapInput);
                    });
                  }
                  document.body.appendChild(mapForm);

                  mapForm.submit();
                }
                this.loaderService.showSpinner(false);
                this.router.navigate(['/Confirmation', insurerId, policyData['applicationNo']], {
                  queryParams: {
                    status: policyData['status'],
                    paymentReferenceNo: policyData['paymentReferenceNo'],
                    policyNo: policyData['policyNo'],
                    premiumPaid: policyData['premiumPaid'],
                    logoUrl: policyData['logoUrl'],
                    appNo: policyData['applicationNo'],
                    receiptNo: policyData['recieptNo'],
                    paymentGatewayId: policyData['paymentGatewayId'],
                    message: policyData['message'],
                  },
                });
              },
              () => {
                this.loaderService.showSpinner(false);
              },
            );
          } else if (data['responseCode'] === 0) {
            this.paymentService.issuePolicy(appNo).subscribe(
              (policyData) => {
                console.log('issue policy successful', policyData);
                if (policyData['responseCode'] === 0) {
                  this.paymentService.checkIssuanceResponse(appNo).subscribe(
                    (res) => {
                      if (res.responseCode === 0) {
                        let message =
                          +insurerId === 117
                            ? 'Your proposal has been successfully submitted to the insurer. The status of the policy will be informed shortly.'
                            : 'Your Policy has been issued Successfully.You will receive your Policy Schedule shortly.';
                        this.loaderService.showSpinner(false);
                        // this.loaderService.showSpinner(false);
                        this.router.navigate(['/Confirmation', insurerId, appNo], {
                          queryParams: {
                            status: 'Success',
                            paymentReferenceNo: policyData['paymentReferenceNo'],
                            policyNo: policyData['policyNo'],
                            premiumPaid: policyData['premiumPaid'],
                            logoUrl: policyData['logoUrl'],
                            appNo: appNo,
                            receiptNo: policyData['recieptNo'],
                            paymentGatewayId: policyData['paymentGatewayId'],
                            message: message,
                          },
                        });
                      } else {
                        this.loaderService.showSpinner(false);
                        this.router.navigate(['/Confirmation', insurerId, appNo], {
                          queryParams: {
                            status: 'Error',
                            appNo: appNo,
                            message:
                              "There was some problem with the payment. If money has been deducted it'll be refunded withing 7 days.",
                          },
                        });
                      }
                    },
                    () => {
                      console.log('issue policy failed');
                      this.loaderService.showSpinner(false);
                      this.router.navigate(['/Confirmation', insurerId, appNo], {
                        queryParams: {
                          status: 'Error',
                          appNo: appNo,
                          message:
                            "There was some problem with the payment. If money has been deducted it'll be refunded withing 7 days.",
                        },
                      });
                    },
                  );
                } else {
                  this.loaderService.showSpinner(false);
                  this.router.navigate(['/Confirmation', insurerId, appNo], {
                    queryParams: {
                      status: 'Error',
                      paymentReferenceNo: policyData['paymentReferenceNo'],
                      policyNo: policyData['policyNo'],
                      premiumPaid: policyData['premiumPaid'],
                      logoUrl: policyData['logoUrl'],
                      appNo: appNo,
                      receiptNo: policyData['recieptNo'],
                      paymentGatewayId: policyData['paymentGatewayId'],
                      message: policyData['responseMessage'],
                    },
                  });
                }
              },
              () => {
                console.log('issue policy failed');

                this.loaderService.showSpinner(false);
                this.router.navigate(['/Confirmation', insurerId, appNo], {
                  queryParams: {
                    status: 'Error',
                    appNo: appNo,
                    message:
                      "There was some problem with the payment. If money has been deducted it'll be refunded withing 7 days.",
                  },
                });
              },
            );
          } else if (data['responseCode'] !== 0) {
            this.loaderService.showSpinner(false);
            this.dialog.open(PolicyErrorModalComponent, {
              data: data['responseMessage'],
              panelClass: 'dialog-width',
            });
          }
        },
        () => {
          this.loaderService.showSpinner(false);
        },
      );
    }
  }

  rejectApplication(){
    let rejectMessage;
    const dialogRef = this.dialog.open(CisModalComponent, {
      data: {type:'reject'},
      panelClass: 'dialog-width',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((message) => {
      console.log(message);
      rejectMessage = message
      const rejectPayload = this.applicationDetails
      rejectPayload.productInfo.statusCode = 16;
      rejectPayload.productInfo.status = 'Rejected';
      rejectPayload.productInfo.remarks = rejectMessage;
      this.loaderService.showSpinner(true)
      this.cisService.updateApplication(rejectPayload).subscribe(res=>{
        this.loaderService.showSpinner(false)
        if(res['message']!==''){
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: res['message'],
            panelClass: 'dialog-width',
          });
          dialogRef.afterClosed().subscribe(data=>{
            this.router.navigate(['/'])
          })
        }
      },error=>{
        this.loaderService.showSpinner(false)
        const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
          data: error['errorMessage'],
          panelClass: 'dialog-width',
      })
    });
  })
}



 preRunProcess(){
  this.layoutMetaData.forEach(detailList=>{
      if(detailList.isArray){
        if(this.applicationDetails[detailList.detailsKey].length > 0){
          const indexLength = this.applicationDetails[detailList.detailsKey].length
          let tempDataArr=[]
          for(let i=0;i<indexLength;i++){
              let detailsData = JSON.parse(JSON.stringify(detailList.detailsData))
              detailsData.forEach(detail=>{
                  detail.index = i;
              })
              tempDataArr.push(...detailsData)
          }
          detailList.detailsData = tempDataArr
     }
      }
      detailList.detailsData.forEach(detail => {
        if(detail['getDiffVAl']){
          detail['getDetailFrom'] = this[detail['getDetailFrom']]
        }
      });
  })
 }
}
