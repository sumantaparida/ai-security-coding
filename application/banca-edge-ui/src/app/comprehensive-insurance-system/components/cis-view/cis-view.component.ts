import { animate, state, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterContentInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { LmsService } from '@app/LMS/services/lms.service';
import { OtpModalComponent } from '@app/shared/components/otp-modal/otp-modal.component';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import { PolicyVaultService } from '@app/_services/policy-vault.service';
import { CisModalComponent } from '../cis-modal/cis-modal.component';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { ComprehensiveInsuranceSystemService } from '@app/comprehensive-insurance-system/services/comprehensive-insurance-system.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatInput } from '@angular/material/input';

@Component({
    selector: 'app-cis-view',
    templateUrl: './cis-view.component.html',
    styleUrls: ['./cis-view.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class CisViewComponent implements OnInit, AfterContentInit {
    customerId: number;

    columnsToDisplay = [
        ' ',
        'Insurer Name',
        'Product Name',
        'Policy Number',
        'Creation Date',
        'Customer Name',
        'Status',
        'Insurerspolicystatus',
        'Premium',
        'Actions',
    ];

    policyApplicationDetailsArr;

    policyApplicationArrCopy;

    policyApplicationSearchCopy;

    policyDetailString;

    searchForm: FormGroup;

    pageIndex = 0;

    pageSize = 10;

    pageSizeOptions: number[] = [10];

    inforceStatusCount = 0;

    pendingStatusCount = 0;

    inactiveStatusCount = 0;

    initiatedStatusCount = 0;

    displayedMobileColumns: string[] = [' ', 'Customer Name', 'Actions'];

    isMobileView: boolean;

    paymentTerm;

    insuredDOB;

    insuredGender;

    insuredRel;

    isBranchUser = false;

    applicationDetails;

    downloadDocuments;

    expandedElement;

    hidden = false;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild('fromInput', {
        read: MatInput,
    })
    fromInput: MatInput;

    @ViewChild('toInput', {
        read: MatInput,
    })
    toInput: MatInput;

    sortHeaderData: Sort;

    isLoading = false;

    // isMobileView = false;
    innerWidth;

    displayedColumns: string[] = [];

    isRoutedFromCPage = false;

    hasLeadBatch;

    isSP;

    totalRecords;

    filterStatus;

    reqBody = {
        pageNo: this.pageIndex + 1,
        pageSize: this.pageSize,
        searchData: '',
        branch: 0,
        product: '',
        status: '',
        startDate: '',
        endDate: '',
    };

    // Example Data

    // reqBody = {
    //     "pageNo": 4,
    //     "pageSize": 10,
    //     "searchData": "",
    //     "branch": 513,
    //     "product": "",
    //     "status": 0,
    //     "startDate": "",
    //     "endDate": ""
    // }

    currentUser: User;

    constructor(
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private policyVaultService: PolicyVaultService,
        private lmsService: LmsService,
        public media: MediaObserver,
        private breakPointObserver: BreakpointObserver,
        private cisService: ComprehensiveInsuranceSystemService,
        private router: Router,
        private loaderService: LoaderService,
        private accountService: AccountService,
    ) {
        this.route.params.subscribe((params) => {
            if (params.CID) {
                this.customerId = params.CID;
            } else {
                this.customerId = null;
            }
        });
    }

    ngOnInit() {
        // this.getPolicyApplicationDetails()
        this.lmsService.getPolicyStatus().subscribe(values => {
            this.filterStatus = values
        })
        this.currentUser = this.accountService.userValue;
        this.reqBody['branch'] = this.currentUser.organizationCode === 'KB' ? '' : JSON.parse(this.currentUser.branchCode)
        this.isBranchUser = this.accountService.isBranchUser;
        this.isSP = this.accountService.isSP;
        this.innerWidth = window.innerWidth;
        // this.resetDisplayedColumnsXtraSmall();
        this.searchForm = new FormGroup({
            searchField: new FormControl(''),
            filterByStatus: new FormControl(''),
            filterByDateStart: new FormControl(''),
            filterByDateEnd: new FormControl({ value: '' }),
        });
        // this.getPolicyApplicationDetails();
        // this.isLoading = true;
        this.loaderService.showSpinner(true);

        this.route.queryParams.subscribe((params) => {
            if (params.customerId) {
                this.isRoutedFromCPage = true;
            }
            this.customerId = params.customerId;
        });

        if (this.isRoutedFromCPage) {
            this.getPolicyDetailForCustomer();
        } else {
            this.getPolicyApplicationDetails();
        }

        this.searchForm
            .get('searchField')
            .valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
            .subscribe((event) => {
                this.reqBody['searchData'] = event.trim();
                this.reqBody.pageNo = 1;
                this.lmsService.getLeadsForUserNew(this.reqBody).subscribe((values) => {
                    this.totalRecords = values['totalRecords'];
                    this.policyApplicationDetailsArr = values['leadMainDtos'];
                    this.formatData()
                });
            });
        this.searchForm.get('filterByStatus').valueChanges.subscribe(event => {
            this.reqBody['cisStatus'] = event
            this.lmsService.getLeadsForUserNew(this.reqBody).subscribe((values) => {
                this.totalRecords = values['totalRecords'];
                this.policyApplicationDetailsArr = values['leadMainDtos'];
                this.formatData()
            });
        })
        this.searchForm.get('filterByDateStart').valueChanges.subscribe(event => {
            this.reqBody['startDate'] = event.toISOString().slice(0, 10)
            this.lmsService.getLeadsForUserNew(this.reqBody).subscribe((values) => {
                this.totalRecords = values['totalRecords'];
                this.policyApplicationDetailsArr = values['leadMainDtos'];
                this.formatData()
            });
        })
        this.searchForm.get('filterByDateEnd').valueChanges.subscribe(event => {
            this.reqBody['endDate'] = event.toISOString().slice(0, 10)
            this.lmsService.getLeadsForUserNew(this.reqBody).subscribe((values) => {
                this.totalRecords = values['totalRecords'];
                this.policyApplicationDetailsArr = values['leadMainDtos'];
                this.formatData()
            });
        })
    }
    // let timeDiff = Math.abs(Date.now() - this.policyApplicationArrCopy[].getTime());
    // let age = Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);

    ngAfterContentInit() {
        this.resetDisplayedColumnsXtraSmall();
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.innerWidth = window.innerWidth;
        this.resetDisplayedColumnsXtraSmall();
    }

    resetDisplayedColumnsXtraSmall() {
        if (this.innerWidth < 820) {
            this.displayedColumns = this.displayedMobileColumns;
            this.isMobileView = true;
        } else {
            this.displayedColumns = this.columnsToDisplay;
            this.isMobileView = false;
        }
    }

    // resetDisplayedColumnsXtraSmall() {
    //   if (this.innerWidth < 600) {
    //     this.displayedColumns = this.displayedMobileColumns;
    //     this.isMobileView = true;
    //   } else {
    //     this.displayedColumns = this.columnsToDisplay;
    //     this.isMobileView = false;
    //   }
    // }

    getPolicyDetailForCustomer() {
        this.policyVaultService.getCustomerPolicy(this.customerId).subscribe(
            (customerPolicy) => {
                // this.isLoading = false;
                this.loaderService.showSpinner(false);
                this.policyApplicationDetailsArr = customerPolicy;
                this.formatData();
            },
            () => {
                this.loaderService.showSpinner(false);
                this.accountService.logout();
            },
        );
    }

    // getApplicationDetails() {
    //   // console.log('Application', this.reqBody)

    //   console.log('Inside NgOnInit');
    //   this.loaderService.showSpinner(true);

    //   this.policyVaultService.getApplicationForUser(this.reqBody).subscribe((values) => {
    //     console.log('', values);
    //     this.loaderService.showSpinner(false);

    //     this.totalRecords = values['totalRecords'];
    //     this.policyApplicationDetailsArr = values['customerApplicationDtos'];
    //     console.log('OnInit ArrayValue', this.policyApplicationDetailsArr);
    //   });
    // }

    // getApplicationDetails() {
    //     // console.log('Application', this.reqBody)

    //     console.log('Inside NgOnInit');
    //     this.loaderService.showSpinner(true);

    //     this.lmsService.getLeadsForUser(this.reqBody).subscribe((values) => {
    //         console.log('', values['leadMainDtos']);
    //         this.loaderService.showSpinner(false);

    //         this.totalRecords = values['totalRecords'];
    //         this.policyApplicationDetailsArr = values['leadMainDtos'];
    //         console.log('OnInit ArrayValue', this.policyApplicationDetailsArr);
    //     });
    // }

    getPolicyApplicationDetails() {
        this.loaderService.showSpinner(true);
        this.lmsService.getLeadsForUserNew(this.reqBody).subscribe(
            (policyDetails) => {
                // this.isLoading = false;
                this.loaderService.showSpinner(false);
                this.totalRecords = policyDetails['totalRecords'];
                this.policyApplicationDetailsArr = policyDetails['leadMainDtos'];

                this.formatData();
            },
            () => {
                this.loaderService.showSpinner(false);
                this.accountService.logout();
            },
        );
    }

    formatData() {
        this.policyApplicationDetailsArr.forEach((policy) => {
            if (policy.status === 'INFORCE') {
                this.inforceStatusCount++;
            } else if (policy.status === 'PENDING') {
                this.pendingStatusCount++;
            } else if (policy.status === 'INACTIVE') {
                this.inactiveStatusCount++;
            } else {
                this.initiatedStatusCount++;
            }
        });

        this.policyApplicationDetailsArr.map((policyApplicationDetails) => {
            policyApplicationDetails['expanded'] = false;
            if (
                policyApplicationDetails.applicationData &&
                policyApplicationDetails.applicationData.insureds &&
                policyApplicationDetails.applicationData.insureds.dob
            ) {
                const dob = new Date(policyApplicationDetails.applicationData.insureds.dob);
                const timeDiff = new Date().getTime() - dob.getTime();
                const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
                policyApplicationDetails.applicationData.insureds['age'] = age;
            }
            if (
                policyApplicationDetails.applicationData &&
                policyApplicationDetails.applicationData.additionalData
            ) {
                // console.log('kavita dob', policyApplicationDetails.applicationData.additionalData.insuredDob);
                this.insuredDOB = policyApplicationDetails.applicationData.additionalData.insuredDob;
                this.insuredGender = policyApplicationDetails.applicationData.additionalData.insuredGender;
                this.insuredRel = policyApplicationDetails.applicationData.additionalData.insuredRel;
            }
            const insuredArr = policyApplicationDetails.applicationData?.insureds;

            if (insuredArr && !Array.isArray(insuredArr)) {
                if (insuredArr['gender'] === 'F') {
                    insuredArr['gender'] = 'Female';
                } else if (insuredArr['gender'] === 'M') {
                    insuredArr['gender'] = 'Male';
                }
            } else if (insuredArr && Array.isArray(insuredArr)) {
                insuredArr.map((insuredPerson) => {
                    const dob = new Date(insuredPerson.dob);
                    const timeDiff = new Date().getTime() - dob.getTime();
                    const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
                    insuredPerson['age'] = age;
                    // const relationShipCode = insuredPerson.proposerRel;
                    // const productid = policyApplicationDetails.productId;
                    // this.policyVaultService.getRelationShip(productid, relationShipCode).subscribe(relation => {
                    //   insuredPerson['relationValue'] = relation['value'];
                    // });
                });
                policyApplicationDetails['healthInsuranceDetails'] = insuredArr;
            }
            // policyApplicationDetails['cDate'] = new Date(policyApplicationDetails.createdDate);
        });
        this.policyApplicationSearchCopy = this.policyApplicationDetailsArr.slice();
        this.policyApplicationArrCopy = this.policyApplicationDetailsArr.slice(0, this.pageSize);
    }

    sortData(sort: Sort, isSearching?: boolean) {
        this.paginator.pageIndex = 0;
        this.pageIndex = 0;
        if (isSearching && sort !== undefined) {
            this.sortHeaderData = sort;
            this.policyApplicationSearchCopy = this.getSearchResults().slice();
            this.policyApplicationArrCopy = this.getSortedData();
        } else if (isSearching) {
            this.paginator.pageIndex = 0;
            this.pageIndex = 0;
            this.policyApplicationSearchCopy = this.getSearchResults().slice();
            this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(0, this.pageSize);
        } else {
            this.sortHeaderData = sort;
            this.policyApplicationArrCopy = [];
            this.policyApplicationDetailsArr.slice();
            this.policyApplicationSearchCopy = this.getSearchResults().slice();
            this.policyApplicationArrCopy = this.getSortedData();
        }
    }

    getSortedData() {
        const data = this.policyApplicationSearchCopy.slice();
        if (
            this.sortHeaderData &&
            (!this.sortHeaderData.active || this.sortHeaderData.direction === '')
        ) {
            this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(
                this.pageIndex,
                this.pageSize,
            );
            return this.policyApplicationArrCopy;
        }
        this.policyApplicationSearchCopy = data.sort((a, b) => {
            const isAsc = this.sortHeaderData.direction === 'asc';
            switch (this.sortHeaderData.active) {
                case 'Insurer Name':
                    return this.compare(a.insurerName, b.insurerName, isAsc);
                case 'Product Name':
                    return this.compare(a.productName, b.productName, isAsc);
                case 'Policy Number':
                    return this.compare(a.applicationNo, b.applicationNo, isAsc);
                case 'Customer Name':
                    return this.compare(a.customerName, b.customerName, isAsc);
                case 'Status':
                    return this.compare(a.status, b.status, isAsc);
                case 'Premium':
                    return this.compare(a.premiumAmount, b.premiumAmount, isAsc);
                case 'Product Id':
                    return this.compare(a.productId, b.productId, isAsc);
                default:
                    return 0;
            }
        });

        return this.policyApplicationSearchCopy.slice(this.pageIndex, this.pageSize);
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    onSearchFieldChange() {
        this.paginator.pageIndex = 0;
        this.pageIndex = 0;
        this.sortData(this.sortHeaderData, true);
        // this.policyApplicationArrCopy = [];
        // this.policyApplicationSearchCopy = [];
        // this.policyApplicationSearchCopy = this.getSearchResults();

        // this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(0, this.pageSize);
    }

    resetStartDate() {
        this.fromInput.value = '';
        this.reqBody['startDate'] = '';
        this.lmsService.getLeadsForUserNew(this.reqBody).subscribe((values) => {
            this.totalRecords = values['totalRecords'];
            this.policyApplicationDetailsArr = values['leadMainDtos'];
            this.formatData()

        });
        // this.searchForm.controls['filterByDateStart'].value.reset()
    }

    resetEndDate() {
        this.toInput.value = '';
        this.reqBody['endDate'] = '';
        this.lmsService.getLeadsForUserNew(this.reqBody).subscribe((values) => {
            this.totalRecords = values['totalRecords'];
            this.policyApplicationDetailsArr = values['leadMainDtos'];
            this.formatData()

        });
        // this.searchForm.controls['filterByDateEnd'].value.reset()
    }

    dateFilter = (date: Date) => {
        return date >= this.searchForm.get('filterByDateStart').value;
    };

    onInitiatePayment(application) {
        console.log(application);
        this.router.navigate(['/', 'initiate-payment', application]);
    }

    onPageChange(event: PageEvent) {
        this.loaderService.showSpinner(true);
        // this.pageSize = event.pageSize;
        this.reqBody['pageNo'] = event.pageIndex + 1;
        this.pageIndex = event.pageIndex;
        // const policiesToDisplay = event.pageIndex * event.pageSize;
        // this.policyApplicationArrCopy = this.policyApplicationSearchCopy.slice(
        //   policiesToDisplay,
        //   policiesToDisplay + event.pageSize,
        // );
        this.lmsService.getLeadsForUserNew(this.reqBody).subscribe(
            (policyDetails) => {
                this.loaderService.showSpinner(false);
                // this.isLoading = false;
                // this.loaderService.showSpinner(false);
                this.policyApplicationDetailsArr = policyDetails['leadMainDtos'];
                this.totalRecords = policyDetails['totalRecords'];

                this.formatData();
            },
            () => {
                // this.loaderService.showSpinner(false);
                this.accountService.logout();
            },

        );

    }

    // onPageChange(event: PageEvent) {
    //   this.loaderService.showSpinner(true);
    //   // this.pageSize = event.pageSize;
    //   this.reqBody['pageNo'] = event.pageIndex + 1;
    //   this.policyVaultService.getApplicationForUser(this.reqBody).subscribe((values) => {
    //     this.loaderService.showSpinner(false);
    //     this.policyApplicationDetailsArr = values['customerApplicationDtos'];
    //     this.totalRecords = values['totalRecords'];
    //   });
    // }



    sendOtp(productName, bankCustomerId, mobileNo, appNo) {
        this.loaderService.showSpinner(true);
        const otpDcbData = {
            otpKey: bankCustomerId,
            otpRequestDesc: '',
            mobileNo: mobileNo,
        };
        this.lmsService.sendDcbOtp(otpDcbData).subscribe(
            (res) => {
                this.loaderService.showSpinner(false);
                console.log(res);
                if (res['responseStatus'] == 0) {
                    this.validateOtp(productName, bankCustomerId, mobileNo, appNo);
                }
            },
            () => {
                this.loaderService.showSpinner(false);
            },
        );
    }

    validateOtp(productName, bankCustomerId, mobileNo, appNo) {
        let dialogRef = this.dialog.open(OtpModalComponent, {
            data: {
                appNo: appNo.toString(),
                dcb: true,
                cifNumber: bankCustomerId,
                productName: productName,
                mobileNo: mobileNo,
            },
            panelClass: 'dialog-width',
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.loaderService.showSpinner(true);
            if (result === true) {
                this.sendLeadToInsurer(appNo);
                // this.loaderService.showSpinner(false);
            } else {
                this.loaderService.showSpinner(false);
            }
        });
    }

    sendLeadToInsurer(appNo) {
        this.loaderService.showSpinner(true);
        this.lmsService.sendLeadDataToInsurer(appNo.toString()).subscribe(
            (sentResult) => {
                this.loaderService.showSpinner(false);

                let newdialog = this.dialog.open(CisModalComponent, {
                    data: sentResult,
                    panelClass: 'dialog-width',
                });
                newdialog.afterClosed().subscribe(() => {
                    if (sentResult['statusCode'] === 1) {
                        this.getPolicyApplicationDetails();
                    }
                });
            },
            () => {
                this.loaderService.showSpinner(false);
            },
        );
    }

    checkPolicyStatus(appNo, insurerCode) {
        this.loaderService.showSpinner(true);
        this.lmsService.checkPolicyStatus(appNo, insurerCode).subscribe(
            (status) => {
                this.loaderService.showSpinner(false);
                console.log(status);
                this.dialog.open(CisModalComponent, {
                    data: status,
                    panelClass: 'dialog-width',
                });
                // newdialog.afterClosed().subscribe((result) => {});
            },
            (err) => {
                const dataErr = {
                    message: 'Server is down, please try after sometime',
                };
                this.loaderService.showSpinner(false);
                this.dialog.open(CisModalComponent, {
                    data: err.message ? err : dataErr,
                    panelClass: 'dialog-width',
                });
                // newdialog.afterClosed().subscribe((result) => {});
            },
        );
    }

    checkLeadStatus(appNo) {
        this.loaderService.showSpinner(true);
        this.lmsService.checkLeadStatus(appNo).subscribe(
            (leadStatus) => {
                this.loaderService.showSpinner(false);
                this.dialog.open(CisModalComponent, {
                    data: leadStatus,
                    panelClass: 'dialog-width',
                });
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
    }

    checkCISStatus(CisNo) {
        this.loaderService.showSpinner(true);
        this.lmsService.checkCisStatus(CisNo).subscribe(
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
    }

    getSearchResults() {
        const searchValue = this.searchForm.get('searchField').value.toLocaleLowerCase();
        const searchResults = this.policyApplicationDetailsArr.filter((policyDetail) => {
            const policyDetailString = JSON.stringify(policyDetail);
            if (
                policyDetailString.match(searchValue) ||
                policyDetailString.toLocaleLowerCase().match(searchValue)
            ) {
                return policyDetail;
            }
        });
        return searchResults;
    }

    onCreateNewService(appno) {
        this.router.navigate(['/myrequest/register-service-request'], { queryParams: { appno } });
    }

    onCreateNewComplaint(complaintNo) {
        this.router.navigate(['/mycomplaints/register-complaint'], { queryParams: { complaintNo } });
    }

    // showOrHide(column) {
    //   return this.displayedMobileColumns.indexOf(column) === -1;
    // }
    downloadProposalForm(applicationNumber, documentType) {
        console.log('policy Number', applicationNumber);
        this.applicationDetails = {
            applicationNo: applicationNumber,
            // applicationNo: '12750546319',
            documentType: documentType,
        };
        this.policyVaultService.downloadProposalForm(this.applicationDetails).subscribe(
            (download) => {
                if (download['documents'] !== null) {
                    this.downloadDocuments = download['documents'];
                    console.log('application details', this.downloadDocuments[0]?.documentUrl, download);
                    // this.downloadPdf(this.downloadDocuments[0]?.documentUrl, this.downloadDocuments[0]?.applicationNo)
                    window.open(this.downloadDocuments[0]?.documentUrl, '_blank');
                }
            },
            () => {
                console.log('error downloading');
            },
        );
    }

    goToApplication(element) {
        this.router.navigate([
            `/cis/${element.customerId}/${element.lob}/${element.productType}/${element.insurerCode}/${element.leadNumber}`,
        ]);
    }

    issuePlocyForCis(leadNumber) {
        this.loaderService.showSpinner(true);
        this.policyVaultService.issueCisPolicy(leadNumber).subscribe(
            (data) => {
                this.loaderService.showSpinner(false);

                if (data['responseCode'] === 0) {
                    const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                        data: data['responseMessage'],
                        panelClass: 'dialog-width',
                    });
                } else {
                    const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                        data: data['responseMessage'],
                        panelClass: 'dialog-width',
                    });
                }
            },
            (error) => {
                const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                    data: error.errorMessage,
                    panelClass: 'dialog-width',
                });
            },
        );
    }

    initiatePaymentForCIS(leadNumber) {
        this.router.navigateByUrl(`/initiate-payment/cis/${leadNumber}`);
    }

    initiatePaymentForBreakIn(leadNumber, payload) {
        console.log(payload)
        this.cisService.submitCisApplication(leadNumber, payload).subscribe(res => {
            if (res['statusCode'] === 1) {
                this.router.navigateByUrl(`/initiate-payment/cis/${leadNumber}`);
            } else {
                const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                    data: res['message'],
                    panelClass: 'dialog-width',
                })
            }
        }, error => {
            const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                data: error.errorMessage,
                panelClass: 'dialog-width',
            })
        })
    }

    base64ToPdf(applicationNo) {
        this.loaderService.showSpinner(true);
        this.policyVaultService.getFnaBase64(applicationNo).subscribe(
            (data) => {
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
            },
            (error) => {
                this.loaderService.showSpinner(false);
                const message = error.responseMessage;
                this.dialog.open(PolicyErrorModalComponent, {
                    data: message,
                    panelClass: 'dialog-width',
                });
            },
        );
    }

    rejectApplication(application) {
        let rejectMessage;
        const dialogRef = this.dialog.open(CisModalComponent, {
            data: { type: 'reject' },
            panelClass: 'dialog-width',
            disableClose: true,
        });
        dialogRef.afterClosed().subscribe((message) => {
            // console.log(message);
            if (message) {
                rejectMessage = message;
                const rejectPayload = application.applicationData;
                rejectPayload.productInfo.statusCode = 16;
                rejectPayload.productInfo.status = 'Rejected';
                rejectPayload.productInfo.remarks = rejectMessage;
                this.loaderService.showSpinner(true);
                this.cisService.updateApplication(rejectPayload).subscribe(
                    (res) => {
                        this.loaderService.showSpinner(false);
                        if (res['message'] !== '') {
                            const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                                data: res['message'],
                                panelClass: 'dialog-width',
                            });
                        }
                    },
                    (error) => {
                        this.loaderService.showSpinner(false);
                        const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                            data: error['errorMessage'],
                            panelClass: 'dialog-width',
                        });
                    },
                );
            }
        });
    }

    resendConsent(leadNumber) {
        this.loaderService.showSpinner(true);

        this.cisService.resendConsent(leadNumber).subscribe(res => {
            this.loaderService.showSpinner(false);
            const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                data: 'Consent Link has been sent successfully',
                panelClass: 'dialog-width',
            });
        }, error => {
            this.loaderService.showSpinner(false);
            const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
                data: error['errorMessage'],
                panelClass: 'dialog-width',
            });
        })
    }
}
