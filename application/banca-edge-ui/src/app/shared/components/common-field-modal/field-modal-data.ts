export const usgiKyc = [
    {label:'ID Type',controlName:'idType',controlType:'select',validators:{required:true},master:'ManualKycIdType',defaultValue:'CKYC_NO',
    setOtherVal:true,
    setValFrom:{obj:'customerData', tag:'ckycNumber',controlName:'idNumber'},
    options:[
        {
          id: "DRIVING_LICENCE",
          value: "Driving License",
          code: null,
          fuelType: null
        },
        {
          id: "CKYC_NO",
          value: "Existing CKYC Number",
          code: null,
          fuelType: null
        },
        {
          id: "PAN",
          value: "PAN Card",
          code: null,
          fuelType: null,
          getDetail:true,
          setValFrom:{obj:'customerData', tag:'panNo',controlName:'idNumber'},
        },
        {
          id: "PASSPORT",
          value: "Passport",
          code: null,
          fuelType: null
        },
        {
          id: "UNIQUE_IDENTIFICATION",
          value: "Unique Identification Number",
          code: null,
          fuelType: null
        },
        {
          id: "VOTER_ID",
          value: "Voter ID",
          code: null,
          fuelType: null
        }
      ]},
    {label:'ID Number',controlName:'idNumber',controlType:'text',validators:{required:true},master:'',dynamicValidation:true,validatorArray:[{}]},
    
]