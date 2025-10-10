import { QuoteFormData } from './quoteform.data';

const contentQuestionArr = [
    { description: 'Covers loss to the building structure', coverCode: 'BLDG', cover: 'Building' },
    { description: 'Covers Contents in the property', coverCode: 'CONT', cover: 'Contents' },
    { description: 'Covers breakdown of Machinery', coverCode: 'MDB', cover: 'Machinery and Appliances' },
    {
        description: 'All Risk cover for Electrical and Electronic equipment', coverCode: 'ELEQ',
        cover: 'Electrical and Electronic Equipment'
    },
    { description: 'Third Party Liability', coverCode: 'TP', cover: 'Third Party Liability' }
    // { description: 'Cover loss of cash in safe', coverCode: 'CASHS', cover: 'Cash in Safe' },
    // { description: 'Covers loss of cash in transit', coverCode: 'CASHT', cover: 'Cash in Transit' },
    // { description: 'Covers loss of Glass plate', coverCode: 'GPLATE', cover: 'Glass Plate' },
    // { description: 'Covers loss of baggage during transit', coverCode: 'BAGG', cover: 'Baggage' },
    // { description: 'Neon Sign', coverCode: 'NEON', cover: 'Neon Sign' },
    // { description: 'Worker’s compensation for employees', coverCode: 'WC', cover: 'Worker’s Compensation' },
    // { description: 'Personal accident for employees', coverCode: 'PA', cover: 'Personal accident' },
    // { description: 'Covers loss of business due to interruptions like pandemic', coverCode: 'BI', cover: 'Business Interruption' },
];
const contentArr = ['3', '1'];
const buildingArr = ['2', '1'];
const buildinggAgeView = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17']
const buildinggAgeValue = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
// console.log('rpinting alue', contentQuestionArr.map(arr => arr.cover));
export const FireForm: QuoteFormData[] = [
    // {
    //     controlName: 'occupancies',
    //     placeholder: 'Select property',
    //     controlQuestion: 'Please select the type of Property you want to insure',
    //     controlType: 'radio',
    //     options: [{
    //         viewValue: 'Home',
    //         value: 'Home'
    //     }, {
    //         viewValue: 'Shop',
    //         value: 'Shop'
    //     }, {
    //         viewValue: 'Office',
    //         value: '3'
    //     }, {
    //         viewValue: 'Engineering workshop',
    //         value: '4'
    //     }, {
    //         viewValue: 'Workshop with warehouse',
    //         value: '5'
    //     }, {
    //         viewValue: 'Warehouse only',
    //         value: '6'
    //     }, {
    //         viewValue: 'Building under construction',
    //         value: '7'
    //     }, {
    //         viewValue: 'Textile Manufacturing',
    //         value: '8'
    //     }, {
    //         viewValue: 'Chemical manufacturing',
    //         value: '9'
    //     }, {
    //         viewValue: 'Others',
    //         value: '10'
    //     }
    //     ],
    //     validators: {
    //         required: true
    //     }
    // },
    {
        controlName: 'pincode',
        controlQuestion: 'Pincode',
        placeholder: 'Enter Pincode',
        valueType: 'tel',
        controlType: 'text',
        validators: {
            required: true,
            minlength: 6,
            maxlength: 6
        }
    },
    {
        controlName: 'insuranceType',
        controlQuestion: 'What do you need to insure',
        controlType: 'radio',
        options: [{
            viewValue: 'Home Building',
            value: '2'
        }, {
            viewValue: 'Home Contents',
            value: '3'
        }, {
            viewValue: 'Both Home Building and Content',
            value: '1'
        }],
        validators: {
            required: true
        }
    },
    {
        isDependant: true,
        controlName: 'area',
        dependsOnConrtol: 'insuranceType',
        dependsOnValue: buildingArr,
        controlQuestion: 'Total Sqft Area',
        key: 'bldg',
        placeholder: 'Sqft',
        valueType: 'tel',
        controlType: 'text',
        validators: {
            required: true,
            minlength: 2,
            maxlength: 3
        }
    },
    {
        isDependant: true,
        controlName: 'costofConstruction',
        dependsOnConrtol: 'insuranceType',
        dependsOnValue: buildingArr,
        controlQuestion: 'Cost of construction per Sqft',
        key: 'bldg',
        placeholder: 'Sqft',
        valueType: 'tel',
        controlType: 'text',
        validators: {
            required: true,
            // minlength: 6,
            // maxlength: 6
        }
    },
    {
        isDependant: true,
        controlName: 'sa',
        dependsOnConrtol: 'insuranceType',
        dependsOnValue: buildingArr,
        controlQuestion: 'Total cost of construction',
        key: 'bldg',
        placeholder: ' ',
        valueType: 'tel',
        controlType: 'text',
        validators: {
            required: true,
            maxValue: 50000000,
            // minlength: 6,
            // maxlength: 6
        }
    },

    {
        isDependant: true,
        controlName: 'age',
        dependsOnConrtol: 'insuranceType',
        dependsOnValue: buildingArr,
        controlQuestion: 'Age of Building(in Years)',
        key: 'bldg',
        placeholder: 'Select the years',
        valueType: 'tel',
        controlType: 'select',
        options: [
            {
                viewValue: '1',
                value: 1
            },
            {
                viewValue: '2',
                value: 2
            },
            {
                viewValue: '3',
                value: 3
            },
            {
                viewValue: '4',
                value: 4
            },
            {
                viewValue: '5',
                value: 5
            },
            {
                viewValue: '6',
                value: 6
            },
            {
                viewValue: '7',
                value: 7
            },
            {
                viewValue: '8',
                value: 8
            },
            {
                viewValue: '9',
                value: 9
            },
            {
                viewValue: '10',
                value: 10
            },
            {
                viewValue: '11',
                value: 11
            },
            {
                viewValue: '12',
                value: 12
            },
            {
                viewValue: '13',
                value: 13
            },
            {
                viewValue: '14',
                value: 14
            },
            {
                viewValue: '15',
                value: 15
            },
            {
                viewValue: '16',
                value: 16
            },
            {
                viewValue: '17',
                value: 17
            },
            {
                viewValue: '18',
                value: 18
            },
            {
                viewValue: '19',
                value: 19
            },
            {
                viewValue: '20',
                value: 20
            },

            {
                viewValue: '21',
                value: 21
            },
            {
                viewValue: '22',
                value: 22
            },
            {
                viewValue: '23',
                value: 23
            },
            {
                viewValue: '24',
                value: 24
            },
            {
                viewValue: '25',
                value: 25
            },
            {
                viewValue: '26',
                value: 26
            },
            {
                viewValue: '27',
                value: 27
            },
            {
                viewValue: '8',
                value: 28
            },
            {
                viewValue: '29',
                value: 29
            },
            {
                viewValue: '30',
                value: 30
            },
        ],
        validators: {
            required: true,
            // minlength: 6,
            // maxlength: 6
        }
    },

    {
        // isDependant: true,
        controlName: 'pt',
        controlQuestion: 'Years you need Insurance for',
        placeholder: 'years',
        valueType: 'tel',
        controlType: 'select',
        options: [
            {
                viewValue: '1',
                value: 1
            },
            {
                viewValue: '2',
                value: 2
            },
            {
                viewValue: '3',
                value: 3
            },
            {
                viewValue: '4',
                value: 4
            },
            {
                viewValue: '5',
                value: 5
            },
            {
                viewValue: '6',
                value: 6
            },
            {
                viewValue: '7',
                value: 7
            },
            {
                viewValue: '8',
                value: 8
            },
            {
                viewValue: '9',
                value: 9
            },
            {
                viewValue: '10',
                value: 10
            },
        ],
        validators: {
            required: true,
            minlength: 1,
            maxlength: 2
        }
    },
    // {
    //     isDependant: true,
    //     // controlNameArr: contentQuestionArr.map(arr => arr.cover),
    //     controlName: 'BLDG',
    //     dependsOnValue: contentArr,
    //     dependsOnConrtol: 'toInsure',
    //     controlQuestion: 'Covers loss to the building structure',
    //     // controlQuestionArr: contentQuestionArr,
    //     placeholder: '',
    //     controlType: 'radio',
    //     options: [
    //         {
    //             viewValue: 'Yes',
    //             value: 'yes'
    //         },
    //         {
    //             viewValue: 'No',
    //             value: 'no'
    //         }
    //     ],
    //     // extra: {
    //     //     sa: {
    //     //         controlName: 'buildingSa',
    //     //         isDependant: true,
    //     //         dependsOnConrtol: 'building',
    //     //         dependsOnValue: 'yes'
    //     //     }
    //     // },
    //     validators: {
    //         required: true
    //     }
    // },
    {
        isDependant: true,
        controlName: 'saBLDG',
        dependsOnValue: ['yes'],
        controlQuestion: '',
        dependsOnConrtol: 'BLDG',
        placeholder: 'Enter the amount',
        key: 'bldg',
        valueType: 'tel',
        controlType: 'text',
        validators: {
            required: true,
            minlength: 6,
            maxlength: 6
        }
    },
    {
        isDependant: true,
        controlName: 'CONT',
        dependsOnValue: contentArr,
        dependsOnConrtol: 'insuranceType',
        key: 'covers',
        ofvalueType: 'CONT',
        controlQuestion: 'Do you want to cover Furniture and Fixtures',
        placeholder: '',
        controlType: 'radio',
        options: [
            {
                viewValue: 'Yes',
                value: 'yes'
            },
            {
                viewValue: 'No',
                value: 'no'
            }
        ],
        validators: {
            required: true, 
        }
    },
    {
        isDependant: true,
        controlName: 'saCONT',
        ofvalueType: 'CONT',
        dependsOnValue: ['yes'],
        controlQuestion: 'Furniture and Fixtures',
        dependsOnConrtol: 'CONT',
        key: 'covers',
        placeholder: 'Enter the amount',
        valueType: 'tel',
        controlType: 'text',
        validators: {
            maxValue: 50000000,
            required: true,
            // minlength: 6,
            // maxlength: 6
        }
    }, {
        isDependant: true,
        controlName: 'JEWEL',
        ofvalueType: 'JEWEL',
        dependsOnConrtol: 'insuranceType',
        dependsOnValue: contentArr,
        key: 'covers',
        controlQuestion: 'Do you want to insure your Valuables and Jewelery',
        placeholder: '',
        controlType: 'radio',
        options: [
            {
                viewValue: 'Yes',
                value: 'yes'
            },
            {
                viewValue: 'No',
                value: 'no'
            }
        ],
        validators: {
            required: true
        }
    },
    {
        isDependant: true,
        controlName: 'saJEWEL',
        ofvalueType: 'JEWEL',
        dependsOnValue: ['yes'],
        key: 'covers',
        controlQuestion: 'JEWEL',
        dependsOnConrtol: 'JEWEL',
        placeholder: 'Enter the amount',
        valueType: 'tel',
        controlType: 'text',
        validators: {
            required: true,
            // minlength: 6,
            // maxlength: 6,
            maxValue:500000,
        }
    },
    // {
    //     isDependant: true,
    //     controlName: 'MDB',
    //     dependsOnConrtol: 'toInsure',
    //     dependsOnValue: contentArr,

    //     controlQuestion: 'Covers breakdown of Machinery',
    //     placeholder: '',
    //     controlType: 'radio',
    //     options: [
    //         {
    //             viewValue: 'Yes',
    //             value: 'yes'
    //         },
    //         {
    //             viewValue: 'No',
    //             value: 'no'
    //         }
    //     ],
    //     validators: {
    //         required: true
    //     }
    // },
    // {
    //     isDependant: true,
    //     controlName: 'saMDB',
    //     dependsOnValue: ['yes'],
    //     controlQuestion: '',
    //     dependsOnConrtol: 'MDB',
    //     placeholder: 'Enter the amount',
    //     valueType: 'tel',
    //     controlType: 'text',
    //     validators: {
    //         required: true,
    //         minlength: 6,
    //         maxlength: 6
    //     }
    // },
    // {
    //     isDependant: true,
    //     controlName: 'ELEQ',
    //     dependsOnConrtol: 'toInsure',
    //     dependsOnValue: contentArr,

    //     controlQuestion: 'Do you want to include Electronic equipment',
    //     placeholder: '',
    //     controlType: 'radio',
    //     options: [
    //         {
    //             viewValue: 'Yes',
    //             value: 'yes'
    //         },
    //         {
    //             viewValue: 'No',
    //             value: 'no'
    //         }
    //     ],
    //     validators: {
    //         required: true
    //     }
    // },
    // {
    //     isDependant: true,
    //     controlName: 'saELEQ',
    //     dependsOnValue: ['yes'],
    //     controlQuestion: '',
    //     dependsOnConrtol: 'ELEQ',
    //     placeholder: 'Enter the amount',
    //     valueType: 'tel',
    //     controlType: 'text',
    //     validators: {
    //         required: true,
    //         minlength: 6,
    //         maxlength: 6
    //     }
    // },
    // {
    //     isDependant: true,
    //     controlName: 'Other',
    //     dependsOnConrtol: 'toInsure',
    //     dependsOnValue: contentArr,

    //     controlQuestion: 'Other equipment amount',
    //     placeholder: '',
    //     controlType: 'radio',
    //     options: [
    //         {
    //             viewValue: 'Yes',
    //             value: 'yes'
    //         },
    //         {
    //             viewValue: 'No',
    //             value: 'no'
    //         }
    //     ],
    //     validators: {
    //         required: true
    //     }
    // },
    // {
    //     isDependant: true,
    //     controlName: 'saOther',
    //     dependsOnValue: ['yes'],
    //     controlQuestion: '',
    //     dependsOnConrtol: 'Other',
    //     placeholder: 'Enter the amount',
    //     valueType: 'tel',
    //     controlType: 'text',
    //     validators: {
    //         required: true,
    //         minlength: 6,
    //         maxlength: 6
    //     }
    // },
    // {
    //     isDependant: true,
    //     controlName: 'otherEquip',
    //     dependsOnConrtol: 'toInsure',
    //     dependsOnValue: contentArr,

    //     controlQuestion: 'Other equipment amount',
    //     placeholder: 'Enter the amount',
    //     valueType: 'tel',
    //     controlType: 'text',
    //     validators: {
    //         required: true
    //     }
    // },
    // {
    //     isDependant: true,
    //     controlName: 'TP',
    //     dependsOnConrtol: 'toInsure',
    //     dependsOnValue: contentArr,

    //     controlQuestion: 'Third Party Liability',
    //     placeholder: '',
    //     controlType: 'radio',
    //     options: [
    //         {
    //             viewValue: 'Yes',
    //             value: 'yes'
    //         },
    //         {
    //             viewValue: 'No',
    //             value: 'no'
    //         }
    //     ],
    //     validators: {
    //         required: true
    //     }
    // },
    {
        isDependant: true,
        controlName: 'saTP',
        dependsOnValue: ['yes'],
        controlQuestion: '',
        dependsOnConrtol: 'TP',
        placeholder: 'Enter the amount',
        valueType: 'tel',
        controlType: 'text',
        validators: {
            required: true,
            minlength: 6,
            maxlength: 6
        }
    },
    // {
    //     isDependant: true,
    //     controlName: 'moreContent',
    //     dependsOnConrtol: 'toInsure',
    //     dependsOnValue: contentArr,

    //     controlQuestion: 'More Content',
    //     placeholder: 'Select',
    //     controlType: 'select',
    //     options: [
    //         {
    //             viewValue: 'Cover loss of cash in safe',
    //             value: 'CASHS'
    //         },
    //         {
    //             viewValue: 'Covers loss of cash in transit',
    //             value: 'CASHT'
    //         },
    //         {
    //             viewValue: 'Covers loss of Glass plate',
    //             value: 'GPLATE'
    //         },
    //         {
    //             viewValue: 'Covers loss of baggage during transit',
    //             value: 'BAGG'
    //         },
    //         {
    //             viewValue: 'Neon Sign',
    //             value: 'NEON'
    //         },
    //         {
    //             viewValue: 'Worker’s compensation for employees',
    //             value: 'WC'
    //         },
    //         {
    //             viewValue: 'Personal accident for employees',
    //             value: 'PA'
    //         },
    //         {
    //             viewValue: 'Covers loss of business due to interruptions like pandemic',
    //             value: 'BI'
    //         },
    //     ],
    //     validators: {
    //         required: true
    //     }
    // }

];

