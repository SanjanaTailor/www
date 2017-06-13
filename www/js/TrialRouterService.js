var TrialRouterService = function(baseUrl, appName, appVersion, clientVersion, consumerKey, consumerSecret, errorHandler)
{
    this.baseURL = baseUrl;
    this.appName = appName;
    this.appVersion = appVersion;
    this.clientVersion = clientVersion;
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.airGateway = null;
    this.airRouter = null;
    this.device = null;
    this.errorHandler = errorHandler;
    routerServiceErrorHandler = errorHandler.handleRouterError;
    formatErrorHandler = errorHandler.handleResponseFormatError;
}
var deferredFunctionCall;
var routerServiceErrorHandler = null;
var formatErrorHandler = null;
// Dummy data for get
/*var dummyData = {
    "FeedParticipantResponse": {
        "result": "SUCCESS", "message": "", "approvals":[
            {"id":"FPMID999","header1":"Debtor - SPC002","header2":"Reference - PO78788","header3":"","header4":"Ann Bowen","category":"Debtor Invoices","details":[
                {"key":"Invoice prefix","value":"S - 12"},
                {"key":"Customer","value":"SPC002 - STEVENS LTD"},
                {"key":"Sub ledger","value":"S01"},
                {"key":"Transaction type","value":"I - Invoice"},
                {"key":"Period","value":"5"},
                {"key":"Year","value":"2012"},
                {"key":"Reference","value":"PO78788"},
                {"key":"Print status","value":"N - No Print"},
                {"key":"Header text","value":"Hire 31/10/14"},
                {"key":"Footer text","value":"Terms strictly 10 days from invoice date"},
                {"key":"Additional text","value":""}
            ],"lines":[
                {"header1":"Product code","header2":"MUS001 - MUSEUM HIRE - PUMP HOUSE","details":[
                    {"key":"Quantity","value":"1"},
                    {"key":"Unit of measure","value":"EA - EACH"},
                    {"key":"Price","value":"1000.00"},
                    {"key":"Per","value":"1"},
                    {"key":"Net value","value":"1000.00"},
                    {"key":"VAT code","value":"SR - 20"},
                    {"key":"Cost centre","value":"CC03 - ACCOUNTS RECEIVABLE"},
                    {"key":"Account","value":"40017 - FACILITY CHARGES INCOME"},
                    {"key":"Activity","value":""},
                    {"key":"Job","value":""},
                    {"key":"Line text","value":"PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR."}
                ]}
            ]},
            {"id":"FPMID1001","header1":"Debtor - SPC002","header2":"Reference - PO78789","header3":"","header4":"Ann Bowen","category":"Debtor Invoices","details":[
                {"key":"Invoice prefix","value":"S - 12"},
                {"key":"Customer","value":"SPC002 - STEVENS LTD"},
                {"key":"Sub ledger","value":"S01"},
                {"key":"Transaction type","value":"I - Invoice"},
                {"key":"Period","value":"5"},
                {"key":"Year","value":"2012"},
                {"key":"Reference","value":"PO78789"},
                {"key":"Print status","value":"N - No Print"},
                {"key":"Header text","value":"Hire 30/09/14"},
                {"key":"Footer text","value":"Terms strictly 10 days from invoice date"},
                {"key":"Additional text","value":""}
            ],"lines":[
                {"header1":"Product code","header2":"MUS001 - MUSEUM HIRE - PUMP HOUSE","details":[
                    {"key":"Quantity","value":"1"},
                    {"key":"Unit of measure","value":"EA - EACH"},
                    {"key":"Price","value":"1000.00"},
                    {"key":"Per","value":"1"},
                    {"key":"Net value","value":"1000.00"},
                    {"key":"VAT code","value":"SR - 20"},
                    {"key":"Cost centre","value":"CC03 - ACCOUNTS RECEIVABLE"},
                    {"key":"Account","value":"40017 - FACILITY CHARGES INCOME"},
                    {"key":"Activity","value":""},
                    {"key":"Job","value":""},
                    {"key":"Line text","value":"PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR."}
                ]}
            ]},
            {"id":"FPMID1002","header1":"Debtor - SPC002","header2":"Reference - PO78790","header3":"","header4":"Ann Bowen","category":"Debtor Invoices","details":[
                {"key":"Invoice prefix","value":"S - 12"},
                {"key":"Customer","value":"SPC002 - STEVENS LTD"},
                {"key":"Sub ledger","value":"S01"},
                {"key":"Transaction type","value":"I - Invoice"},
                {"key":"Period","value":"5"},
                {"key":"Year","value":"2012"},
                {"key":"Reference","value":"PO78790"},
                {"key":"Print status","value":"N - No Print"},
                {"key":"Header text","value":"Hire 10/11/14"},
                {"key":"Footer text","value":"Terms strictly 10 days from invoice date"},
                {"key":"Additional text","value":""}
            ],"lines":[
                {"header1":"Product code","header2":"MUS001 - MUSEUM HIRE - PUMP HOUSE","details":[
                    {"key":"Quantity","value":"1"},
                    {"key":"Unit of measure","value":"EA - EACH"},
                    {"key":"Price","value":"1000.00"},
                    {"key":"Per","value":"1"},
                    {"key":"Net value","value":"1000.00"},
                    {"key":"VAT code","value":"SR - 20"},
                    {"key":"Cost centre","value":"CC03 - ACCOUNTS RECEIVABLE"},
                    {"key":"Account","value":"40017 - FACILITY CHARGES INCOME"},
                    {"key":"Activity","value":""},
                    {"key":"Job","value":""},
                    {"key":"Line text","value":"PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR."}
                ]}
            ]},
            {"id":"FPMID205","header1":"Supplier - Acme Holding Company","header2":"S/L - P01","header3":"","header4":"Ann Bowen","category":"Supplier Requests","details":[
                {"key":"Type","value":"S - Statement"},
                {"key":"Code","value":"98765432"},
                {"key":"Name","value":"Acme Holding Company"},
                {"key":"Address line 1","value":"Caldicot"},
                {"key":"Address line 2","value":"Monmouthshire"},
                {"key":"Address line 3","value":""},
                {"key":"Address line 4","value":""},
                {"key":"Post code","value":"NP17 7TT"},
                {"key":"Payment method","value":"PQ - Cheque"},
                {"key":"Bank account","value":""},
                {"key":"Bank sort code","value":""},
                {"key":"Payment terms","value":"30 - 30 DAYS FROM INVOICE DATE"},
                {"key":"Phone no.","value":"01291 623491"},
                {"key":"Sub ledger","value":"P01"},
                {"key":"Contact name","value":"Janice Thomas"},
                {"key":"Credit controller id","value":"UA - Not allocated"},
                {"key":"Email address","value":"Acme@gmail.com"},
                {"key":"Payment method sub type","value":""}
            ],"lines":[]},
            {"id":"FPMID206","header1":"Supplier – Abalone Importers Ltd","header2":"S/L - P01","header3":"","header4":"Ann Bowen","category":"Supplier Requests","details":[
                {"key":"Type","value":"S - Statement"},
                {"key":"Code","value":"98765432"},
                {"key":"Name","value":"Abalone Importers Ltd"},
                {"key":"Address line 1","value":"Caldicot"},
                {"key":"Address line 2","value":"Monmouthshire"},
                {"key":"Address line 3","value":""},
                {"key":"Address line 4","value":""},
                {"key":"Post code","value":"NP17 7TT"},
                {"key":"Payment method","value":"PQ - Cheque"},
                {"key":"Bank account","value":""},
                {"key":"Bank sort code","value":""},
                {"key":"Payment terms","value":"30 - 30 DAYS FROM INVOICE DATE"},
                {"key":"Phone no.","value":"01291 6222345"},
                {"key":"Sub ledger","value":"P01"},
                {"key":"Contact name","value":"Janice Smith"},
                {"key":"Credit controller id","value":"UA - Not allocated"},
                {"key":"Email address","value":"Abalone@gmail.com"},
                {"key":"Payment method sub type","value":""}
            ],"lines":[]},
            {"id":"FPMID207","header1":"Supplier – Earslwood Marketing Ltd","header2":"S/L - P01","header3":"","header4":"Ann Bowen","category":"Supplier Requests","details":[
                {"key":"Type","value":"S - Statement"},
                {"key":"Code","value":"98765432"},
                {"key":"Name","value":"Earlswood Marketing Ltd"},
                {"key":"Address line 1","value":"Caldicot"},
                {"key":"Address line 2","value":"Monmouthshire"},
                {"key":"Address line 3","value":""},
                {"key":"Address line 4","value":""},
                {"key":"Post code","value":"NP17 7TT"},
                {"key":"Payment method","value":"PQ - Cheque"},
                {"key":"Bank account","value":""},
                {"key":"Bank sort code","value":""},
                {"key":"Payment terms","value":"30 - 30 DAYS FROM INVOICE DATE"},
                {"key":"Phone no.","value":"01291 723490"},
                {"key":"Sub ledger","value":"P01"},
                {"key":"Contact name","value":"Janice Williams"},
                {"key":"Credit controller id","value":"UA - Not allocated"},
                {"key":"Email address","value":"Earlswood@gmail.com"},
                {"key":"Payment method sub type","value":""}
            ],"lines":[]},
            {"id":"FPMID208","header1":"Debtor - STEVENS LTD","header2":"S/L - P01","header3":"","header4":"Ann Bowen","category":"Debtor Invoices","details":[
                {"key":"Invoice prefix","value":"S - 12"},
                {"key":"Customer","value":"SPC002 - STEVENS LTD"},
                {"key":"Sub ledger","value":"S01"},
                {"key":"Transaction type","value":"I - Invoice"},
                {"key":"Period","value":"5"},
                {"key":"Year","value":"2012"},
                {"key":"Reference","value":"PO78795"},
                {"key":"Print status","value":"N - No Print"},
                {"key":"Header text","value":"Hire 30/11/14"},
                {"key":"Footer text","value":"Terms strictly 10 days from invoice date"},
                {"key":"Additional text","value":""}
            ],"lines":[
                {"header1":"Product code","header2":"MUS001 - MUSEUM HIRE - PUMP HOUSE","details":[
                    {"key":"Quantity","value":"1"},
                    {"key":"Unit of measure","value":"EA - EACH"},
                    {"key":"Price","value":"1000.00"},
                    {"key":"Per","value":"1"},
                    {"key":"Net value","value":"1000.00"},
                    {"key":"VAT code","value":"SR - 20"},
                    {"key":"Cost centre","value":"CC03 - ACCOUNTS RECEIVABLE"},
                    {"key":"Account","value":"40017 - FACILITY CHARGES INCOME"},
                    {"key":"Activity","value":""},
                    {"key":"Job","value":""},
                    {"key":"Line text","value":"PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR."}
                ]}
            ]},
            {"id":"FPMID209","header1":"Record – Crosskeys Motors","header2":"S/L - P01","header3":"","header4":"Ann Bowen","category":"Record","details":[
                {"key":"Type","value":"S - Statement"},
                {"key":"Code","value":"98765432"},
                {"key":"Name","value":"Crosskeys Motors"},
                {"key":"Address line 1","value":"Caldicot"},
                {"key":"Address line 2","value":"Monmouthshire"},
                {"key":"Address line 3","value":""},
                {"key":"Address line 4","value":""},
                {"key":"Post code","value":"NP17 7TT"},
                {"key":"Payment method","value":"PQ - Cheque"},
                {"key":"Bank account","value":""},
                {"key":"Bank sort code","value":""},
                {"key":"Payment terms","value":"30 - 30 DAYS FROM INVOICE DATE"},
                {"key":"Phone no.","value":"01291 641209"},
                {"key":"Sub ledger","value":"P01"},
                {"key":"Contact name","value":"Janice Thomas"},
                {"key":"Credit controller id","value":"UA - Not allocated"},
                {"key":"Email address","value":"Crosskeys@gmail.com"},
                {"key":"Payment method sub type","value":""}
            ],"lines":[]},
            {"id":"FPMID210","header1":"Record – Bridgewater Supplies Ltd","header2":"S/L - P01","header3":"","header4":"Ann Bowen","category":"Record","details":[
                {"key":"Type","value":"S - Statement"},
                {"key":"Code","value":"98765432"},
                {"key":"Name","value":"Bridgewater Supplies Ltd"},
                {"key":"Address line 1","value":"143 River Street"},
                {"key":"Address line 2","value":"Bridgewater"},
                {"key":"Address line 3","Somerset":""},
                {"key":"Address line 4","value":""},
                {"key":"Post code","value":"BW17 7TT"},
                {"key":"Payment method","value":"PQ - Cheque"},
                {"key":"Bank account","value":""},
                {"key":"Bank sort code","value":""},
                {"key":"Payment terms","value":"30 - 30 DAYS FROM INVOICE DATE"},
                {"key":"Phone no.","value":"01291 641209"},
                {"key":"Sub ledger","value":"P01"},
                {"key":"Contact name","value":"Janice Thomas"},
                {"key":"Credit controller id","value":"UA - Not allocated"},
                {"key":"Email address","value":"Bridgewatersupplies@gmail.com"},
                {"key":"Payment method sub type","value":""}
            ],"lines":[]},
            {"id":"FPMID1095","header1":"Supplier – Ajax Office Supplies","header2":"Amount – £120.00","header3":"","header4":"Jane Smith","category":"Non-POP Invoices","details":[
                {"key":"Supplier Name","value":"Ajax Office Supplies"},
                {"key":"Supplier Code","value":"A2345"},
                {"key":"Sub ledger","value":"P01"},
                {"key":"Our Reference","value":"1098746"},
                {"key":"eFin Reference","value":"57840002"},
                {"key":"Their Reference","value":"INV237800"},
                {"key":"Net Amount","value":"100.00"},
                {"key":"VAT Amount","value":"20.00"},
                {"key":"Gross Amount","value":"120.00"},
                {"key":"Invoice Date","value":"16-Sept-2015"},
                {"key":"Due Date","value":"01-Oct-2015"}
            ],"lines":[
                {"header1":"Cost Centre","header2":"HO001 – Head Office","details":[
                    {"key":"Account","value":"E0234 - Stationery"},
                    {"key":"Activity","value":" "},
                    {"key":"Job","value":" "},
                    {"key":"Net Amount","value":"100.00"},
                    {"key":"VAT Code","value":"SR"},
                    {"key":"VAT Amount","value":"20.00"},
                    {"key":"Analysis Line Description","value":"Stationery stock order"},
                ]}
            ]},
            {"id":"FPMID1095","header1":"Supplier – Extreme Cleaning Services","header2":"Amount – £240","header3":"","header4":"Howard Jones","category":"Non-POP Invoices","details":[
                {"key":"Supplier Name","value":"Extreme Cleaning Services"},
                {"key":"Supplier Code","value":"E78009"},
                {"key":"Sub ledger","value":"P01"},
                {"key":"Our Reference","value":"1098773"},
                {"key":"eFin Reference","value":"57840008"},
                {"key":"Their Reference","value":"1500345"},
                {"key":"Net Amount","value":"200.00"},
                {"key":"VAT Amount","value":"40.00"},
                {"key":"Gross Amount","value":"240.00"},
                {"key":"Invoice Date","value":"16-Sept-2015"},
                {"key":"Due Date","value":"15-Oct-2015"}
            ],"lines":[
                {"header1":"Cost Centre","header2":"HO001 – Head Office","details":[
                    {"key":"Account","value":"E0272 - Cleaning"},
                    {"key":"Activity","value":"WC001 – Window Cleaning"},
                    {"key":"Job","value":" "},
                    {"key":"Net Amount","value":"100.00"},
                    {"key":"VAT Code","value":"SR"},
                    {"key":"VAT Amount","value":"20.00"},
                    {"key":"Analysis Line Description","value":" "},
                ]},
                {"header1":"Cost Centre","header2":"D0055 – Depot 1","details":[
                    {"key":"Account","value":"E0272 - Cleaning"},
                    {"key":"Activity","value":"WC001 – Window Cleaning"},
                    {"key":"Job","value":" "},
                    {"key":"Net Amount","value":"100.00"},
                    {"key":"VAT Code","value":"SR"},
                    {"key":"VAT Amount","value":"20.00"},
                    {"key":"Analysis Line Description","value":" "},
                ]},
            ]},
            {"id":"EPRIDREQ_R000489","header1":"R000489","header2":"133.00 GBP","header3":"","header4":"Jane Smith","category":"External Requisition", "details":[
                {"key":"No. of items","value":"1"}
            ],"lines":[
                    {
                        "header1": "", "header2": "Window cleaning",
                        "details": [
                            {"key": "Item", "value": "Window cleaning"},
                            {"key": "Supplier", "ACS Cleaning Services": ""},
                            {"key": "Quantity", "value": "1.00"},
                            {"key": "Price", "value": "133.00 GBP"},
                            {"key": "Total", "value": "133.00 GBP"},
                        ]
                    }
                ]},
                {"id":"EPRIDREQ_R000495","header1":"R000495","header2":"1045.70 GBP","header3":"","header4":"John Jones","category":"External Requisition",
                        "details":[{"key":"No. of items","value":"1"}],
                        "lines":[
                            {"header1":"","header2":"Planning Services","details":[
                                {"key":"Item","value":"Planning Services"},
                                {"key":"Supplier","ACME Plans Ltd":""},
                                {"key":"Quantity","value":"1.00"},
                                {"key":"Price","value":"1045.70 GBP"},
                                {"key":"Total","value":"1045.70 GBP"}
                            ]}

                ]}
        ]
    }
};*/
var dummyData = {
"FeedParticipantResponse": {
	"result": "SUCCESS", "message": "", "approvals": [
		  {
			  "id": "FPMID999", "header1": "Debtor - SPC002", "header2": "Reference - PO78788", "header3": "", "header4": "Ann Bowen", "category": "Debtor Invoices",
			  "details":
			  [
				  { "key": "Invoice prefix", "value": "S - 12" },
				  { "key": "Customer", "value": "SPC002 - STEVENS LTD" },
				  { "key": "Sub ledger", "value": "S01" },
				  { "key": "Transaction type", "value": "I - Invoice" },
				  { "key": "Period", "value": "5" },
				  { "key": "Year", "value": "2012" },
				  { "key": "Reference", "value": "PO78788" },
				  { "key": "Print status", "value": "N - No Print" },
				  { "key": "Header text", "value": "Hire 31/10/14" },
				  { "key": "Footer text", "value": "Terms strictly 10 days from invoice date" },
				  { "key": "Additional text", "value": "" }
			  ],
			  "lines":
			  [
				  {
					  "header1": "Product code", "header2": "MUS001 - MUSEUM HIRE - PUMP HOUSE",
					  "details":
					  [
						  { "key": "Quantity", "value": "1" },
						  { "key": "Unit of measure", "value": "EA - EACH" },
						  { "key": "Price", "value": "1000.00" },
						  { "key": "Per", "value": "1" },
						  { "key": "Net value", "value": "1000.00" },
						  { "key": "VAT code", "value": "SR - 20" },
						  { "key": "Cost centre", "value": "CC03 - ACCOUNTS RECEIVABLE" },
						  { "key": "Account", "value": "40017 - FACILITY CHARGES INCOME" },
						  { "key": "Activity", "value": "" },
						  { "key": "Job", "value": "" },
						  { "key": "Line text", "value": "PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR." }
					  ]
				  }
			  ]
		  },
		  /*{
				"id": "FPMID1001", "header1": "Debtor - SPC002", "header2": "Reference - PO78789", "header3": "", "header4": "Ann Bowen", "category": "Debtor Invoices",
				"details":
				[
					{ "key": "Invoice prefix", "value": "S - 12" },
					{ "key": "Customer", "value": "SPC002 - STEVENS LTD" },
					{ "key": "Sub ledger", "value": "S01" },
					{ "key": "Transaction type", "value": "I - Invoice" },
					{ "key": "Period", "value": "5" },
					{ "key": "Year", "value": "2012" },
					{ "key": "Reference", "value": "PO78789" },
					{ "key": "Print status", "value": "N - No Print" },
					{ "key": "Header text", "value": "Hire 30/09/14" },
					{ "key": "Footer text", "value": "Terms strictly 10 days from invoice date" }
					{ "key": "Additional text", "value": "" }
				],
				"lines":
			    [
				    {
					  "header1": "Product code", "header2": "MUS001 - MUSEUM HIRE - PUMP HOUSE",
					  "details":
					  [
						  { "key": "Quantity", "value": "1" },
						  { "key": "Unit of measure", "value": "EA - EACH" },
						  { "key": "Price", "value": "1000.00" },
						  { "key": "Per", "value": "1" },
						  { "key": "Net value", "value": "1000.00" },
						  { "key": "VAT code", "value": "SR - 20" },
						  { "key": "Cost centre", "value": "CC03 - ACCOUNTS RECEIVABLE" },
						  { "key": "Account", "value": "40017 - FACILITY CHARGES INCOME" },
						  { "key": "Activity", "value": "" },
						  { "key": "Job", "value": "" },
						  { "key": "Line text", "value": "PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR." }
					  ]
					}
			    ]
		  },*/
		  {
			  "id": "FPMID1001", "header1": "Debtor - SPC002", "header2": "Reference - PO78789", "header3": "", "header4": "Ann Bowen", "category": "Debtor Invoices",
			  "details":
			  [
					  { "key": "Invoice prefix", "value": "S - 12" },
					  { "key": "Customer", "value": "SPC002 - STEVENS LTD" },
					  { "key": "Sub ledger", "value": "S01" },
					  { "key": "Transaction type", "value": "I - Invoice" },
					  { "key": "Period", "value": "5" },
					  { "key": "Year", "value": "2012" },
					  { "key": "Reference", "value": "PO78789" },
					  { "key": "Print status", "value": "N - No Print" },
					  { "key": "Header text", "value": "Hire 30/09/14" },
					  { "key": "Footer text", "value": "Terms strictly 10 days from invoice date" },
					  { "key": "Additional text", "value": "" }
			  ],
			  "lines":
			  [
					{
					"header1": "Product code", "header2": "MUS001 - MUSEUM HIRE - PUMP HOUSE",
					"details":
					[
						{ "key": "Quantity", "value": "1" },
						{ "key": "Unit of measure", "value": "EA - EACH" },
						{ "key": "Price", "value": "1000.00" },
						{ "key": "Per", "value": "1" },
						{ "key": "Net value", "value": "1000.00" },
						{ "key": "VAT code", "value": "SR - 20" },
						{ "key": "Cost centre", "value": "CC03 - ACCOUNTS RECEIVABLE" },
						{ "key": "Account", "value": "40017 - FACILITY CHARGES INCOME" },
						{ "key": "Activity", "value": "" },
						{ "key": "Job", "value": "" },
						{ "key": "Line text", "value": "PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR." }
					]
					}
			  ]
		  },
		  {
			   "id": "FPMID1002", "header1": "Debtor - SPC002", "header2": "Reference - PO78790", "header3": "", "header4": "Ann Bowen", "category": "Debtor Invoices",
				"details":
				[
					 { "key": "Invoice prefix", "value": "S - 12" },
					 { "key": "Customer", "value": "SPC002 - STEVENS LTD" },
					 { "key": "Sub ledger", "value": "S01" },
					 { "key": "Transaction type", "value": "I - Invoice" },
					 { "key": "Period", "value": "5" },
					 { "key": "Year", "value": "2012" },
					 { "key": "Reference", "value": "PO78790" },
					 { "key": "Print status", "value": "N - No Print" },
					 { "key": "Header text", "value": "Hire 10/11/14" },
					 { "key": "Footer text", "value": "Terms strictly 10 days from invoice date" },
					 { "key": "Additional text", "value": "" }
			   ],
			   "lines":
			   [
				   {
					 "header1": "Product code", "header2": "MUS001 - MUSEUM HIRE - PUMP HOUSE",
					 "details":
					 [
						{ "key": "Quantity", "value": "1" },
						{ "key": "Unit of measure", "value": "EA - EACH" },
						{ "key": "Price", "value": "1000.00" },
						{ "key": "Per", "value": "1" },
						{ "key": "Net value", "value": "1000.00" },
						{ "key": "VAT code", "value": "SR - 20" },
						{ "key": "Cost centre", "value": "CC03 - ACCOUNTS RECEIVABLE" },
						{ "key": "Account", "value": "40017 - FACILITY CHARGES INCOME" },
						{ "key": "Activity", "value": "" },
						{ "key": "Job", "value": "" },
						{ "key": "Line text", "value": "PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR." }
					 ]
				  }
			   ]
		  },
		  {
			  "id": "FPMID205", "header1": "Supplier - Acme Holding Company", "header2": "S/L - P01", "header3": "", "header4": "Ann Bowen", "category": "Supplier Requests",
			  "details":
			  [
				   { "key": "Type", "value": "S - Statement" },
				   { "key": "Code", "value": "98765432" },
				   { "key": "Name", "value": "Acme Holding Company" },
				   { "key": "Address line 1", "value": "Caldicot" },
				   { "key": "Address line 2", "value": "Monmouthshire" },
				   { "key": "Address line 3", "value": "" },
				   { "key": "Address line 4", "value": "" },
				   { "key": "Post code", "value": "NP17 7TT" },
				   { "key": "Payment method", "value": "PQ - Cheque" },
				   { "key": "Bank account", "value": "" },
				   { "key": "Bank sort code", "value": "" },
				   { "key": "Payment terms", "value": "30 - 30 DAYS FROM INVOICE DATE" },
				   { "key": "Phone no.", "value": "01291 623491" },
				   { "key": "Sub ledger", "value": "P01" },
				   { "key": "Contact name", "value": "Janice Thomas" },
				   { "key": "Credit controller id", "value": "UA - Not allocated" },
				   { "key": "Email address", "value": "Acme@gmail.com" },
				   { "key": "Payment method sub type", "value": "" }
			 ],
			 "lines":
			 [
			 ]
		  },
		  {
			"id": "FPMID206", "header1": "Supplier – Abalone Importers Ltd", "header2": "S/L - P01", "header3": "", "header4": "Ann Bowen", "category": "Supplier Requests",
			"details":
		    [
				  { "key": "Type", "value": "S - Statement" },
				  { "key": "Code", "value": "98765432" },
				  { "key": "Name", "value": "Abalone Importers Ltd" },
				  { "key": "Address line 1", "value": "Caldicot" },
				  { "key": "Address line 2", "value": "Monmouthshire" },
				  { "key": "Address line 3", "value": "" },
				  { "key": "Address line 4", "value": "" },
				  { "key": "Post code", "value": "NP17 7TT" },
				  { "key": "Payment method", "value": "PQ - Cheque" },
				  { "key": "Bank account", "value": "" },
				  { "key": "Bank sort code", "value": "" },
				  { "key": "Payment terms", "value": "30 - 30 DAYS FROM INVOICE DATE" },
				  { "key": "Phone no.", "value": "01291 6222345" },
				  { "key": "Sub ledger", "value": "P01" },
				  { "key": "Contact name", "value": "Janice Smith" },
				  { "key": "Credit controller id", "value": "UA - Not allocated" },
				  { "key": "Email address", "value": "Abalone@gmail.com" },
				  { "key": "Payment method sub type", "value": "" }
			],
			"lines":
		    [
		    ]
		  },
		  {
			"id": "FPMID207", "header1": "Supplier – Earslwood Marketing Ltd", "header2": "S/L - P01", "header3": "", "header4": "Ann Bowen", "category": "Supplier Requests",
			"details":
		    [
				  { "key": "Type", "value": "S - Statement" },
				  { "key": "Code", "value": "98765432" },
				  { "key": "Name", "value": "Earlswood Marketing Ltd" },
				  { "key": "Address line 1", "value": "Caldicot" },
				  { "key": "Address line 2", "value": "Monmouthshire" },
				  { "key": "Address line 3", "value": "" },
				  { "key": "Address line 4", "value": "" },
				  { "key": "Post code", "value": "NP17 7TT" },
				  { "key": "Payment method", "value": "PQ - Cheque" },
				  { "key": "Bank account", "value": "" },
				  { "key": "Bank sort code", "value": "" },
				  { "key": "Payment terms", "value": "30 - 30 DAYS FROM INVOICE DATE" },
				  { "key": "Phone no.", "value": "01291 723490" },
				  { "key": "Sub ledger", "value": "P01" },
				  { "key": "Contact name", "value": "Janice Williams" },
				  { "key": "Credit controller id", "value": "UA - Not allocated" },
				  { "key": "Email address", "value": "Earlswood@gmail.com" },
				  { "key": "Payment method sub type", "value": "" }
			],
			"lines":
		    [
		    ]
		  },
		  {
			"id": "FPMID208", "header1": "Debtor - STEVENS LTD", "header2": "Reference - PO78795", "header3": "", "header4": "Ann Bowen", "category": "Debtor Invoices",
			"details":
		    [
				  { "key": "Invoice prefix", "value": "S - 12" },
				  { "key": "Customer", "value": "SPC002 - STEVENS LTD" },
				  { "key": "Sub ledger", "value": "S01" },
				  { "key": "Transaction type", "value": "I - Invoice" },
				  { "key": "Period", "value": "5" },
				  { "key": "Year", "value": "2012" },
				  { "key": "Reference", "value": "PO78795" },
				  { "key": "Print status", "value": "N - No Print" },
				  { "key": "Header text", "value": "Hire 30/11/14" },
				  { "key": "Footer text", "value": "Terms strictly 10 days from invoice date" },
				  { "key": "Additional text", "value": "" }
			],
			"lines":
			[
				 {
				   "header1": "Product code", "header2": "MUS001 - MUSEUM HIRE - PUMP HOUSE",
				   "details":
				   [
					  { "key": "Quantity", "value": "1" },
					  { "key": "Unit of measure", "value": "EA - EACH" },
					  { "key": "Price", "value": "1000.00" },
					  { "key": "Per", "value": "1" },
					  { "key": "Net value", "value": "1000.00" },
					  { "key": "VAT code", "value": "SR - 20" },
					  { "key": "Cost centre", "value": "CC03 - ACCOUNTS RECEIVABLE" },
					  { "key": "Account", "value": "40017 - FACILITY CHARGES INCOME" },
					  { "key": "Activity", "value": "" },
					  { "key": "Job", "value": "" },
					  { "key": "Line text", "value": "PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR." }
				   ]
				 }
			 ]
		  },
		  {
			"id": "FPMID209", "header1": "Supplier – Crosskeys Motors", "header2": "S/L - P01", "header3": "", "header4": "Ann Bowen", "category": "Supplier Requests",
			"details":
		    [
				  { "key": "Type", "value": "S - Statement" },
				  { "key": "Code", "value": "98765432" },
				  { "key": "Name", "value": "Crosskeys Motors" },
				  { "key": "Address line 1", "value": "Caldicot" },
				  { "key": "Address line 2", "value": "Monmouthshire" },
				  { "key": "Address line 3", "value": "" },
				  { "key": "Address line 4", "value": "" },
				  { "key": "Post code", "value": "NP17 7TT" },
				  { "key": "Payment method", "value": "PQ - Cheque" },
				  { "key": "Bank account", "value": "" },
				  { "key": "Bank sort code", "value": "" },
				  { "key": "Payment terms", "value": "30 - 30 DAYS FROM INVOICE DATE" },
				  { "key": "Phone no.", "value": "01291 641209" },
				  { "key": "Sub ledger", "value": "P01" },
				  { "key": "Contact name", "value": "Janice Thomas" },
				  { "key": "Credit controller id", "value": "UA - Not allocated" },
				  { "key": "Email address", "value": "Crosskeys@gmail.com" },
				  { "key": "Payment method sub type", "value": "" }
			],
			"lines":
			[
			]
		  },
		  {
			"id": "FPMID210", "header1": "Supplier – Bridgewater Supplies Ltd", "header2": "S/L - P01", "header3": "", "header4": "Ann Bowen", "category": "Supplier Requests",
			"details":
		    [
			     { "key": "Type", "value": "S - Statement" },
			     { "key": "Code", "value": "98765432" },
			     { "key": "Name", "value": "Bridgewater Supplies Ltd" },
			     { "key": "Address line 1", "value": "143 River Street" },
			     { "key": "Address line 2", "value": "Bridgewater" },
			     { "key": "Address line 3", "Somerset": "" },
			     { "key": "Address line 4", "value": "" },
			     { "key": "Post code", "value": "BW17 7TT" },
			     { "key": "Payment method", "value": "PQ - Cheque" },
			     { "key": "Bank account", "value": "" },
			     { "key": "Bank sort code", "value": "" },
			     { "key": "Payment terms", "value": "30 - 30 DAYS FROM INVOICE DATE" },
			     { "key": "Phone no.", "value": "01291 641209" },
			     { "key": "Sub ledger", "value": "P01" },
			     { "key": "Contact name", "value": "Janice Thomas" },
			     { "key": "Credit controller id", "value": "UA - Not allocated" },
			     { "key": "Email address", "value": "Bridgewatersupplies@gmail.com" },
			     { "key": "Payment method sub type", "value": "" }
			 ],
			 "lines":
			 [
			 ]
		  },
		  {
			"id": "FPMID1095", "header1": "Supplier – Ajax Office Supplies", "header2": "Amount – £120.00", "header3": "", "header4": "Jane Smith", "category": "Non-POP Invoices",
			"details":
			  [
		         { "key": "Supplier Name", "value": "Ajax Office Supplies" },
		         { "key": "Supplier Code", "value": "A2345" },
		         { "key": "Sub ledger", "value": "P01" },
		         { "key": "Our Reference", "value": "1098746" },
		         { "key": "eFin Reference", "value": "57840002" },
		         { "key": "Their Reference", "value": "INV237800" },
		         { "key": "Net Amount", "value": "100.00" },
		         { "key": "VAT Amount", "value": "20.00" },
		         { "key": "Gross Amount", "value": "120.00" },
		         { "key": "Invoice Date", "value": "16-Sept-2015" },
		         { "key": "Due Date", "value": "01-Oct-2015" }
			 ],
			 "lines":
			 [
			    {
				  "header1": "Cost Centre", "header2": "HO001 – Head Office",
				  "details":
				  [
					  { "key": "Account", "value": "E0234 - Stationery" },
					  { "key": "Activity", "value": " " },
					  { "key": "Job", "value": " " },
					  { "key": "Net Amount", "value": "100.00" },
					  { "key": "VAT Code", "value": "SR" },
					  { "key": "VAT Amount", "value": "20.00" },
					  { "key": "Analysis Line Description", "value": "Stationery stock order" }
				  ]
				}
			 ]
		  },
		  {
			"id": "FPMID1096", "header1": "Supplier – Extreme Cleaning Services", "header2": "Amount – £240", "header3": "", "header4": "Howard Jones", "category": "Non-POP Invoices",
			"details":
		    [
				{ "key": "Supplier Name", "value": "Extreme Cleaning Services" },
				{ "key": "Supplier Code", "value": "E78009" },
				{ "key": "Sub ledger", "value": "P01" },
				{ "key": "Our Reference", "value": "1098773" },
				{ "key": "eFin Reference", "value": "57840008" },
				{ "key": "Their Reference", "value": "1500345" },
				{ "key": "Net Amount", "value": "200.00" },
				{ "key": "VAT Amount", "value": "40.00" },
				{ "key": "Gross Amount", "value": "240.00" },
				{ "key": "Invoice Date", "value": "16-Sept-2015" },
				{ "key": "Due Date", "value": "15-Oct-2015" }
			],
			"lines":
			[
			   {
				  "header1": "Cost Centre", "header2": "HO001 – Head Office",
				  "details":
				  [
					  { "key": "Account", "value": "E0272 - Cleaning" },
					  { "key": "Activity", "value": "WC001 – Window Cleaning" },
					  { "key": "Job", "value": " " },
					  { "key": "Net Amount", "value": "100.00" },
					  { "key": "VAT Code", "value": "SR" },
					  { "key": "VAT Amount", "value": "20.00" },
					  { "key": "Analysis Line Description", "value": " " }
				  ]
				  },
				  {
				  "header1": "Cost Centre", "header2": "D0055 – Depot 1",
				  "details":
				  [
					  { "key": "Account", "value": "E0272 - Cleaning" },
					  { "key": "Activity", "value": "WC001 – Window Cleaning" },
					  { "key": "Job", "value": " " },
					  { "key": "Net Amount", "value": "100.00" },
					  { "key": "VAT Code", "value": "SR" },
					  { "key": "VAT Amount", "value": "20.00" },
					  { "key": "Analysis Line Description", "value": " " }
				  ]
			  }
		  ]
		  },
		  /*{
			"id":"EPRIDREQ_R000489","header1":"R000489","header2":"133.00 GBP","header3":"","header4":"Jane Smith","category":"External Requisition",
			"details":
			[
				{"key":"No. of items","value":"1"}
			],
			"lines":
			[
				{
				"header1":"","header2":"Window cleaning",
				"details":
				[
					{"key":"Item","value":"Window cleaning"},
					{"key":"Supplier","ACS Cleaning Services":""},
					{"key":"Quantity","value":"1.00"},
					{"key":"Price","value":"133.00 GBP"},
					{"key":"Total","value":"133.00 GBP"}
				]
				}
			]
													  
		  },*/
		  {
			"id":"EPRIDREQ_R000489","header1":"R000489","header2":"133.00 GBP","header3":"","header4":"Jane Smith","category":"External Requisition",
			"details":
			[
				{"key":"No. of items","value":"1"}
			],
			"lines":
			[
			    {
					"header1":"","header2":"Window cleaning",
					"details":
					[
						{"key":"Item","value":"Window cleaning"},
						{"key":"Supplier","ACS Cleaning Services":""},
						{"key":"Quantity","value":"1.00"},
						{"key":"Price","value":"133.00 GBP"},
						{"key":"Total","value":"133.00 GBP"},
						{"key":"Cost Centre","value":"B12345-Ditton Park"},
					    {"key":"Account","value":"4765-Cleaning"}
					]
				}
			]
													  
		  },
		  /*{
			"id":"EPRIDREQ_R000495","header1":"R000495","header2":"1045.70 GBP","header3":"","header4":"John Jones","category":"External Requisition",
			"details":
		    [
			    {"key":"No. of items","value":"1"}
		    ],
			"lines":
		    [
				{
				"header1":"","header2":"Planning Services",
				"details":
				[
					{"key":"Item","value":"Planning Services"},
					{"key":"Supplier","ACME Plans Ltd":""},
					{"key":"Quantity","value":"1.00"},
					{"key":"Price","value":"1045.70 GBP"},
					{"key":"Total","value":"1045.70 GBP"}
				]
				}
		    ]
		 }*/
		 {
			"id":"EPRIDREQ_R000495","header1":"R000495","header2":"1045.70 GBP","header3":"","header4":"John Jones","category":"External Requisition",
			"details":
		    [
			{"key":"No. of items","value":"1"}
		    ],
			"lines":
		    [
				{
				"header1":"","header2":"Planning Services",
				"details":
				[
					{"key":"Item","value":"Planning Services"},
					{"key":"Supplier","ACME Plans Ltd":""},
					{"key":"Quantity","value":"1.00"},
					{"key":"Price","value":"1045.70 GBP"},
					{"key":"Total","value":"1045.70 GBP"},
					{"key":"Cost Centre","value":"B67890-Facilities"},
					{"key":"Account","value":"9876-Professional services"},
					{"key":"Job","value":"J234-Project ABC"}
				]
				}
		    ]
		 },
		 {
		 "id":"EPRIDREQ_R001234","header1":"R001234","header2":"240.00 GBP","header3":"","header4":"Sue Mills","category":"External Requisition",
			"details":
			[
				{"key":"No. of items","value":"2"}
			],
			"lines":
			[
				{
				"header1":"","header2":"Uniforms",
				"details":
				[
					{"key":"Item","value":"Uniforms"},
					{"key":"Supplier","Berensden Uniform Supplies":""},
					{"key":"Quantity","value":"2.00"},
					{"key":"Price","value":"50.00 GBP"},
					{"key":"Total","value":"100.00 GBP"},
					{"key":"Cost Centre","value":"B12322-Central Administration"},
					{"key":"Account","value":"3455-Uniforms"},
					{"key":"Activity","value":"XYZ-Reception"}
               ]
			   },
			   {
				"header1":"","header2":"Uniforms",
				"details":
				[
					{"key":"Item","value":"Uniforms"},
					{"key":"Supplier","Berensden Uniform Supplies":""},
					{"key":"Quantity","value":"2.00"},
					{"key":"Price","value":"70.00 GBP"},
					{"key":"Total","value":"140.00 GBP"},
					{"key":"Cost Centre","value":"B12322-Central Administration"},
					{"key":"Account","value":"3455-Uniforms"},
					{"key":"Activity","value":"ABC-Security"}
				 ]
			   }
			]
		},
		{
			"id":"EPRIDREQ_R001278","header1":"R001278","header2":"27.00 GBP","header3":"","header4":"Sue Mills","category":"External Requisition",
			"details":
			[
				{"key":"No. of items","value":"2"}
			],
			"lines":
			[
				{
				  "header1":"","header2":"Black Biros",
				  "details":
				  [
					{"key":"Item","value":"Black Biros"},
					{"key":"Supplier","AJAX Office Stationery":""},
					{"key":"Quantity","value":"2.00"},
					{"key":"Price","value":"2.50 GBP"},
					{"key":"Total","value":"5.00 GBP"},
					{"key":"Cost Centre","value":"B12322-HR"},
					{"key":"Account","value":"3235-Stationery"}
			     ]
			  },
			  {
				"header1":"","header2":"A4 Note Pads",
				"details":
				[
					{"key":"Item","value":"A4 Note Pads"},
					{"key":"Supplier","AJAX Office Stationery":""},
					{"key":"Quantity","value":"24.00"},
					{"key":"Price","value":"1.00 GBP"},
					{"key":"Total","value":"24.00 GBP"},
					{"key":"Cost Centre","value":"B12322-HR"},
					{"key":"Account","value":"3235-Stationery"}
			    ]
			 }
			]
		}
	 ]
  }
};
var approvals = {"FeedParticipantResponse":{"result":"SUCCESS","message":"","data":[
    {"id":"FPMID999","header1":"Debtor - SPC001","header2":"Reference - PO78788","header3":"","header4":"Ann Bowen", "options":[{"action":"Approve", "reply":"approved", "role":"pos", "commentRequired":false},{"action":"Reject", "reply":"rejected", "role":"neg", "commentRequired":true}], "documents":[{"docId": "FPMID1279", "msg":"Invoice"},{"docId": "FPM1279", "msg":"Receipt"}], "category":"Debtor Invoices","details":[{"key":"Invoice prefix","value":"S - 12"},{"key":"Customer","value":"SPC002 - STEVENS LTD"},{"key":"Sub ledger","value":"S01"},{"key":"Transaction type","value":"I - Invoice"},{"key":"Period","value":"5"},{"key":"Year","value":"2012"},{"key":"Reference","value":"PO78788"},{"key":"Print status","value":"N - No Print"},{"key":"Header text","value":"Hire 31/10/12"},{"key":"Footer text","value":"Terms strictly 10 days from invoice date"},{"key":"Additional text","value":""}],"lines":[{"header1":"Product code","header2":"MUS001 - MUSEUM HIRE - PUMP HOUSE","details":[{"key":"Quantity","value":"1"},{"key":"Unit of measure","value":"EA - EACH"},{"key":"Price","value":"1000.00"},{"key":"Per","value":"1"},{"key":"Net value","value":"1000.00"},{"key":"VAT code","value":"SR - 20"},{"key":"Cost centre","value":"CC03 - ACCOUNTS RECEIVABLE"},{"key":"Account","value":"40017 - FACILITY CHARGES INCOME"},{"key":"Activity","value":""},{"key":"Job","value":""},{"key":"Line text","value":"PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR."}]}]},
    {"id":"FPMID991","header1":"Debtor - SPC002","header2":"Reference - PO78788","header3":"","header4":"Ann Bowen", "options":[{"action":"Approve", "reply":"approved", "role":"pos", "commentRequired":false},{"action":"Reject", "reply":"rejected", "role":"neg", "commentRequired":true}], "category":"Debtor Invoices","details":[{"key":"Invoice prefix","value":"S - 12"},{"key":"Customer","value":"SPC002 - STEVENS LTD"},{"key":"Sub ledger","value":"S01"},{"key":"Transaction type","value":"I - Invoice"},{"key":"Period","value":"5"},{"key":"Year","value":"2012"},{"key":"Reference","value":"PO78788"},{"key":"Print status","value":"N - No Print"},{"key":"Header text","value":"Hire 31/10/12"},{"key":"Footer text","value":"Terms strictly 10 days from invoice date"},{"key":"Additional text","value":""}],"lines":[{"header1":"Product code","header2":"MUS001 - MUSEUM HIRE - PUMP HOUSE","details":[{"key":"Quantity","value":"1"},{"key":"Unit of measure","value":"EA - EACH"},{"key":"Price","value":"1000.00"},{"key":"Per","value":"1"},{"key":"Net value","value":"1000.00"},{"key":"VAT code","value":"SR - 20"},{"key":"Cost centre","value":"CC03 - ACCOUNTS RECEIVABLE"},{"key":"Account","value":"40017 - FACILITY CHARGES INCOME"},{"key":"Activity","value":""},{"key":"Job","value":""},{"key":"Line text","value":"PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR."}]}]},
    {"id":"FPMID992","header1":"Debtor - SPC003","header2":"Reference - PO78788","header3":"","header4":"Ann Bowen", "options":[{"action":"Approve", "reply":"approved", "role":"pos", "commentRequired":false},{"action":"Reject", "reply":"rejected", "role":"neg", "commentRequired":true}], "category":"Debtor Invoices","details":[{"key":"Invoice prefix","value":"S - 12"},{"key":"Customer","value":"SPC002 - STEVENS LTD"},{"key":"Sub ledger","value":"S01"},{"key":"Transaction type","value":"I - Invoice"},{"key":"Period","value":"5"},{"key":"Year","value":"2012"},{"key":"Reference","value":"PO78788"},{"key":"Print status","value":"N - No Print"},{"key":"Header text","value":"Hire 31/10/12"},{"key":"Footer text","value":"Terms strictly 10 days from invoice date"},{"key":"Additional text","value":""}],"lines":[{"header1":"Product code","header2":"MUS001 - MUSEUM HIRE - PUMP HOUSE","details":[{"key":"Quantity","value":"1"},{"key":"Unit of measure","value":"EA - EACH"},{"key":"Price","value":"1000.00"},{"key":"Per","value":"1"},{"key":"Net value","value":"1000.00"},{"key":"VAT code","value":"SR - 20"},{"key":"Cost centre","value":"CC03 - ACCOUNTS RECEIVABLE"},{"key":"Account","value":"40017 - FACILITY CHARGES INCOME"},{"key":"Activity","value":""},{"key":"Job","value":""},{"key":"Line text","value":"PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR."}]}]},
    {"id":"FPMID993","header1":"Debtor - SPC004","header2":"Reference - PO78788","header3":"","header4":"Ann Bowen", "options":[{"action":"Approve", "reply":"approved", "role":"pos", "commentRequired":false},{"action":"Reject", "reply":"rejected", "role":"neg", "commentRequired":true}], "category":"Debtor Invoices","details":[{"key":"Invoice prefix","value":"S - 12"},{"key":"Customer","value":"SPC002 - STEVENS LTD"},{"key":"Sub ledger","value":"S01"},{"key":"Transaction type","value":"I - Invoice"},{"key":"Period","value":"5"},{"key":"Year","value":"2012"},{"key":"Reference","value":"PO78788"},{"key":"Print status","value":"N - No Print"},{"key":"Header text","value":"Hire 31/10/12"},{"key":"Footer text","value":"Terms strictly 10 days from invoice date"},{"key":"Additional text","value":""}],"lines":[{"header1":"Product code","header2":"MUS001 - MUSEUM HIRE - PUMP HOUSE","details":[{"key":"Quantity","value":"1"},{"key":"Unit of measure","value":"EA - EACH"},{"key":"Price","value":"1000.00"},{"key":"Per","value":"1"},{"key":"Net value","value":"1000.00"},{"key":"VAT code","value":"SR - 20"},{"key":"Cost centre","value":"CC03 - ACCOUNTS RECEIVABLE"},{"key":"Account","value":"40017 - FACILITY CHARGES INCOME"},{"key":"Activity","value":""},{"key":"Job","value":""},{"key":"Line text","value":"PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR."}]}]}
]}};
var destiny = [];
var testCount = 0;
function callDeferredFunction()
{
    console.log("callDeferredFunction()");
    var data = dummyData.FeedParticipantResponse.data;
    if (testCount < 10)
    {
        deferredFunctionCall(data);
        testCount++;
    }
    else
    {
        testCount = 0;
        app.routerService.simulateError( 43 );
    }
}

