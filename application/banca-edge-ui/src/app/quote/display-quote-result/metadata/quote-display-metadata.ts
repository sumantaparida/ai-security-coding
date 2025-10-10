export const metaData= {
    quoteUpdateUrl:'/api/v1/quote/submitMotorQuote',
    policyOptions:[
        {
        heading:'Policy Type',
        type:'Radio',
        groupName:'coverType',
        controlName:'coverType',
        options:[{id:'comprehensive',value:'Comprehensive'},{id:'ownDamage',value:'Own Damage'},{id:'liability',value:'Liability'}],
        mastercall:'/api/v1/master/getMasters/Covertype',
        masterCallhasParam:[{}],
        validators:{},
        hasDefaultVlaue:true,
        getDefaultValFrom:'quoteInput',
        isVisible:true,
        },
        {
        heading:'Cover Amount',
        type:'Radio',
        groupName:'coverAmount',
        controlName:'coverAmount',
        options:[{id:'minimumIDV',value:'Minimum IDV'},{id:'maximumIDV',value:'Maximum IDV'},{id:'chooseMyOwn',value:'Choose My Own'}],
        validators:{},
        hasDefaultVlaue:true,
        defaltValue:'minimumIDV',
        isVisible:true,
        },
        {
        heading:'',
        type:'input',
        isDependent:true,
        dependentControlName:'coverAmount',
        fieldVisibleIfVal:['chooseMyOwn'],
        isVisible:false,
        inputForms:[{
            label:'IDV',
            controlName:'idv',
            getMin:['quoteResult','minSumAssured',['']],
            getMax:['quoteResult','maxSumAssured',['']],
            iconType:'rupee',
            validators:{ pattern:'^[0-9]*$',min:0,max:0}
        }],
        },
        {
            heading:'Value of your accessories',
            type:'input',
            isDependent:false,
            dependentControlName:'',
            isVisible:true,
            fieldVisibleIfVal:[],
            inputForms:[{
                label:'Electrical Accessories',
                controlName:'electricalValue',
                iconType:'rupee',
                validators:{ pattern:'^[0-9]*$'}
            },{
                label:'Non Electrical Accessories',
                controlName:'nonElecValue',
                iconType:'rupee',
                validators:{ pattern:'^[0-9]*$'}
            }],
        },
        {
            heading:'Add Ons',
            type:'option-select',
            isDependent:false,
            dependentControlName:'',
            isVisible:true,
            fieldVisibleIfVal:[],
            validators:{},
            mastercall:"/api/v1/master/getMotorMaster/TW/Addon",
            options:[],
            // addOnOptions: [{
            //     label:'PA Owner Driver',
            //     highlighted:false,
            //   },
            //   {
            //     label:'Select PA Passenger Cover',
            //     highlighted:false,
            //     select:true,
            //     optionClick:false,
            //     options:[{id:'0',value:'none'},{id:'10000',value:'10000'}],
            //     value:'Select PA Passenger Cover'
            //   }],
            addOnOptions:[],
        },
        {
            heading:'Dicounts',
            type:'option-select',
            isDependent:false,
            dependentControlName:'',
            isVisible:true,
            fieldVisibleIfVal:[],
            validators:{},
            mastercall:"/api/v1/master/getMotorMaster/TW/Discounts",
            options:[],
            addOnOptions:[],
        },

],
policyListing:{
    policyHeading:'Vehicle Details',
    policyOverViewSample:['vehRegNo','makeAndModel','variantName'],
    policyOverViewList:[
        {
            detailColumns:[
                {
                    detailHeading:'Vehicle Registration',
                    detailValue:'vehRegNo',
                },
                {
                    detailHeading:'RTO',
                    detailValue:'rtoCode',
                },
                {
                    detailHeading:'Registration Date',
                    detailValue:'dateOfRegistration',
                },
            ]
        },
        {
            detailColumns:[
                {
                    detailHeading:'Make & model',
                    detailValue:'makeAndModel',
                },
                {
                    detailHeading:'Manufacturing Year',
                    detailValue:'yom',
                },
                {
                    detailHeading:'Fuel Type',
                    detailValue:'fuelType',
                },
                {
                    detailHeading:'Variant',
                    detailValue:'variantName',
                },
            ]
        },
        {
            detailColumns:[
                {
                    detailHeading:'Policy expiry date',
                    detailValue:'prevPolicyEndDate',
                },
                {
                    detailHeading:'Previous Policy Type',
                    detailValue:'prevPolicyType',
                },
                {
                    detailHeading:'Insurance Provider',
                    detailValue:'prevInsurer',
                },
            ]
        },

    ]
},
createApplicationPayload:{
    customerId: 'customerId',
    lob: ['quoteInput','lob',['']],
    productType: ['quoteInput','productType',['']],
    productId: ['selectedProduct','productId',['']],
    planId: ['selectedProduct','planId',['']],
    productName: ['selectedProduct','productName',['']],
    insurerId: ['selectedProduct','insurerId',['']],
    insurerName: ['selectedProduct','insurerName',['']],
    pt: ['selectedProduct','pt',['']],
    ppt: ['selectedProduct','ppt',['']],
    selectedMode: ['selectedProduct','selectedMode',['']],
    sa:['selectedProduct','sa',['']],
    pb:{hasChildren:true,
        children:{
        totalPremium:['selectedProduct','totalPremium',['quoteResponse']],
        basePremium:['selectedProduct','packagePremium',['quoteResponse']],
        gst:['selectedProduct','tax',['quoteResponse']]
    }, 
    },
    supportedAddons:['selectedProduct','supportedAddons',['quoteResponse']],
    discounts:['selectedProduct','discounts',['quoteResponse']],
    // addons: this.addOnArr,
    quoteInput: 'quoteInput',
    quoteId: 'quoteId',
  },
createApplicationUrl:'/api/v1/policy/createApplication/',
error:{
    statement:'Following Insurers did not offer a quote for your search. Insurers may not offer a quote if your model or RTO is not supported',
    subStatement:'These insurers do not cover your vehicle or loacation',   
}
}