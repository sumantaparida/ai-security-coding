import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AccountService, TokenService } from '@app/_services';
// import { BlockerService } from '@app/_services';
import { User } from '@app/_models';
import { SharedServiceComponent } from '@app/shared/services/shared-service';
import { LoaderService } from '@app/_services/loader.service';
import { aesDecrypt } from '@app/shared/utils/aesEncrypt';
import { PolicyErrorModalComponent } from '@app/shared/components/policy-error-modal/policy-error-modal.component';
import { MatDialog } from '@angular/material/dialog';
// import { MENU_ITEMS } from './menu-data';

@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.css'],
})
export class AppNavComponent implements OnInit {
  user: User;

  isOpened = false;

  notificationArr;

  notificationCount = 0;

  orgLogo;

  rolesArr;

  firstName;

  lastName;

  isBankCustomer;

  isGuestUser = false;

  isBranchUser;

  // V--View, E--Edit , C--Create , S--Services
  isViewActivity;

  isCreateQuote;

  isViewSr;

  isCreateComplaint;

  isViewCustomer;

  isDashboard;

  isRenewPolicy;

  isViewPolicyVault;

  isUwActivity;

  isGroupCredit;

  // isGroupCredit;
  isQuoteV;

  isPolicyV;

  isPolicyS;

  isCustomerV;

  orgName;

  isViewLead;

  orgCode;

  menuItems;

  mobileMenuList;

  desktopMenuList;

  subMenus;

  branchidName;

  isSP;

  isInsurer;

