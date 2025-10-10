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
    pattern?: string;
    email?: boolean;
  };
}

export const sampleProposalMetaData = {};

// QR Simplified Form
// export const sampleProposalMetaData = {
//   screens: [
//     {
//       screenName: 'Basic Details About Insured',
//       nextScreen: 'Summary Details',
//       component: 'genral',
//       hasMedicalWithSingleInsured: true,
//       validations: {
//         checkMaritalStatus: true,
//         checkBmi: true,
//         checkTitleValidations: true,
//         checkMedicalAnswers: true,
//       },
//       sections: [
//         {
//           sectionName: 'Medical Questions',
//           hasDependents: false,
//           isDependent: false,
//           dependsOnControl: '',
//           formData: [{ isLoadedFromMaster: true, masterValue: 'MedicalQuestion' }],
//           medicalSection: true,
//         },
//         {
//           sectionName: 'Policy Communication Details',
//           hasDependents: false,
//           isDependent: false,
//           dependsOnControl: '',
//           sectionVisibleIfDependentValueIn: [],
//           formData: [
//             {
//               controlName: 'email',
//               key: 'proposer',
//               valueType: 'email',
//               label: 'Email',
//               placeholder: '',
//               initiallyDisabled: false,
//               controlType: 'text',
//               validators: { required: true, email: true },
//             },
//             {
//               controlName: 'mobile',
//               key: 'proposer',
//               valueType: 'mobile',
//               label: 'Mobile No: (OTP will be send to this number)',
//               placeholder: '',
//               initiallyDisabled: true,
//               controlType: 'number',
//               validators: { required: true, pattern: '^[6789][0-9]{9}$' },
//             },
//           ],
//         },
//       ],
//     },
//     {
//       screenName: 'Summary Details',
//       nextScreen: '',
//       component: 'genral',
//       isSummaryScreen: true,
//       sections: [
//         {
//           sectionName: 'Medical Questions',
//           hasDependents: false,
//           isDependent: false,
//           dependsOnControl: '',
//           formData: [{ isLoadedFromMaster: true, masterValue: 'MedicalQuestion' }],
//           medicalSection: true,
//         },
//         {
//           sectionName: 'Policy Communication Details',
//           hasDependents: false,
//           isDependent: false,
//           dependsOnControl: '',
//           sectionVisibleIfDependentValueIn: [],
//           formData: [
//             {
//               controlName: 'email',
//               key: 'proposer',
//               valueType: 'email',
//               label: 'Email',
//               placeholder: '',
//               initiallyDisabled: true,
//               controlType: 'text',
//               validators: { required: true, email: true },
//             },
//             {
//               controlName: 'mobile',
//               key: 'proposer',
//               valueType: 'mobile',
//               label: 'Mobile No: (OTP will be send to this number)',
//               placeholder: '',
//               initiallyDisabled: true,
//               controlType: 'number',
//               validators: { required: true, pattern: '^[6789][0-9]{9}$' },
//             },
//           ],
//         },
//         {
//           sectionName: 'Insured Details',
//           hasDependents: false,
//           isDependent: false,
//           dependsOnControl: '',
//           sectionVisibleIfDependentValueIn: [],
//           formData: [
//             {
//               controlName: 'title',
//               key: 'proposer',
//               initiallyDisabled: true,
//               controlType: 'select',
//               valueType: 'title',
//               label: 'Title',
//               isLoadedFromMaster: true,
//               masterValue: 'Title',
//               placeholder: '',
//               options: [],
//               validators: { required: true },
//             },
//             {
//               controlName: 'firstName',
//               key: 'proposer',
//               label: 'First Name',
//               placeholder: '',
//               valueType: 'firstName',
//               initiallyDisabled: true,
//               controlType: 'text',
//               validators: { required: true, pattern: '^[A-Za-z ]+$', minLength: 1, maxLength: 50 },
//             },
//             {
//               controlName: 'lastName',
//               key: 'proposer',
//               label: 'Last Name',
//               placeholder: '',
//               valueType: 'lastName',
//               initiallyDisabled: true,
//               controlType: 'text',
//               validators: { required: true, pattern: '^[A-Za-z ]+$', minLength: 1, maxLength: 50 },
//             },
//             {
//               controlName: 'dob',
//               key: 'proposer',
//               valueType: 'dob',
//               label: 'Date of Birth',
//               placeholder: '',
//               initiallyDisabled: true,
//               controlType: 'date',
//               validators: { required: true },
//             },
//             {
//               controlName: 'gender',
//               key: 'proposer',
//               valueType: 'gender',
//               label: 'Gender',
//               placeholder: '',
//               initiallyDisabled: true,
//               controlType: 'select',
//               options: [
//                 { id: 'M', value: 'Male' },
//                 { id: 'F', value: 'Female' },
//               ],
//               validators: { required: true },
//             },
//             {
//               controlName: 'maritalStatus',
//               key: 'proposer',
//               valueType: 'maritalStatus',
//               label: 'Marital Status',
//               placeholder: '',
//               initiallyDisabled: false,
//               isLoadedFromMaster: true,
//               masterValue: 'maritalstatus',
//               controlType: 'select',
//               options: [],
//               validators: {},
//             },
//             {
//               controlName: 'occupation',
//               key: 'proposer',
//               valueType: 'occupation',
//               label: 'Occupation',
//               placeholder: '',
//               initiallyDisabled: false,
//               isLoadedFromMaster: true,
//               masterValue: 'occupation',
//               controlType: 'select',
//               options: [],
//               validators: {},
//             },
//           ],
//         },
//         {
//           sectionName: 'Policy Address',
//           hasDependents: false,
//           isDependent: false,
//           dependsOnControl: '',
//           sectionVisibleIfDependentValueIn: [],
//           formData: [
//             {
//               controlName: 'addressline1',
//               key: 'policyAddress',
//               valueType: 'addressline1',
//               label: 'Address Line 1',
//               placeholder: '',
//               initiallyDisabled: true,
//               controlType: 'text',
//               validators: { required: true },
//             },
//             {
//               controlName: 'addressline2',
//               key: 'policyAddress',
//               valueType: 'addressline2',
//               label: 'Address Line 2',
//               placeholder: '',
//               initiallyDisabled: true,
//               controlType: 'text',
//               validators: { required: true },
//             },
//             {
//               controlName: 'addressline3',
//               key: 'policyAddress',
//               valueType: 'addressline3',
//               label: 'Address Line 3',
//               placeholder: '',
//               initiallyDisabled: true,
//               controlType: 'text',
//               validators: { required: true },
//             },
//             {
//               controlName: 'postalcode',
//               key: 'policyAddress',
//               valueType: 'postalcode',
//               label: 'Pincode',
//               placeholder: '',
//               initiallyDisabled: true,
//               controlType: 'text',
//               validators: { required: true },
//             },
//             {
//               controlName: 'city',
//               key: 'policyAddress',
//               valueType: 'city',
//               label: 'City',
//               placeholder: '',
//               initiallyDisabled: true,
//               controlType: 'text',
//               validators: { required: true },
//             },
//             {
//               controlName: 'state',
//               key: 'policyAddress',
//               valueType: 'state',
//               label: 'State',
//               placeholder: '',
//               initiallyDisabled: true,
//               controlType: 'text',
//               validators: { required: true },
//             },
//           ],
//         },
//         {
//           sectionName: 'Mailing Address',
//           hasDependents: false,
//           isDependent: false,
//           dependsOnControl: '',
//           sectionVisibleIfDependentValueIn: [],
//           formData: [
//             {
//               controlName: 'addressline1',
//               key: 'mailingAddress',
//               valueType: 'addressline1',
//               label: 'Address Line 1',
//               placeholder: '',
//               initiallyDisabled: true,
//               controlType: 'text',
//               validators: { required: true },
//             },
//             {
//               controlName: 'addressline2',
//               key: 'mailingAddress',
//               valueType: 'addressline2',
//               label: 'Address Line 2',
//               placeholder: '',
//               initiallyDisabled: true,
//               controlType: 'text',
//               validators: { required: true },
//             },
//             {
//               controlName: 'addressline3',
//               key: 'mailingAddress',
//               valueType: 'addressline3',
//               label: 'Address Line 3',
//               placeholder: '',
//               initiallyDisabled: true,
//               controlType: 'text',
//               validators: { required: true },
//             },
//             {
//               controlName: 'postalcode',
//               key: 'mailingAddress',
//               valueType: 'postalcode',
//               label: 'Pincode',
//               placeholder: '',
//               initiallyDisabled: true,
//               controlType: 'text',
//               validators: { required: true },
//             },
//             {
//               controlName: 'city',
//               key: 'mailingAddress',
//               valueType: 'city',
//               label: 'City',
//               placeholder: '',
//               initiallyDisabled: true,
//               controlType: 'text',
//               validators: { required: true },
//             },
//             {
//               controlName: 'state',
//               key: 'mailingAddress',
//               valueType: 'state',
//               label: 'State',
//               placeholder: '',
//               initiallyDisabled: true,
//               controlType: 'text',
//               validators: { required: true },
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };

export const sampleApplicationData = {};

export const sampleQstruc = {};
