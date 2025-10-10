export interface FormData {
    controlName: string;
    controlType: string;
    initiallyDisabled: boolean;
    valueType: string;
    currentValue?: string;
    placeholder?: string;
    options?: Array<{
        id: string;
        value: string;
    }>;
    validators?: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
        pattern?: string
        email?: boolean
    };
}





export const offlinePoliciesScreen = {
    screens: [
        {
        screenName: 'Policy',
        nextScreen: 'Proposer',
        component: 'policy-questions',
        validations: { checkMaritalStatus: true, checkBmi: true, checkTitleValidations: true },
        sections: [{
            sectionName: 'Policy Section',
            hasDependents: false,
            isDependent: false,
            dependsOnControl: '',
            formData: [{
                controlName: 'insurerName',
                key: '',
                initiallyDisabled: false,
                controlType: 'select',
                valueType: 'insurerName',
                isLoadedFromMaster: true,
                masterValue: 'Title',
                label: 'Insurer Name',
                options: [],
                validators: {
                    required: true
                }
            },
            {
                controlName: 'productName',
                key: '',
                initiallyDisabled: false,
                controlType: 'select',
                valueType: 'productName',
                isLoadedFromMaster: true,
                masterValue: 'Title',
                label: 'Product Name',
                options: [],
                validators: {
                    required: true
                }
            },
            {
                controlName: 'sp',
                key: '',
                initiallyDisabled: false,
                controlType: 'select',
                valueType: 'sp',
                isLoadedFromMaster: true,
                masterValue: 'Title',
                label: 'SP',
                options: [],
                validators: {
                    required: true
                }
            },
            {
                controlName: 'mode',
                key: '',
                initiallyDisabled: false,
                controlType: 'select',
                valueType: 'mode',
                isLoadedFromMaster: true,
                masterValue: 'Title',
                label: 'Mode',
                options: [],
                validators: {
                    required: true
                }
            },
            {
                controlName: 'premiumAmount',
                key: '',
                label: 'Total Premium with GST',
                valueType: 'premiumAmount',
                initiallyDisabled: false,
                controlType: 'text',
                validators: {
                    required: true,
                    minLength: 2,
                    maxLength: 50
                }
            },
            {
                controlName: 'basePremium',
                key: '',
                label: 'Base Premium',
                valueType: 'basePremium',
                initiallyDisabled: false,
                controlType: 'text',
                validators: {
                    required: true,
                    minLength: 2,
                    maxLength: 50
                }
            },
            {
                controlName: 'gst',
                key: '',
                label: 'GST',
                valueType: 'gst',
                initiallyDisabled: false,
                controlType: 'text',
                validators: {
                    required: true,
                    minLength: 2,
                    maxLength: 50
                }
            },
            {
                controlName: 'branchCode',
                key: '',
                label: 'Branch Code',
                valueType: 'branchCode',
                initiallyDisabled: false,
                controlType: 'text',
                validators: {
                    required: true,
                    minLength: 2,
                    maxLength: 50
                }
            }]
        }]
    }, {
        screenName: 'Proposer',
        nextScreen: 'Contact Info',
        component: 'proposer',
        validations: { checkTitleValidations: true },
        sections: [{
            sectionName: '',
            hasDependents: false,
            isDependent: false,
            dependsOnControl: '',
            sectionVisibleIfDependentValueIn: [],
            formData: [{
                controlName: 'proposerTitle',
                key: 'proposer',
                initiallyDisabled: true,
                controlType: 'select',
                valueType: 'title',
                label: 'Title',
                isLoadedFromMaster: true,
                masterValue: 'Title',
                placeholder: '',
                options: [],
                validators: {
                    required: true,
                }
            },
            {
                controlName: 'proposerFirstName',
                key: 'proposer',
                label: 'First Name',
                placeholder: '',
                valueType: 'firstName',
                initiallyDisabled: true,
                controlType: 'text',
                validators: {
                    required: true,
                    minLength: 2,
                    maxLength: 50
                }
            },
            {
                controlName: 'proposerLastName',
                key: 'proposer',
                label: 'Last Name',
                placeholder: '',
                valueType: 'lastName',
                initiallyDisabled: true,
                controlType: 'text',
                validators: {
                    required: true,
                    minLength: 2,
                    maxLength: 50
                }
            },
            {
                controlName: 'proposerDob',
                key: 'proposer',
                valueType: 'dob',
                label: 'Date of Birth',
                placeholder: '',
                initiallyDisabled: true,
                controlType: 'date',
                validators: {
                    required: true
                }
            },
            {
                controlName: 'proposerGender',
                key: 'proposer',
                valueType: 'gender',
                label: 'Gender',
                placeholder: '',
                initiallyDisabled: true,
                controlType: 'select',
                options: [{
                    id: 'M',
                    value: 'Male'
                }, {
                    id: 'F',
                    value: 'Female'
                }],
                validators: {
                    required: true
                }
            },
            {
                controlName: 'proposerMaritalStatus',
                key: 'proposer',
                valueType: 'maritalStatus',
                label: 'Marital Status',
                placeholder: '',
                initiallyDisabled: true,
                isLoadedFromMaster: true,
                masterValue: 'maritalstatus',
                controlType: 'select',
                options: [],
                validators: {
                    required: true
                }
            },
            {
                controlName: 'proposerOccupation',
                key: 'proposer',
                valueType: 'occupation',
                label: 'Occupation',
                placeholder: '',
                initiallyDisabled: true,
                isLoadedFromMaster: true,
                masterValue: 'occupation',
                controlType: 'seachableDropdown',
                options: [],
                validators: {
                    required: true
                }
            },
            {
                controlName: 'proposerIndividualPanNo',
                key: 'proposer',
                valueType: 'panNo',
                label: 'PAN Card',
                placeholder: 'ABCDE1234F',
                initiallyDisabled: false,
                controlType: 'text',
                validators: {
                    required: true,
                    pattern: '^[A-Z]{3}[ABCFGHLJPTK][A-Z][0-9]{4}[A-Z]$'
                }
            }]
        }, {
            sectionName: 'Nominee Details',
            hasDependents: false,
            isDependent: false,
            dependsOnControl: '',
            formData: [{
                controlName: 'nomineeTitle',
                key: 'policyNominee',
                initiallyDisabled: false,
                controlType: 'select',
                valueType: 'title',
                isLoadedFromMaster: true,
                masterValue: 'Title',
                label: 'Nominee Title',
                options: [],
                validators: {
                    required: true,
                }
            },
            {
                controlName: 'nomineeFirstName',
                key: 'policyNominee',
                label: 'Nominee First Name',
                valueType: 'firstName',
                initiallyDisabled: false,
                controlType: 'text',
                validators: {
                    required: true,
                    minLength: 2,
                    maxLength: 50
                }
            },
            {
                controlName: 'nomineeLastName',
                key: 'policyNominee',
                label: 'Nominee Last Name',
                valueType: 'lastName',
                initiallyDisabled: false,
                controlType: 'text',
                validators: {
                    required: true,
                    minLength: 2,
                    maxLength: 50
                }
            },
            {
                controlName: 'nomineeGender',
                key: 'policyNominee',
                label: 'Nominee Gender',
                valueType: 'gender',
                initiallyDisabled: false,
                controlType: 'select',
                options: [{
                    id: 'M',
                    value: 'Male'
                }, {
                    id: 'F',
                    value: 'Female'
                }],
                validators: {
                    required: true
                }
            },
            {
                controlName: 'nomineeDob',
                key: 'policyNominee',
                valueType: 'dob',
                label: 'Nominee Date of Birth',
                initiallyDisabled: false,
                controlType: 'date',
                maxDate: '18 Years',
                validators: {
                    required: true
                }
            },
            {
                controlName: 'nomineeRel',
                key: 'policyNominee',
                label: 'Nominee Relationship',
                valueType: 'insuredRel',
                initiallyDisabled: false,
                controlType: 'select',
                isLoadedFromMaster: true,
                masterValue: 'NomineeRelationship',
                options: [],
                validators: {
                    required: true
                }
            }]
        }, {
            sectionName: 'Policy Communication Details',
            hasDependents: false,
            isDependent: false,
            dependsOnControl: '',
            sectionVisibleIfDependentValueIn: [],
            formData: [{
                controlName: 'proposerIndividualEmail',
                key: 'proposer',
                valueType: 'email',
                label: 'Email',
                placeholder: '',
                initiallyDisabled: false,
                controlType: 'text',
                validators: {
                    required: true,
                    email: true
                }
            },
            {
                controlName: 'proposerIndividualMobile',
                key: 'proposer',
                valueType: 'mobile',
                label: 'Mobile No: (OTP will be send to this number)',
                placeholder: '',
                initiallyDisabled: false,
                controlType: 'number',
                validators: {
                    required: true,
                    pattern: '^[6789][0-9]{9}$'
                }
            }]
        }]
    }, {
        screenName: 'Contact Info',
        nextScreen: 'Summary',
        component: 'contact-info'
    }, {
        screenName: 'Summary',
        nextScreen: '',
        component: 'summary'
    }]
};