export const HealthForm: QuoteFormData[] = [
    {
        controlName: 'policyType',
        controlQuestion: 'What type of Policy do you wish to buy?',
        controlType: 'radio',
        options: [{
            viewValue: 'Individual',
            value: '1'
        }, {
            viewValue: 'Family Floater',
            value: '2'
        }],
        validators: {
            required: true
        }
    },
    {
        controlName: 'pincode',
        controlQuestion: 'Enter the Pin Code of location of Primary Residence',
        placeholder: '',
        valueType: 'tel',
        controlType: 'text',
        validators: {
            required: true,
            minlength: 6,
            maxlength: 6
        }
    },
    {
        controlName: 'gender',
        controlQuestion: 'What is the Gender of this person?',
        controlType: 'radio',
        options: [{
            viewValue: 'Male',
            value: 'M'
        }, {
            viewValue: 'Female',
            value: 'F'
        }],
        validators: {
            required: true
        }
    },
    {
        controlName: 'smoker',
        controlQuestion: 'Is this person a Smoker?',
        controlType: 'radio',
        options: [{
            viewValue: 'Yes',
            value: 'S'
        }, {
            viewValue: 'No',
            value: 'NS'
        }],
        validators: {
            required: true
        }
    },
    {
        controlName: 'tenure',
        dependsOnConrtol: 'toInsure',
        controlQuestion: 'How many year(s) would you like your cover for?',
        placeholder: 'Select',
        controlType: 'select',
        options: [
            {
                viewValue: '1',
                value: '1'
            },
            {
                viewValue: '2',
                value: '2'
            },
            {
                viewValue: '3',
                value: '3'
            },
        ],
        validators: {
            required: true
        }
    }
];