  isCustomerConsentFlow = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private accountService: AccountService,
    private tokenService: TokenService,
    private router: Router,
    private sharedService: SharedServiceComponent,
    private loaderService: LoaderService,
    public dialog: MatDialog,
  ) {
    this.getNotificationList();
    // this.customerArr.map(customer => {
    //   customer['expanded'] = false;
    //   customer['cDate'] = new Date(customer.createdDate);
    // });
  }

  ngOnInit() {
    // this.accountService.getBranchByBranchCode().subscribe((branchName) => {
    //   this.branchidName = branchName;
    // });

    this.accountService.user.subscribe((x) => {
      console.log('user x', x);

      this.user = x;
      // this.user = aesDecrypt(x.tp;
      console.log('user updated', this.user);
      // this.orgLogo = this.user['orgLogo'];
      if (this.user) {
        this.performUserActions();
      }
    });

    const url = this.router.url;
    console.log('url', url);
    console.log('url split', url.split('/'));

    console.log('desktop menus', this.desktopMenuList);

    if (!this.user) {
      this.orgName = this.accountService.orgCode;
      if (this.orgName === 'BOM') {
        this.orgLogo = 'https://s3.amazonaws.com/lastdecimal.brokeredge.data/ilogo/bom.svg';
      } else if (this.orgName === null) {
        this.orgLogo = 'https://s3.amazonaws.com/lastdecimal.brokeredge.data/ilogo/bom.svg';
      }
    } else {
      this.orgLogo = this.user['orgLogo'];
    }

    this.isBranchUser = this.accountService.isBranchUser;

    if (this.rolesArr && this.rolesArr.length > 0) {
      // this.isQuoteV = true;
      this.checkForRoles();
    }
  }

  performUserActions() {
    console.log('orguser', this.user);
    this.orgCode = this.user['organizationCode'];
    this.isSP = this.user['isSP'];
    this.isInsurer = this.user['insurerUser'];
    this.rolesArr = this.user.roles;
    this.orgLogo = this.user['orgLogo'];

    this.accountService.getMenuItems().subscribe((data) => {
      this.menuItems = data['menuJson'];
      console.log('this.user==>Nav', this.menuItems.menuItems, this.menuItems);
      // if (this.orgCode == 'DCB') {
      //   console.log('this.menu==>Nav insinde if nonsp', this.user);
      //   if (this.isSP == 'false' || this.isSP == false) {
      //     this.menuItems.menuItems = this.menuItems.menuItems.filter(
      //       (menu) => menu.name === 'Comprehensive Insurance System' || menu.name === 'Reports',
      //     );
      //     console.log('this.menuitems=', this.menuItems);
      //     this.mobileMenuList = this.menuItems.menuItems;
      //   }
      // }
      console.log('new data MenuItems', this.menuItems);

      this.desktopMenuList = this.menuItems;
      this.subMenus = this.desktopMenuList.menuItems.find(
        (menuItem) => menuItem.type === 'sub-menu',
      );
      if (this.orgCode === 'DCB') {
        console.log('submenu=', this.subMenus.subMenuItems);
        let currentUser = this.accountService.userValue;
        let isUamUser =
          !currentUser['userGroups'].includes('ADMIN') &&
          currentUser['userGroups'].includes('UAM_USER');
        if (this.isSP == 'false' || this.isSP == false || isUamUser) {
          this.subMenus.subMenuItems = this.subMenus.subMenuItems.filter((menu) => {
            if (menu.name !== 'My Customers') {
              return menu;
            }
          });
        }
      }
      // else if (this.orgCode === 'CSB' && (this.isSP == 'false' || this.isSP == false)) {
      //   this.subMenus.subMenuItems = this.subMenus?.subMenuItems?.filter((menu) => {
      //     if (menu.name !== 'My Customers') {
      //       return menu;
      //     }
      //   });
      // }
      if (this.subMenus) {
        this.mobileMenuList = this.subMenus.subMenuItems.concat(
          this.desktopMenuList.menuItems.filter((menuItem) => menuItem.type !== 'sub-menu'),
        );
        console.log('mobile list', this.mobileMenuList);
      }
    });
    this.accountService.getBranchByBranchCode().subscribe((branchName) => {
      this.branchidName = branchName;
    });
    this.firstName = this.user['firstName'];
    this.lastName = this.user['lastName'];
    if (this.user['bankCustomer'] === 'false') {
      this.isBankCustomer = false;
      // console.log('is tur ot falee', this.isBankCustomer);
    } else if (this.user['bankCustomer'] === 'true') {
      this.isBankCustomer = true;
      // console.log('is tur ot falee', this.isBankCustomer);
    }
    if (this.user['userName'] === 'bomguest@lastdecimal.com') {
      this.isGuestUser = true;
    }
    if (!this.isCustomerConsentFlow) {
      this.accountService.validateToken(this.tokenService.token).subscribe(
        () => {
          this.accountService.setUserLoggedIn(true);
        },
        () => {
          this.accountService.setUserLoggedIn(false);
          this.accountService.logout().subscribe(
            () => {
              this.tokenService.isTokenSubject.next(null);
            },
            () => {},
          );
        },
      );
    }
  }

  checkForRoles() {
    this.viewActivity();
    this.createQuote();
    this.createServiceRequest();
    this.createComplaint();
    this.viewCustomer();
    this.viewDashboard();
    this.renewPolicy();
    this.viewPolicyVault();
    this.viewGroupCredit();
    this.viewUvwActivity();
    this.viewLeadsActivity();
  }

  viewActivity() {
    if (
      this.rolesArr.indexOf('CUSTOMER.ACTIVITIES.LIST') > -1 ||
      this.rolesArr.indexOf('BRANCH.ACTIVITIES.LIST') > -1 ||
      this.rolesArr.indexOf('INSURER.ACTIVITIES.LIST') > -1
    ) {
      this.isViewActivity = true;
    } else {
      this.isViewActivity = false;
    }
  }

  viewUvwActivity() {
    if (
      this.rolesArr.indexOf('INSURER.UW.VIEW') > -1 ||
      this.rolesArr.indexOf('INSURER.UW.UPDATE') > -1
    ) {
      this.isUwActivity = true;
    } else {
      this.isUwActivity = false;
    }
  }

  viewLeadsActivity() {
    if (
      this.rolesArr.indexOf('BRANCH.QUOTE.CREATE') > -1 ||
      this.rolesArr.indexOf('BRANCH.QUOTE.VIEW') > -1 ||
      this.rolesArr.indexOf('INSURER.QUOTE.CREATE') > -1 ||
      this.rolesArr.indexOf('INSURER.QUOTE.VIEW') > -1
    ) {
      this.isViewLead = true;
    } else {
      this.isViewLead = false;
    }
  }

  createQuote() {
    if (
      this.rolesArr.indexOf('BRANCH.QUOTE.CREATE') > -1 ||
      this.rolesArr.indexOf('CUSTOMER.QUOTE.CREATE') > -1
    ) {
      this.isCreateQuote = true;
    } else {
      this.isCreateQuote = false;
    }
  }

  createServiceRequest() {
    if (
      this.rolesArr.indexOf('BRANCH.SR.VIEW') > -1 ||
      this.rolesArr.indexOf('CUSTOMER.SR.VIEW') > -1 ||
      this.rolesArr.indexOf('INSURER.SR.VIEW') > -1
    ) {
      this.isViewSr = true;
    } else {
      this.isViewSr = false;
    }
  }

  createComplaint() {
    if (
      this.rolesArr.indexOf('BRANCH.COMPLAINT.CREATE') > -1 ||
      this.rolesArr.indexOf('CUSTOMER.COMPLAINT.CREATE') > -1
    ) {
      this.isCreateComplaint = true;
    } else {
      this.isCreateComplaint = false;
    }
  }

  viewCustomer() {
    if (
      this.rolesArr.indexOf('BRANCH.CUSTOMER.VIEW') > -1 ||
      this.rolesArr.indexOf('INSURER.CUSTOMER.VIEW')
    ) {
      this.isViewCustomer = true;
    } else {
      this.isViewCustomer = false;
    }
  }

  viewDashboard() {
    if (
      this.rolesArr.indexOf('BRANCH.REPORT.VIEW') > -1 ||
      this.rolesArr.indexOf('BRANCH.REPORT.VIEW') > -1
    ) {
      this.isDashboard = true;
    } else {
      this.isDashboard = false;
    }
  }

  renewPolicy() {
    if (this.rolesArr.indexOf('BRANCH.POLICY.CREATE') > -1) {
      this.isRenewPolicy = true;
    } else {
      this.isRenewPolicy = false;
    }
  }

  viewPolicyVault() {
    if (
      this.rolesArr.indexOf('BRANCH.POLICY.VIEW') > -1 ||
      this.rolesArr.indexOf('CUSTOMER.POLICY.VIEW') > -1 ||
      this.rolesArr.indexOf('INSURER.POLICY.VIEW') > -1
    ) {
      this.isViewPolicyVault = true;
    } else {
      this.isViewPolicyVault = false;
    }
  }

  viewGroupCredit() {
    if (
      this.rolesArr.indexOf('BRANCH.POLICY.VIEW') > -1 ||
      this.rolesArr.indexOf('CUSTOMER.POLICY.VIEW') > -1 ||
      this.rolesArr.indexOf('INSURER.POLICY.VIEW') > -1
    ) {
      this.isGroupCredit = true;
    } else {
      this.isGroupCredit = false;
    }
  }

  logout() {
    console.log('aaapp nav');
    // this.blockerService.logout();
    if (this.orgCode === 'DCB' && (this.isInsurer == 'false' || this.isInsurer == false)) {
      this.accountService.logoutDcb().subscribe((res) => {
        // this.accountService.cleanup();g9
        console.log('7777', res);
      });
    } else {
      this.accountService.logout().subscribe(
        (logoutResponse) => {
          // console.log(logoutResponse, ' <= logout repsonse');
          // this.accountService.cleanup();
        },
        (error) => {
          console.log('Error logging out', error);
          this.accountService.cleanup();
        },
        () => {
          console.log('Logged out got a complete notification');
        },
      );
    }
  }

  getNotificationList() {
    // this.accountService.getNotificationList().subscribe(notification => {
    //   console.log('api returned', notification);
    //   this.notificationArr = notification;
    //   console.log(this.notificationArr);
    //   this.notificationCount = this.notificationArr.length;
    //   });
  }

  delNotification(position) {
    this.accountService.markNotificationRead(this.notificationArr[position]).subscribe((res) => {
      this.getNotificationList();
    });
  }

  get isUser() {
    if (this.user) {
      return this.accountService.isUser;
    } else {
      return false;
    }
  }

  generateMagicLink() {
    this.loaderService.showSpinner(true);
    this.sharedService.generateMagicLink().subscribe(
      (res) => {
        this.loaderService.showSpinner(false);

        console.log('response magic', res);
        if (res['returnCode'] == 0) {
          // window.location.href = res['magicLink'];
          window.open(res['magicLink'], '_blank');
        } else {
          const dialogRef = this.dialog.open(PolicyErrorModalComponent, {
            data: res['returnMessage'],
            panelClass: 'dialog-width',
          });
          dialogRef.afterClosed().subscribe((data) => {
            // navigate
          });
        }
      },
      (err) => {
        this.loaderService.showSpinner(false);
      },
    );
  }
}