export const applicationDataJson = {
    'id': 15091641700,
    'applicationDate': '2021-06-24',
    'applicationNo': '15091641700',
    'goalId': 0,
    'insurerApplicationNo': '100210005190',
    'policyNo': '10210000231',
    'orgCode': 'BOM',
    'branchCode': '9999',
    'branchName': '',
    'approvingSp': 'SP0000000006',
    'premiumAmount': 5932,
    'basePremium': 5027,
    'gst': 905,
    'insurerCode': 151,
    'insurerName': 'ManipalCigna',
    'insurerLogo': 'https://s3.amazonaws.com/lastdecimal.brokeredge.data/ilogo/i151.svg',
    'lob': 'Health',
    'productId': '151HL05I01',
    'planId': 1,
    'productName': '',
    'productType': '',
    'customerId': 364,
    'customerName': '',
    'policyStartDate': '',
    'policyEndDate': '',
    'pt': 1,
    'ppt': 1,
    'online': true,
    'mode': '0',
    'applicationUrl': '/proposal/151HL05I01/15091641700',
    'nextPremiumDueDate': '2022-06-06',
    'statusCode': 9,
    'status': 'INITIATED',
    'sp':'',
    'applicationData': {
      'sumInsured': 500000,
      'deductible': 0,
      'online': true,
      'proposer': {
        'isIndividual': true,
        'isInsured': false,
        'type': 'I',
        'title': null,
        'firstName': '',
        'middleName': null,
        'lastName': null,
        'dob': null,
        'gender': null,
        'maritalStatus': null,
        'occupation': '',
        'panNo': null,
        'orgName': null,
        'doi': null,
        'contactPersonTitle': null,
        'contactPersonFirstName': null,
        'contactPersonLastName': null,
        'email': null,
        'mobile': null,
        'uid': null,
        'proposerIdentityType': null,
        'proposerIdentityNo': null,
        'individual': true,
        'insured': false
      },
      'insurerRmName': 'Cigna Sales',
      'insurerRmEmail': 'cignatest.insurer@testcigna.com',
      'insurerRmContact': '7656765234',
      'primaryMemberIncome': 0,
      'policyAddress': {
        'id': 365,
        'addressType': 'C',
        'addressline1': '',
        'addressline2': '',
        'addressline3': '',
        'city': '',
        'country': 'India',
        'countryCode': '91',
        'postalcode': '',
        'state': ''
      },
      'mailingAddress': {
        'id': 365,
        'addressType': 'C',
        'addressline1': '',
        'addressline2': '',
        'addressline3': '',
        'city': '',
        'country': 'India',
        'countryCode': '91',
        'postalcode': '',
        'state': ''
      },
      'addonBenefits': [
        {
          'coverId': 'CI',
          'displayName': 'Critical Illness Benefit',
          'coverType': 'A',
          'saRequired': false,
          'sa': 0,
          'selected': false
        },
        {
          'coverId': 'WRR',
          'displayName': 'Room Rent Waiver',
          'coverType': 'A',
          'saRequired': false,
          'sa': 0,
          'selected': false
        }
      ],
      'paymentInfo': {
        'paymentType': 'CC',
        'paymentSubType': null,
        'amountCollected': '5932.00',
        'collectionDate': null,
        'receiptNo': 'T04567565543',
        'payerType': null,
        'payerCode': null,
        'payerFirstName': 'Sun Kilggf',
        'payerLastName': null,
        'payerMobile': null,
        'payerEmail': null,
        'instrumentNo': '411111XXXXXX1111',
        'instrumentDate': '2021-06-24',
        'bankAccountNo': null,
        'ifscCode': null,
        'micrCode': null,
        'paymentRefNo': '403993715523355063',
        'merchantId': '403993715523355063',
        'merchantName': null,
        'paymentStatus': 'success'
      },
      'policy': [
        {
          'insurerName': 'SUNIL',
          'productName': 'KULKARNI',
          'sp': '1988-05-13',
          'mode': 'M'
        }
      ],
      'insureds': [
        {
          'memberId': 0,
          'proposerRel': '1',
          'title': 'Dr',
          'firstName': 'SUNIL',
          'lastName': 'KULKARNI',
          'dob': '1988-05-13',
          'gender': 'M',
          'rating': 'NS',
          'maritalStatus': '1',
          'occupation': 'O020',
          'identityType': '',
          'identityNo': '',
          'heightFeet': 0,
          'heightInches': 0,
          'weight': 0,
          'nationality': '',
          'answers': []
        }
      ],
      'policyNominee': {
        'insuredRel': '',
        'title': '',
        'firstName': '',
        'lastName': '',
        'dob': '',
        'gender': '',
        'benefitPercent': 100
      }
    }
  };
