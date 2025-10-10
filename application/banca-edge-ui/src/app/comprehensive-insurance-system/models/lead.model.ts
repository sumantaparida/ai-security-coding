export interface Proposer {
  title: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  occupation: string;
  email: string;
  mobile: string;
  alternateMobile?: any;
  annualIncome: number;
}

export interface Insured {
  title: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  occupation: string;
  email: string;
  mobile: string;
  panNo: string;
  proposerRel: string;
}

export interface PolicyAddress {
  addressType: string;
  addressline1: string;
  addressline2: string;
  addressline3: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  postalcode: string;
}

export interface MailingAddress {
  addressType: string;
  addressline1: string;
  addressline2: string;
  addressline3: string;
  city: string;
  country: string;
  countryCode: string;
  state: string;
  postalcode: string;
}

export interface AgencyData {
  lgCode: string;
  lgName: string;
  spCode: string;
  spName: string;
}

export interface ApplicationData {
  flsCode: string;
  agentCode: string;
  rowId: string;
  proposerInsured: boolean;
  sumInsured?: any;
  proposer: Proposer;
  insureds: Insured[];
  policyAddress: PolicyAddress;
  mailingAddress: MailingAddress;
  agencyData: AgencyData;
}

export interface Lead {
  customerId: string;
  lob: string;
  productType: string;
  productId: string;
  productName: string;
  insurerId: number;
  insurerName: string;
  spCode: string;
  statusCode: number;
  pt: string;
  ppt: string;
  mode: string;
  premiumAmount?: any;
  basePremium?: any;
  gst?: any;
  lgCode: string;
  flsCode: string;
  applicationData: ApplicationData;
}
