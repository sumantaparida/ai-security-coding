export interface QuoteFormData {
    controlName?: string;
    controlQuestion: string;
    // controlQuestionArr?: Array<{
    //     description: string;
    //     cover: string;
    //     coverCode: string;
    // }>;
    isDependant?: boolean,
    controlType: string;
    key?: string
    valueType?: string;
    currentValue?: string;
    placeholder?: string;
    dependsOnConrtol?: any;
    ofvalueType?: string;
    dependsOnValue?: Array<string>;
    options?: Array<{
        viewValue: string;
        value;
    }>;
    // extra?: {
    //     sa: {
    //         controlName: string;
    //         isDependant: boolean;
    //         dependsOnConrtol: string;
    //         dependsOnValue: string;
    //     }
    // };
    validators?: {
        required?: boolean;
        minlength?: number;
        maxlength?: number;
        maxValue?: number;
    };
}