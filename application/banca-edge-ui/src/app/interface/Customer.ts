
export interface Contacts {
  id?: number;
  contactType?: string;
  contactText?: string;
}
export interface Addresses {
  id?: number;
  addressType?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  country?: string;
  countryCode?: string;
  district?: string;
  state?: string;
  postalcode?: string;
}
export interface Dependents {
  id?: number;
  firstName?: string;
  lastName?: string;
  dependentId?: number;
  dob?: string;
  relationshipType?: string;
}
export interface CustomerNotifications {
  notificationId?: number;
  relationshipId?: string;
  relationshipType?: string;
  notificationStatus?: number;
  notificationDate?: string;
  notificationType?: string;
  notificationText?: string;
  isRead?: boolean;
  read?: boolean;
}
export interface CustomerApplications {
  id?: number;
  applicationDate?: string;
  applicationNo?: string;
  goalId?: number;
  insurerApplicationNo?: string;
  approvingSp?: string;
  premiumAmount?: number;
  insurerCode?: number;
  policyStartDate?: string;
  policyEndDate?: string;
  pt?: number;
  ppt?: number;
  mode?: string;
  lob?: string
  productId?: string;
  productName?: string;
  productType?: string;
  status?: string;
  applicationData?: {
    paymentInfo?: {
      premiumPaid?: number;
      premiumPaidDate?: string;
      paymentMode?: string;
      paymentModeDesc?: string;
      instrumentNo?: string;
      instrumentDate?: string;
      bankName?: string;
      ifscCode?: string;
      BranchName?: string;
    }
  }
}

export interface IndividualCustomer {
  customerId?: number;
  bankCustomerId?: string;
  organizationCode?: string;
  branchCode?: string;
  mobileNo?: string;
  isIndividual?: boolean;
  firstName?: string;
  lastName?: string;
  gender?: string;
  dob?: string;
  maritalStatus?: string;
  createdBy?: string;
  totalANP?: number;
  numPolicies?: number;
  contactList?: {
    id?: number;
    contactType?: string;
    contactText?: string;
  }[];
  addressList?: {
    id?: number;
    addressType?: string;
    addressLine1?: string;
    addressLine2?: string;
    addressLine3?: string;
    city?: string;
    country?: string;
    countryCode?: string;
    district?: string;
    state?: string;
    postalcode?: string;
  }[];
  dependentList?:
  {
    id?: number;
    firstName?: string;
    lastName?: string;
    dependentId?: number;
    dob?: string;
    relationshipType?: string;

  }[];

  notifications?:
  {
    notificationId?: number;
    relationshipId?: string;
    relationshipType?: string;
    notificationStatus?: number;
    notificationDate?: string;
    notificationType?: string;
    notificationText?: string;
    isRead?: boolean;
    read?: boolean;
  }[];

  applications?:
  {
    id?: number;
    applicationDate?: string;
    applicationNo?: string;
    goalId?: number;
    insurerApplicationNo?: string;
    approvingSp?: string;
    premiumAmount?: number;
    insurerCode?: number;
    policyStartDate?: string;
    policyEndDate?: string;
    pt?: number;
    ppt?: number;
    mode?: string;
    lob?: string
    productId?: string;
    productName?: string;
    productType?: string;
    status?: string;
    applicationData?: {
      paymentInfo?: {
        premiumPaid?: number;
        premiumPaidDate?: string;
        paymentMode?: string;
        paymentModeDesc?: string;
        instrumentNo?: string;
        instrumentDate?: string;
        bankName?: string;
        ifscCode?: string;
        BranchName?: string;
      }
    }
  }[];
  individual?: boolean;
}

export interface BusinessCustomer {
  customerId?: number;
  organizationCode?: string;
  branchCode?: string;
  mobileNo?: string;
  isIndividual?: boolean;
  dateOfIncorporation?: string;
  gstn?: string;
  orgName?: string;
  panNo?: string;
  primaryContactName?: string;
  primaryEmail?: string;
  createdBy?: string;
  contactList?: {
    id?: number;
    contactType?: string;
    contactText?: string;
  }[];
  addressList?: {
    id?: number;
    addressType?: string;
    addressLine1?: string;
    addressLine2?: string;
    addressLine3?: string;
    city?: string;
    country?: string;
    countryCode?: string;
    district?: string;
    state?: string;
    postalcode?: string;
  }[];
  notifications?: {
    notificationId?: number;
    relationshipId?: string;
    relationshipType?: string;
    notificationStatus?: number;
    notificationDate?: string;
    notificationType?: string;
    notificationText?: string;
    isRead?: boolean;
    read?: boolean;
  }[];

  applications?: {
    id?: number;
    applicationDate?: string;
    applicationNo?: string;
    goalId?: number;
    insurerApplicationNo?: string;
    approvingSp?: string;
    premiumAmount?: number;
    insurerCode?: number;
    policyStartDate?: string;
    policyEndDate?: string;
    pt?: number;
    ppt?: number;
    mode?: string;
    lob?: string,
    productId?: string;
    productName?: string;
    productType?: string;
    status?: string;
    applicationData?: {
      paymentInfo?: {
        premiumPaid?: number;
        premiumPaidDate?: string;
        paymentMode?: string;
        paymentModeDesc?: string;
        instrumentNo?: string;
        instrumentDate?: string;
        bankName?: string;
        ifscCode?: string;
        BranchName?: string;
      }
    }
  }[];
}

export interface Customer extends IndividualCustomer, BusinessCustomer { }

export interface PostalCode {
  pincode: string;
  stdcode: string;
  city: string;
  stateCode: string;
  stateName: string;
  cityName: string;
}

