import { Injectable } from '@angular/core';
import { max } from 'moment';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  // formStructure = [
  //     {
  //         "name": "productId",
  //         "label": "Product ID",
  //         "value": "",
  //         "placeholder": "",
  //         "class": "col-md-6",
  //         "type": "text",
  //         "validators": [{
  //             "validatorName": "required",
  //             "required": true,
  //             "message": "First Name is Required"
  //         }]
  //     },
  //     {
  //     "name": "masterName",
  //     "label": "Master Name",
  //     "value": "",
  //     "placeholder": "",
  //     "class": "col-md-6",
  //     "type": "text",
  //     "validators": [{
  //         "validatorName": "required",
  //         "required": true,
  //         "message": "First Name is Required"
  //     }]
  //     },
  //     {
  //     "name": "id",
  //     "label": "ID",
  //     "value": "",
  //     "placeholder": "",
  //     "class": "col-md-6",
  //     "type": "text",
  //     "validators": [{
  //         "validatorName": "required",
  //         "required": true,
  //         "message": "Last Name is Required"
  //     }, {
  //         "validatorName": "minLength",
  //         "minLength": 5,
  //         "message": "min char should be 5"
  //     }]
  //     },
  //     {
  //     "name": "value",
  //     "label": "Value",
  //     "value": "",
  //     "placeholder": "",
  //     "class": "col-md-6",
  //     "type": "text",
  //     "validators": [{
  //         "validatorName": "required",
  //         "required": true,
  //         "message": "Email is Required"
  //     }, {
  //         "validatorName": "minLength",
  //         "email": "email",
  //         "message": "Email is not Valid"
  //     }]
  //     },

  //   ];

  // Covers

  //     formStructure = [

  //     {
  //         "id": "covers",
  //         "name": "productName",
  //         "label": "Product Name",
  //         "placeholder": "",
  //         "value": "",
  //         "class": "col-md-4",
  //         "type": "select",
  //         "options": [
  //             {"id": 1, "value": "monthly"},
  //             {"id": 2, "value": "quaterly"},
  //             {"id": 3, "value": "yearly"},
  //         ],
  //         "validators": [{
  //             "validatorName": "required",
  //             "required": true,
  //             "message": "Gender is Required"
  //         }, {
  //             "validatorName": "maxLength",
  //             "maxLength": 10,
  //             "message": "Email is not Valid"
  //         }]
  //     },
  //     {
  //         "id": "covers",
  //         "name": "cproductName",
  //         "label": "Product ID",
  //         "placeholder": "",
  //         "value": "",
  //         "class": "col-md-4",
  //         "type": "select",
  //         "options": [
  //             {"id": 1, "value": "monthly"},
  //             {"id": 2, "value": "quaterly"},
  //             {"id": 3, "value": "yearly"},
  //         ],
  //         "validators": [{
  //             "validatorName": "required",
  //             "required": true,
  //             "message": "Gender is Required"
  //         }, {
  //             "validatorName": "maxLength",
  //             "maxLength": 10,
  //             "message": "Email is not Valid"
  //         }]
  //     },
  //     {
  //         "id": "covers",
  //         "name": "cLob",
  //         "label": "LOB",
  //         "placeholder": "",
  //         "value": "",
  //         "class": "col-md-4",
  //         "type": "select",
  //         "options": [
  //             {"id": 1, "value": "monthly"},
  //             {"id": 2, "value": "quaterly"},
  //             {"id": 3, "value": "yearly"},
  //         ],
  //         "validators": [{
  //             "validatorName": "required",
  //             "required": true,
  //             "message": "Gender is Required"
  //         }, {
  //             "validatorName": "maxLength",
  //             "maxLength": 10,
  //             "message": "Email is not Valid"
  //         }]
  //     },
  //         {
  //             "id": "covers",
  //             "name": "cIsCover",
  //             "label": "Is Cover Available",
  //             "placeholder": "",
  //             "value": "",
  //             "class": "col-md-4",
  //             "type": "radio",
  //             "radioOptions": [{id: 1, "value": 'Male'}, {id: 2, 'value': 'Female'}],
  //             "validators": [{
  //                 "validatorName": "required",
  //                 "required": true,
  //                 "message": "Gender is Required"
  //             }, {
  //                 "validatorName": "maxLength",
  //                 "maxLength": 10,
  //                 "message": "Email is not Valid"
  //             }]
  //     },
  //     {
  //         "id": "covers",
  //         "name": "ccoverID",
  //         "label": "Cover ID",
  //         "placeholder": "",
  //         "value": "",
  //         "class": "col-md-4",
  //         "type": "select",
  //         "options": [
  //             {"id": 1, "value": "monthly"},
  //             {"id": 2, "value": "quaterly"},
  //             {"id": 3, "value": "yearly"},
  //         ],
  //         "validators": [{
  //             "validatorName": "required",
  //             "required": true,
  //             "message": "Gender is Required"
  //         }, {
  //             "validatorName": "maxLength",
  //             "maxLength": 10,
  //             "message": "Email is not Valid"
  //         }]
  //     },
  //     {
  //             "id": "covers",
  //             "name": "cCoverName",
  //             "label": "Cover Name",
  //             "value": "",
  //             "placeholder": "",
  //             "class": "col-md-6",
  //             "type": "text",
  //             "validators": [{
  //                 "validatorName": "required",
  //                 "required": true,
  //                 "message": "First Name is Required"
  //             }]
  //     },
  //     {
  //         "id": "covers",
  //         "name": "chelpText",
  //         "label": "Help Text",
  //         "value": "",
  //         "placeholder": "",
  //         "class": "col-md-6",
  //         "type": "text",
  //         "validators": [{
  //             "validatorName": "required",
  //             "required": true,
  //             "message": "First Name is Required"
  //         }]
  // },
  // {
  //     "id": "covers",
  //     "name": "ccoverType",
  //     "label": "Cover Type",
  //     "placeholder": "",
  //     "value": "",
  //     "class": "col-md-4",
  //     "type": "select",
  //     "options": [
  //         {"id": 1, "value": "monthly"},
  //         {"id": 2, "value": "quaterly"},
  //         {"id": 3, "value": "yearly"},
  //     ],
  //     "validators": [{
  //         "validatorName": "required",
  //         "required": true,
  //         "message": "Gender is Required"
  //     }, {
  //         "validatorName": "maxLength",
  //         "maxLength": 10,
  //         "message": "Email is not Valid"
  //     }]
  // },
  // {
  //     "id": "covers",
  //     "name": "insuredObj",
  //     "label": "Insured Object",
  //     "placeholder": "",
  //     "value": "",
  //     "class": "col-md-4",
  //     "type": "select",
  //     "options": [
  //         {"id": 1, "value": "monthly"},
  //         {"id": 2, "value": "quaterly"},
  //         {"id": 3, "value": "yearly"},
  //     ],
  //     "validators": [{
  //         "validatorName": "required",
  //         "required": true,
  //         "message": "Gender is Required"
  //     }, {
  //         "validatorName": "maxLength",
  //         "maxLength": 10,
  //         "message": "Email is not Valid"
  //     }]
  // },
  // {
  //     "id": "covers",
  //     "name": "cbenifits",
  //     "label": "Benifit Description",
  //     "value": "",
  //     "placeholder": "",
  //     "class": "col-md-6",
  //     "type": "text",
  //     "validators": [{
  //         "validatorName": "required",
  //         "required": true,
  //         "message": "First Name is Required"
  //     }]
  // },
  // {
  //     "id": "covers",
  //     "name": "cSeperateSi",
  //     "label": "Seperate SI",
  //     "value": "",
  //     "placeholder": "",
  //     "class": "col-md-6",
  //     "type": "text",
  //     "validators": [{
  //         "validatorName": "required",
  //         "required": true,
  //         "message": "First Name is Required"
  //     }]
  // }

  // ];

  // Medical

  //   formStructure = [

  //     {
  //         "name": "productName",
  //         "label": "Product Name",
  //         "placeholder": "",
  //         "value": "",
  //         "class": "col-md-4",
  //         "type": "select",
  //         "options": [
  //             {"id": 1, "value": "monthly"},
  //             {"id": 2, "value": "quaterly"},
  //             {"id": 3, "value": "yearly"},
  //         ],
  //         "validators": [{
  //             "validatorName": "required",
  //             "required": true,
  //             "message": "Gender is Required"
  //         }, {
  //             "validatorName": "maxLength",
  //             "maxLength": 10,
  //             "message": "Email is not Valid"
  //         }]
  //     },
  //     {
  //                 "name": "productId",
  //                 "label": "Product ID",
  //                 "placeholder": "",
  //                 "class": "col-md-4",
  //                 "value": "",
  //                 "type": "select",
  //                 "options": [
  //                     {"id": 1, "value": "monthly"},
  //                     {"id": 2, "value": "quaterly"},
  //                     {"id": 3, "value": "yearly"},
  //                 ],
  //                 "validators": [{
  //                     "validatorName": "required",
  //                     "required": true,
  //                     "message": "Gender is Required"
  //                 }, {
  //                     "validatorName": "maxLength",
  //                     "maxLength": 10,
  //                     "message": "Email is not Valid"
  //                 }]
  //     },
  //     {
  //             "name": "type",
  //             "label": "Type",
  //             "placeholder": "",
  //             "value": "",
  //             "class": "col-md-4",
  //             "type": "select",
  //             "options": [
  //                 {"id": 1, "value": "monthly"},
  //                 {"id": 2, "value": "quaterly"},
  //                 {"id": 3, "value": "yearly"},
  //             ],
  //             "validators": [{
  //                 "validatorName": "required",
  //                 "required": true,
  //                 "message": "Gender is Required"
  //             }, {
  //                 "validatorName": "maxLength",
  //                 "maxLength": 10,
  //                 "message": "Email is not Valid"
  //             }]
  //     },
  //     {
  //             "name": "code",
  //             "label": "Code",
  //             "value": "",
  //             "placeholder": "",
  //             "class": "col-md-6",
  //             "type": "text",
  //             "validators": [{
  //                 "validatorName": "required",
  //                 "required": true,
  //                 "message": "First Name is Required"
  //             }]
  //     },
  //     {
  //             "name": "questionType",
  //             "label": "Question Type",
  //             "placeholder": "",
  //             "value": "",
  //             "class": "col-md-4",
  //             "type": "select",
  //             "options": [
  //                 {"id": 1, "value": "monthly"},
  //                 {"id": 2, "value": "quaterly"},
  //                 {"id": 3, "value": "yearly"},
  //             ],
  //             "validators": [{
  //                 "validatorName": "required",
  //                 "required": true,
  //                 "message": "Gender is Required"
  //             }, {
  //                 "validatorName": "maxLength",
  //                 "maxLength": 10,
  //                 "message": "Email is not Valid"
  //             }]
  //     },
  //     {
  //             "name": "questionId",
  //             "label": "Question ID",
  //             "value": "",
  //             "placeholder": "",
  //             "class": "col-md-6",
  //             "type": "text",
  //             "validators": [{
  //                 "validatorName": "required",
  //                 "required": true,
  //                 "message": "First Name is Required"
  //             }]
  //     },
  //     {
  //             "name": "questionText",
  //             "label": "Question Text",
  //             "value": "",
  //             "placeholder": "",
  //             "class": "col-md-6",
  //             "type": "text",
  //             "validators": [{
  //                 "validatorName": "required",
  //                 "required": true,
  //                 "message": "First Name is Required"
  //             }]
  //     },
  //     {
  //             "name": "formData",
  //             "label": "FormData",
  //             "placeholder": "",
  //             "value": "",
  //             "class": "col-md-4",
  //             "type": "radio",
  //             "radioOptions": [{id: 1, "value": 'Male'}, {id: 2, 'value': 'Female'}],
  //             "validators": [{
  //                 "validatorName": "required",
  //                 "required": true,
  //                 "message": "Gender is Required"
  //             }, {
  //                 "validatorName": "maxLength",
  //                 "maxLength": 10,
  //                 "message": "Email is not Valid"
  //             }]
  //     },
  //     {
  //             "name": "positiveAnswer",
  //             "label": "Postive Answer",
  //             "placeholder": "",
  //             "value": "",
  //             "class": "col-md-4",
  //             "type": "radio",
  //             "radioOptions": [{id: 1, "value": 'Male'}, {id: 2, 'value': 'Female'}],
  //             "validators": [{
  //                 "validatorName": "required",
  //                 "required": true,
  //                 "message": "Gender is Required"
  //             }, {
  //                 "validatorName": "maxLength",
  //                 "maxLength": 10,
  //                 "message": "Email is not Valid"
  //             }]
  //     },
  //     {
  //             "name": "restrickOnNegative",
  //             "label": "Restrict on Negative",
  //             "placeholder": "",
  //             "value": "",
  //             "class": "col-md-4",
  //             "type": "radio",
  //             "radioOptions": [{id: 1, "value": 'Male'}, {id: 2, 'value': 'Female'}],
  //             "validators": [{
  //                 "validatorName": "required",
  //                 "required": true,
  //                 "message": "Gender is Required"
  //             }, {
  //                 "validatorName": "maxLength",
  //                 "maxLength": 10,
  //                 "message": "Email is not Valid"
  //             }]
  //     },
  //   ];

  getFormStructure() {
    return this.formStructure;
  }

  // Final LOV
  // formStructure = [
  //   {
  //     "screens": [
  //       {
  //         "name": "productId",
  //         "label": "Product ID",
  //         "isLoadedFromMaster": false,
  //         "masterValue": "productId",
  //         "value": "",
  //         "placeholder": "",
  //         "class": "col-md-6",
  //         "type": "text",
  //         "options": [],
  //         "validators": [
  //           {
  //             "validatorName": "required",
  //             "required": true,
  //             "message": "Product ID is Required"
  //           }
  //         ]
  //       },
  //       {
  //         "name": "masterName",
  //         "label": "Master Name",
  //         "isLoadedFromMaster": false,
  //         "masterValue": "masterName",
  //         "value": "",
  //         "placeholder": "",
  //         "class": "col-md-6",
  //         "type": "text",
  //         "validators": [
  //           {
  //             "validatorName": "required",
  //             "required": true,
  //             "message": "Master Name is Required"
  //           }
  //         ]
  //       },
  //       {
  //         "name": "id",
  //         "label": "ID",
  //         "isLoadedFromMaster": false,
  //         "masterValue": "id",
  //         "value": "",
  //         "placeholder": "",
  //         "class": "col-md-6",
  //         "type": "text",
  //         "validators": [
  //           {
  //             "validatorName": "required",
  //             "required": true,
  //             "message": "ID is Required"
  //           },
  //           {
  //             "validatorName": "minLength",
  //             "minLength": 5,
  //             "message": "min char should be 5"
  //           }
  //         ]
  //       },
  //       {
  //         "name": "value",
  //         "label": "Value",
  //         "isLoadedFromMaster": false,
  //         "masterValue": "value",
  //         "value": "",
  //         "placeholder": "",
  //         "class": "col-md-6",
  //         "type": "text",
  //         "validators": [
  //           {
  //             "validatorName": "required",
  //             "required": true,
  //             "message": "Value is Required"
  //           },
  //           {
  //             "validatorName": "minLength",
  //             "email": "email",
  //             "message": "Email is not Valid"
  //           }
  //         ]
  //       }
  //     ]
  //   }

  //   ];

  //   Covers
  // formStructure = [
  //     {
  //         "screens": [

  //           {
  //             "name": "productName",
  //             "label": "Product Name",
  //             "isLoadedFromMaster": true,
  //             "masterValue": "Product",
  //             "placeholder": "",
  //             "value": "",
  //             "class": "col-md-4",
  //             "type": "select",
  //             "options": [
  //             ],
  //             "validators": [
  //               {
  //                 "validatorName": "required",
  //                 "required": true,
  //                 "message": "Product Name is Required"
  //               },
  //               {
  //                 "validatorName": "maxLength",
  //                 "maxLength": 10,
  //                 "message": "Email is not Valid"
  //               }
  //             ]
  //           },
  //           {
  //             "name": "productId",
  //             "label": "Product ID",
  //             "isLoadedFromMaster": true,
  //             "masterValue": "Product",
  //             "placeholder": "",
  //             "value": "",
  //             "class": "col-md-4",
  //             "type": "select",
  //             "options": [
  //             ],
  //             "validators": [
  //               {
  //                 "validatorName": "required",
  //                 "required": true,
  //                 "message": "Product ID is Required"
  //               },
  //               {
  //                 "validatorName": "maxLength",
  //                 "maxLength": 10,
  //                 "message": "Email is not Valid"
  //               }
  //             ]
  //           },
  //           {
  //             "name": "Lob",
  //             "label": "LOB",
  //             "isLoadedFromMaster": true,
  //             "masterValue": "LOB",
  //             "placeholder": "",
  //             "value": "",
  //             "class": "col-md-4",
  //             "type": "select",
  //             "options": [
  //             ],
  //             "validators": [
  //               {
  //                 "validatorName": "required",
  //                 "required": true,
  //                 "message": "LOB is Required"
  //               },
  //               {
  //                 "validatorName": "maxLength",
  //                 "maxLength": 10,
  //                 "message": "Email is not Valid"
  //               }
  //             ]
  //           },
  //           {
  //             "name": "IsCover",
  //             "label": "Is Cover Available",
  //             "isLoadedFromMaster": false,
  //             "masterValue": "IsCover",
  //             "placeholder": "",
  //             "value": "",
  //             "class": "col-md-4",
  //             "type": "radio",
  //             "radioOptions": [
  //               {
  //                 "id": 1,
  //                 "value": "Yes"
  //               },
  //               {
  //                 "id": 2,
  //                 "value": "No"
  //               }
  //             ],
  //             "validators": [
  //               {
  //                 "validatorName": "required",
  //                 "required": true,
  //                 "message": "Cover is Required"
  //               },
  //               {
  //                 "validatorName": "maxLength",
  //                 "maxLength": 10,
  //                 "message": "Email is not Valid"
  //               }
  //             ]
  //           },
  //           {
  //             "name": "coverID",
  //             "label": "Cover ID",
  //             "isLoadedFromMaster": true,
  //             "masterValue": "Covers",
  //             "placeholder": "",
  //             "value": "",
  //             "class": "col-md-4",
  //             "type": "select",
  //             "options": [
  //               {
  //                 "id": "AB",
  //                 "value": "Accident Benefit Rider"
  //               },
  //               {
  //                 "id": "ACCHOSP",
  //                 "value": "Accident Hospitalization"
  //               },
  //               {
  //                 "id": "ACCOEMG",
  //                 "value": "Emergency Accommodation"
  //               },
  //               {
  //                 "id": "ADB",
  //                 "value": "Accidental Death Benefit"
  //               },
  //               {
  //                 "id": "ADBCC",
  //                 "value": "Accidental Death Benefit - Common Carrier"
  //               }
  //             ],
  //             "validators": [
  //               {
  //                 "validatorName": "required",
  //                 "required": true,
  //                 "message": "Cover Id is Required"
  //               },
  //               {
  //                 "validatorName": "maxLength",
  //                 "maxLength": 10,
  //                 "message": "Email is not Valid"
  //               }
  //             ]
  //           },
  //           {
  //             "name": "coverName",
  //             "label": "Cover Name",
  //             "isLoadedFromMaster": true,
  //             "masterValue": "Covers",
  //             "placeholder": "",
  //             "value": "",
  //             "class": "col-md-4",
  //             "type": "select",
  //             "options": [
  //               {
  //                 "id": "AB",
  //                 "value": "Accident Benefit Rider"
  //               },
  //               {
  //                 "id": "ACCHOSP",
  //                 "value": "Accident Hospitalization"
  //               },
  //               {
  //                 "id": "ACCOEMG",
  //                 "value": "Emergency Accommodation"
  //               },
  //               {
  //                 "id": "ADB",
  //                 "value": "Accidental Death Benefit"
  //               },
  //               {
  //                 "id": "ADBCC",
  //                 "value": "Accidental Death Benefit - Common Carrier"
  //               }
  //             ],
  //             "validators": [
  //               {
  //                 "validatorName": "required",
  //                 "required": true,
  //                 "message": "Cover Id is Required"
  //               },
  //               {
  //                 "validatorName": "maxLength",
  //                 "maxLength": 10,
  //                 "message": "Email is not Valid"
  //               }
  //             ]
  //           },
  //           {
  //             "name": "helpText",
  //             "label": "Help Text",
  //             "isLoadedFromMaster": false,
  //             "masterValue": "helpText",
  //             "value": "",
  //             "placeholder": "",
  //             "class": "col-md-6",
  //             "type": "text",
  //             "validators": [
  //               {
  //                 "validatorName": "required",
  //                 "required": true,
  //                 "message": "Help Text is Required"
  //               }
  //             ]
  //           },
  //           {
  //             "name": "coverType",
  //             "label": "Cover Type",
  //             "isLoadedFromMaster": true,
  //             "masterValue": "CoverDetails",
  //             "placeholder": "",
  //             "value": "",
  //             "class": "col-md-4",
  //             "type": "select",
  //             "options": [
  //               {
  //                 "id": 1,
  //                 "value": "monthly"
  //               },
  //               {
  //                 "id": 2,
  //                 "value": "quaterly"
  //               },
  //               {
  //                 "id": 3,
  //                 "value": "yearly"
  //               }
  //             ],
  //             "validators": [
  //               {
  //                 "validatorName": "required",
  //                 "required": true,
  //                 "message": "Cover Type is Required"
  //               },
  //               {
  //                 "validatorName": "maxLength",
  //                 "maxLength": 10,
  //                 "message": "Email is not Valid"
  //               }
  //             ]
  //           },
  //           {
  //             "name": "insuredObj",
  //             "label": "Insured Object",
  //             "isLoadedFromMaster": true,
  //             "masterValue": "InsuredObject",
  //             "placeholder": "",
  //             "value": "",
  //             "class": "col-md-4",
  //             "type": "select",
  //             "options": [
  //               {
  //                 "id": 1,
  //                 "value": "monthly"
  //               },
  //               {
  //                 "id": 2,
  //                 "value": "quaterly"
  //               },
  //               {
  //                 "id": 3,
  //                 "value": "yearly"
  //               }
  //             ],
  //             "validators": [
  //               {
  //                 "validatorName": "required",
  //                 "required": true,
  //                 "message": "Insured Object is Required"
  //               },
  //               {
  //                 "validatorName": "maxLength",
  //                 "maxLength": 10,
  //                 "message": "Email is not Valid"
  //               }
  //             ]
  //           },
  //           {
  //             "name": "benifits",
  //             "label": "Benifit Description",
  //             "isLoadedFromMaster": false,
  //             "masterValue": "benifits",
  //             "value": "",
  //             "placeholder": "",
  //             "class": "col-md-6",
  //             "type": "text",
  //             "validators": [
  //               {
  //                 "validatorName": "required",
  //                 "required": true,
  //                 "message": "Benifits is Required"
  //               }
  //             ]
  //           },
  //           {
  //             "name": "seperateSi",
  //             "label": "Seperate SI",
  //             "isLoadedFromMaster": true,
  //             "masterValue": "seperateSi",
  //             "value": "",
  //             "placeholder": "",
  //             "class": "col-md-6",
  //             "type": "text",
  //             "validators": [
  //               {
  //                 "validatorName": "required",
  //                 "required": true,
  //                 "message": "Seperate SI is Required"
  //               }
  //             ]
  //           }
  //         ]
  //       }

  //   ];

  // Medical

  formStructure = [
    {
      screens: [
        {
          name: 'productName',
          label: 'Product Name',
          isLoadedFromMaster: true,
          masterValue: 'Product',
          placeholder: '',
          value: '',
          class: 'col-md-4',
          type: 'select',
          options: [],
          validators: [
            {
              validatorName: 'required',
              required: true,
              message: 'Product Name is Required',
            },
            {
              validatorName: 'maxLength',
              maxLength: 10,
              message: 'ProductName is not Valid',
            },
          ],
        },
        {
          name: 'productId',
          label: 'Product ID',
          isLoadedFromMaster: true,
          masterValue: 'Product',
          placeholder: '',
          value: '',
          class: 'col-md-4',
          type: 'select',
          options: [],
          validators: [
            {
              validatorName: 'required',
              required: true,
              message: 'Product ID is Required',
            },
            {
              validatorName: 'maxLength',
              maxLength: 10,
              message: 'Product ID is not Valid',
            },
          ],
        },
        {
          name: 'type',
          label: 'Type',
          isLoadedFromMaster: true,
          masterValue: 'TypeOfQuestion',
          placeholder: '',
          value: '',
          class: 'col-md-4',
          type: 'select',
          options: [],
          validators: [
            {
              validatorName: 'required',
              required: true,
              message: 'LOB is Required',
            },
            {
              validatorName: 'maxLength',
              maxLength: 10,
              message: 'Type is not Valid',
            },
          ],
        },
        {
          name: 'code',
          label: 'Code',
          isLoadedFromMaster: false,
          masterValue: 'code',
          value: '',
          placeholder: '',
          class: 'col-md-6',
          type: 'text',
          validators: [
            {
              validatorName: 'required',
              required: true,
              message: 'Code is Required',
            },
          ],
        },
        {
          name: 'questionType',
          label: 'Question Type',
          isLoadedFromMaster: true,
          masterValue: 'QuestionType',
          placeholder: '',
          value: '',
          class: 'col-md-4',
          type: 'select',
          options: [],
          validators: [
            {
              validatorName: 'required',
              required: true,
              message: 'Question Type is Required',
            },
            {
              validatorName: 'maxLength',
              maxLength: 10,
              message: 'Question Type is not Valid',
            },
          ],
        },
        {
          name: 'questionId',
          label: 'Question ID',
          isLoadedFromMaster: false,
          masterValue: 'questionId',
          value: '',
          placeholder: '',
          class: 'col-md-6',
          type: 'text',
          validators: [
            {
              validatorName: 'required',
              required: true,
              message: 'Question ID is Required',
            },
          ],
        },
        {
          name: 'questionText',
          label: 'Question Text',
          isLoadedFromMaster: false,
          masterValue: 'questionText',
          value: '',
          placeholder: '',
          class: 'col-md-6',
          type: 'text',
          validators: [
            {
              validatorName: 'required',
              required: true,
              message: 'Question Text is Required',
            },
          ],
        },
        {
          name: 'postiveAnswer',
          label: 'Positive Answer',
          isLoadedFromMaster: false,
          placeholder: '',
          value: '',
          class: 'col-md-4',
          type: 'radio',
          radioOptions: [
            { id: 1, value: 'Yes' },
            { id: 2, value: 'No' },
          ],
          validators: [
            {
              validatorName: 'required',
              required: true,
              message: 'Positive Answer is Required',
            },
            {
              validatorName: 'maxLength',
              maxLength: 10,
              message: 'Positive Answer is not Valid',
            },
          ],
        },
        {
          name: 'restrictOnNegative',
          label: 'Restrict on Negative',
          isLoadedFromMaster: false,
          placeholder: '',
          value: '',
          class: 'col-md-4',
          type: 'radio',
          radioOptions: [
            { id: 1, value: 'Yes' },
            { id: 2, value: 'No' },
          ],
          validators: [
            {
              validatorName: 'required',
              required: true,
              message: 'Restrict on Negative is Required',
            },
            {
              validatorName: 'maxLength',
              maxLength: 10,
              message: 'Restrict on Negative is not Valid',
            },
          ],
        },
      ],
    },
  ];

  // Test Add User or Edit
}