var sendItemsCount = 0;
var sentItemsStash = [];
function callStashedFunction(index)
{
    console.log("calling stashed function at index " + index);
    //app.routerService.simulateError(43);
    if (sendItemsCount > 1)
    {
        sendItemsCount = 0;
        var stash = sentItemsStash[index];
        stash.functionCall( stash.item.id );
    }
    else
    {
        sendItemsCount++;
    }
}
TrialRouterService.prototype = {
    setDevice: function(device)
    {
        this.device = device;
        console.log("setDevice",device);
    },
    setClientVersion: function(version)
    {
        this.clientVersion = version;
        console.log("setVersion",version);
    },
    registerDevice: function(activationKey, registrationPin, okFunction)
    {
        console.log( "RouterService.registerDevice", activationKey,registrationPin);
        if(activationKey == "TRIAL")
        {
            okFunction( "extendedTrial", "deviceId" );
        }
        else
        {
           this.simulateDetailsError(4, true, "Invalid Registration Parameters");
        }
    },
    loginToRouter: function(extendedActivationKey, loginPin, okFunction, invalidPinFunction)
    {
        // We need to oauth authenticate
        okFunction( "gatewayRuntimeToken", 300 );
    },
    getApprovalItems: function(extendedActivationKey, showNonCriticalErrors, okFunction, failFunction)
    {
        setTimeout(function () { okFunction(dummyData.FeedParticipantResponse) }, 1000);
    },
    sendApprovalItem: function(extendedActivationKey, itemID, update, okFunction, failFunction)
    {
        okFunction( itemID, itemID );
    },
    getTransactionStatusList: function(extendedActivationKey, transactionIds, okFunction, failFunction)
    {
        console.log("TransStatList",transactionIds);
        var statusList = [];
        for (var i = 0; i < transactionIds.length; i++)
        {
            statusList[i] = {txId:transactionIds[i], status:"PENDING"};
        }
        console.log(statusList);
        okFunction( statusList );
    },
    simulateTransactionError: function(code, showErrors)
    {
        var error = {};
        error.status = 700;
        error.code = 0;
        error.detail = "";
        error.transactionId = 23;
        this.errorHandler.handleRouterError(error, true);
    },
    simulateStatusError: function(code, showErrors)
    {
        var error = {};
        error.status = 500;
        error.code = code;
        error.detail = "";
        error.transactionId = null;
        this.errorHandler.handleRouterError(error, showErrors);
    },
    simulateDetailsError: function(code, showErrors, detail)
    {
        var error = {};
        error.status = 200;
        error.code = code;
        error.detail = detail;
        error.transactionId = null;
        this.errorHandler.handleRouterError(error, showErrors);
    },
    simulateError: function(code, showErrors)
    {
        var error = {};
        error.status = 200;
        error.code = 0;
        error.detail = "";
        error.transactionId = null;
        this.errorHandler.handleRouterError(error, showErrors);
    }
}
function routerServiceEncode(txt) {
    //return "'"+encodeURIComponent(comment)+"'";
    return "'"+txt+"'";
}




