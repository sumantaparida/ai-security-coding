import { Contacts, Dependents, Addresses } from './Customer';

export interface MyCustomerUserInterface {
  customerId?: number;
  bankCustomerId?: string;
  isIndividual?: boolean;
  customerName?: string;
  mobileNo?: string;
  email?: string;
  primaryContactName?: string;
  primaryEmail?: string;
  numPolicies?: number;
  totalANP?: number;
  status?: string;
  gender?: string;
  dob?: string;
  dateOfIncorporation?: string;
  addressList?: Addresses[];
  contactList?: Contacts[];
  dependentList?: Dependents[];
  applications?: {
    status?: string;
    policyNo: string;
    planName: string;
    policyEndDate: string;
    premiumAmount: number;
    nextPremiumDueDate: string;
  }[];
}