export const userFormData = [
  {
    controlName: 'isInsurerUser',
    initiallyDisabled: true,
    controlType: 'select',
    valueType: 'isInsurerUser',
    isDependent: false,
    label: 'User Type',
    placeholder: '',
    isLoadedFromMaster: true,
    masterValue: '',
    options: [
      { id: true, value: 'Insurer User' },
      { id: false, value: 'Branch User' },
    ],
    validators: {
      required: true,
      message: 'User Type is Required',
    },
  },
  {
    controlName: 'userName',
    initiallyDisabled: true,
    controlType: 'text',
    valueType: 'userName',
    isDependent: false,
    label: 'Username',
    placeholder: '',
    isLoadedFromMaster: true,
    masterValue: '',
    options: [],
    validators: {
      required: true,
      // pattern: '^[a-zA-Z0-9_@.#$=!%]+$',
      pattern: '^\\S*$',
      minLength: 3,
      maxLength: 45,
      message: 'Username is Required',
    },
  },
  // {
  //     controlName: "organizationCode",
  //     initiallyDisabled: false,
  //     controlType: "text",
  //     valueType: "organizationCode",
  //     label: "Organisation Code",
  //     isDependent: false,
  //     placeholder: "",
  //     isLoadedFromMaster: true,
  //     masterValue: "",
  //     options: [],
  //     validators: {
  //         required: true,
  //     },
  // },
  {
    controlName: 'branchCode',
    valueType: 'branchCode',
    label: 'Branch',
    placeholder: '',
    isDependent: false,
    isLoadedFromMaster: true,
    masterValue: 'getAllBranches',
    initiallyDisabled: false,
    options: [],
    controlType: 'seachableDropdown',
    validators: {
      required: true,
    },
  },
  {
    controlName: 'firstName',
    valueType: 'firstName',
    label: 'First Name',
    placeholder: 'John',
    isDependent: false,
    initiallyDisabled: false,
    controlType: 'text',
    validators: {
      required: true,
      minLength: 3,
      maxLength: 45,
      pattern: '^[a-zA-Z]+$',
    },
  },
  {
    controlName: 'lastName',
    valueType: 'lastName',
    label: 'Last Name',
    placeholder: 'Doe',
    isDependent: false,
    initiallyDisabled: false,
    controlType: 'text',
    validators: {
      required: true,
      minLength: 1,
      maxLength: 45,
      pattern: '^[a-zA-Z]+$',
    },
  },
  {
    controlName: 'vertical',
    valueType: 'select',
    label: 'Vertical',
    isDependent: true,
    dependsOnControl: 'isInsurerUser',
    fieldVisibleIfDependentValueIn: [false],
    hasFilter: false,
    isLoadedFromMaster: true,

    masterValue: 'getMasters/vertical',
    placeholder: '..',
    initiallyDisabled: false,
    initiallyDisabledForAdd: true,
    controlType: 'select',
    options: [],
    validators: {},
  },
  {
    controlName: 'email',
    valueType: 'email',
    label: 'Email',
    placeholder: 'john.doe@example.com',
    isDependent: false,
    initiallyDisabled: false,
    controlType: 'text',
    validators: {
      required: true,
      email: true,
      // pattern: '^\S+@\S+\.\S+$'
      // pattern: "^([a-z0-9_-]+)(@[a-z0-9-]+)(\.[a-z]+|\.[a-z]+\.[a-z]+)?$"
      // pattern: "^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$"
    },
  },
  {
    controlName: 'mobileNo',
    valueType: 'mobileNo',
    label: 'Mobile Number',
    placeholder: '8768777231',
    isDependent: false,
    initiallyDisabled: false,
    controlType: 'text',
    validators: {
      required: true,
      pattern: '^[6-9][0-9]{9}$',
    },
  },
  {
    controlName: 'sp',
    valueType: 'sp',
    dependsOnControl: 'isInsurerUser',
    isDependent: true,
    fieldVisibleIfDependentValueIn: [false],
    label: 'Is SP',
    placeholder: 'ABCDE1234F',
    initiallyDisabled: false,
    controlType: 'checkbox',
    validators: {},
  },
  {
    controlName: 'insurerId',
    valueType: 'insurerId',
    isDependent: true,
    dependsOnControl: 'isInsurerUser',
    fieldVisibleIfDependentValueIn: [true],
    label: 'Insurer Name',
    isLoadedFromMaster: true,
    masterValue: 'getAllInsurer',
    placeholder: '111',
    initiallyDisabled: true,
    controlType: 'select',
    validators: {
      required: true,
    },
  },
  {
    controlName: 'licenseType',
    valueType: 'licenseType',
    label: 'License Type',
    isDependent: true,
    dependsOnControl: 'sp',
    fieldVisibleIfDependentValueIn: [true],
    placeholder: '',
    isLoadedFromMaster: false,
    initiallyDisabled: false,
    controlType: 'select',
    options: [
      { id: 'GI', value: 'General' },
      { id: 'Composite', value: 'Composite' },
      { id: 'Life', value: 'Life' },
    ],
    validators: {
      required: true,
    },
  },
  {
    controlName: 'licenseCode',
    valueType: 'licenseCode',
    label: 'License Code',
    isDependent: true,
    dependsOnControl: 'sp',
    fieldVisibleIfDependentValueIn: [true],
    // placeholder: "ABCDE1234F",
    initiallyDisabled: false,
    controlType: 'text',
    prefix: true,
    prefixValue: 'SP',
    validators: {
      required: true,
      pattern: '^[0-9]{10}$',
    },
  },
  {
    controlName: 'licenseStartDate',
    valueType: 'licenseStartDate',
    label: 'License Start Date',
    isDependent: true,
    dependsOnControl: 'sp',
    minDate: '',
    maxDate: '',
    fieldVisibleIfDependentValueIn: [true],
    placeholder: '',
    initiallyDisabled: false,
    controlType: 'date',
    validators: {
      required: true,
    },
  },
  {
    controlName: 'licenseExpiryDate',
    valueType: 'licenseExpiryDate',
    label: 'License Expiry Date',
    isDependent: true,
    dependsOnControl: 'sp',
    minDate: '',
    maxDate: '',
    fieldVisibleIfDependentValueIn: [true],
    placeholder: '',
    conditionallyDisabled: true,
    controlDependentName: 'licenseStartDate',
    initiallyDisabled: true,
    controlType: 'date',
    validators: {
      required: true,
    },
  },
  {
    controlName: 'mappedBranchCode',
    valueType: 'mappedBranchCode',
    label: 'Mapped Branch Code',
    isLoadedFromMaster: true,
    masterValue: 'getAllBranches',
    options: [],
    isDependent: true,
    dependsOnControl: 'isInsurerUser',
    fieldVisibleIfDependentValueIn: [true],
    placeholder: '',
    initiallyDisabled: false,
    controlType: 'multiselect',
    validators: {
      required: false,
    },
  },
  {
    controlName: 'userGroups',
    valueType: 'userGroups',
    label: 'User Roles',
    isDependent: false,
    hasFilter: true,
    isLoadedFromMaster: true,
    filterConditions: [{ dependentControlName: 'isInsurerUser', filterOptions: [''] }],
    masterValue: 'getAllAuthGroups',
    placeholder: 'ABCDE1234F',
    initiallyDisabled: false,
    initiallyDisabledForAdd: true,
    controlType: 'multiselect',
    options: [],
    validators: {
      required: false,
    },
  },
  {
    controlName: 'sendEmailOnCreate',
    valueType: 'sendEmailOnCreate',
    isDependent: false,
    isDependentOnTag: true,
    dependentTag: 'isAddView',
    isLoadedFromMaster: false,
    label: 'Send Notification on Create',
    initiallyDisabled: true,
    controlType: 'checkbox',
    validators: {
      required: false,
    },
  },
];

