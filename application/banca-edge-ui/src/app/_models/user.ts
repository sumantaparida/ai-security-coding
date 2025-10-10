export class User {
  bankCustomer: any;

  branchCode: string;

  email: string;

  firstName: string;

  insurerId: number;

  insurerUser: any;

  isBankCustomer: boolean;

  isInsurerUser: boolean;

  isSP: boolean;

  lastName: string;

  licenseCode: string;

  licenseExpiryDate: string;

  licenseType: string;

  mobileNo: string;

  orgLogo: string;

  organizationCode: string;

  responseCode: number;

  responseMessage: string;

  roles: string[];

  userGroups: string[];

  sendEmailOnCreate: boolean;

  sp: boolean;

  userName: string;

  allowedBranches: string[];

  otpValidationRequired: boolean;

  message?:string;

  orgCode?:string;
}