export const masterFormData = {
  screens: [
    {
      name: 'productId',
      label: 'Product Name',
      isLoadedFromMaster: true,
      masterValue: 'Product',
      placeholder: '',
      value: '',
      class: 'col-md-4',
      type: 'select',
      options: [],
      validators: [
        {
          validatorName: 'required',
          required: true,
          message: 'Product Name is Required',
        },
        {
          validatorName: 'maxLength',
          maxLength: 10,
          message: 'Email is not Valid',
        },
      ],
    },
    {
      name: 'lob',
      label: 'LOB',
      isLoadedFromMaster: true,
      masterValue: 'LOB',
      placeholder: '',
      value: '',
      class: 'col-md-4',
      type: 'select',
      options: [],
      validators: [
        {
          validatorName: 'required',
          required: true,
          message: 'LOB is Required',
        },
        {
          validatorName: 'maxLength',
          maxLength: 10,
          message: 'Email is not Valid',
        },
      ],
    },
    {
      name: 'isCoverAvailable',
      label: 'Is Cover Available',
      isLoadedFromMaster: false,
      hasDependents: true,
      masterValue: 'IsCover',
      placeholder: '',
      value: '',
      class: 'col-md-4',
      type: 'radio',
      options: [
        {
          id: 'Y',
          value: 'Yes',
        },
        {
          id: 'N',
          value: 'No',
        },
      ],
      validators: [
        {
          validatorName: 'required',
          required: true,
          message: 'Cover is Required',
        },
        {
          validatorName: 'maxLength',
          maxLength: 10,
          message: 'Email is not Valid',
        },
      ],
    },
    {
      name: 'coverIdName',
      label: 'Cover Name',
      isLoadedFromMaster: true,
      isDependent: true,
      dependentControl: 'isCoverAvailable',
      isVisibleIf: ['Y'],
      masterValue: 'Covers',
      placeholder: '',
      value: '',
      class: 'col-md-4',
      type: 'select',
      options: [
        {
          id: 'AB',
          value: 'Accident Benefit Rider',
        },
        {
          id: 'ACCHOSP',
          value: 'Accident Hospitalization',
        },
        {
          id: 'ACCOEMG',
          value: 'Emergency Accommodation',
        },
        {
          id: 'ADB',
          value: 'Accidental Death Benefit',
        },
        {
          id: 'ADBCC',
          value: 'Accidental Death Benefit - Common Carrier',
        },
      ],
      validators: [
        {
          validatorName: 'required',
          required: true,
          message: 'Cover Id is Required',
        },
        {
          validatorName: 'maxLength',
          maxLength: 10,
          message: 'Email is not Valid',
        },
      ],
    },
    {
      name: 'coverName',
      label: 'Cover Name',
      isLoadedFromMaster: false,
      isDependent: true,
      dependentControl: 'isCoverAvailable',
      isVisibleIf: ['N'],
      masterValue: '',
      placeholder: '',
      value: '',
      class: 'col-md-4',
      type: 'text',
      options: [],
      validators: [
        {
          validatorName: 'required',
          required: true,
          message: 'Cover Id is Required',
        },
        {
          validatorName: 'maxLength',
          maxLength: 10,
          message: 'cover is not Valid',
        },
      ],
    },
    {
      name: 'coverId',
      label: 'Cover Id',
      isLoadedFromMaster: false,
      isDependent: true,
      dependentControl: 'isCoverAvailable',
      isVisibleIf: ['N'],
      masterValue: '',
      placeholder: '',
      value: '',
      class: 'col-md-4',
      type: 'text',
      options: [],
      validators: [
        {
          validatorName: 'required',
          required: true,
          message: 'Cover Id is Required',
        },
        {
          validatorName: 'pattern',
          pattern: '^[A-Z]*$',
          message: 'coverid is not Valid',
        },
      ],
    },
    {
      name: 'helpText',
      label: 'Help Text',
      isLoadedFromMaster: false,
      masterValue: 'helpText',
      value: '',
      placeholder: '',
      class: 'col-md-6',
      type: 'text',
      validators: [
        {
          validatorName: 'required',
          required: true,
          message: 'Help Text is Required',
        },
      ],
    },
    {
      name: 'coverType',
      label: 'Cover Type',
      isLoadedFromMaster: true,
      masterValue: 'CoverDetails',
      placeholder: '',
      value: '',
      class: 'col-md-4',
      type: 'select',
      options: [
        {
          id: 1,
          value: 'monthly',
        },
        {
          id: 2,
          value: 'quaterly',
        },
        {
          id: 3,
          value: 'yearly',
        },
      ],
      validators: [
        {
          validatorName: 'required',
          required: true,
          message: 'Cover Type is Required',
        },
        {
          validatorName: 'maxLength',
          maxLength: 10,
          message: 'Email is not Valid',
        },
      ],
    },
    {
      name: 'insuredObject',
      label: 'Insured Object',
      isLoadedFromMaster: true,
      masterValue: 'InsuredObject',
      placeholder: '',
      value: '',
      class: 'col-md-4',
      type: 'select',
      options: [
        {
          id: 1,
          value: 'monthly',
        },
        {
          id: 2,
          value: 'quaterly',
        },
        {
          id: 3,
          value: 'yearly',
        },
      ],
      validators: [
        {
          validatorName: 'required',
          required: true,
          message: 'Insured Object is Required',
        },
        {
          validatorName: 'maxLength',
          maxLength: 10,
          message: 'Email is not Valid',
        },
      ],
    },
    {
      name: 'benefitDesc',
      label: 'Benifit Description',
      isLoadedFromMaster: false,
      masterValue: 'benifits',
      value: '',
      placeholder: '',
      class: 'col-md-6',
      type: 'text',
      validators: [
        {
          validatorName: 'required',
          required: true,
          message: 'Benifits is Required',
        },
      ],
    },
    {
      name: 'separateSi',
      label: 'Seperate SI',
      isLoadedFromMaster: false,
      masterValue: 'seperateSi',
      placeholder: '',
      value: '',
      class: 'col-md-4',
      type: 'radio',
      options: [
        {
          id: 'Y',
          value: 'Yes',
        },
        {
          id: 'N',
          value: 'No',
        },
      ],
      validators: [
        {
          validatorName: 'required',
          required: true,
          message: 'Cover is Required',
        },
        {
          validatorName: 'maxLength',
          maxLength: 10,
          message: 'Email is not Valid',
        },
      ],
    },
  ],
};
