let formStructure = {
    "forms": [
        {
            "type": "header",
            "value": "Fuel Requisition Form",
            "label": "",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_f5fe8977-fba1-420d-a9bc-36017b845383",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "_0",
            "index": 0
        },
        {
            "type": "date",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "label": "Last Fuel Date",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_f5fe8977-fba1-420d-a9bc-36017b845383",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "onchange": "",
			"disabled":true,
            "id": "last_fuel_date",
            "index": 1
        },
		
        {
            "type": "text",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "label": "Last Fuel Issued(Ltrs)",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_f5fe8977-fba1-420d-a9bc-36017b845383",
            "row_span": null,
			"disabled":true,
            "col_span": null,
            "span_column": false,
            "id": "last_fuel_issuedltrs",
            "index": 2
        },
        {
            "type": "date",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "label": "Date Requested",
            "fancy": true,
            "required": true,
            "description": "",
            "group": "g_f5fe8977-fba1-420d-a9bc-36017b845383",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "date_requested",
            "index": 3
        },
        {
            "type": "text",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "FRN-YYYY-XXXX",
            "label": "Fuel Requisition No.",
            "fancy": true,
            "required": false,
            "description": "",
			"disabled":true,
            "group": "g_f5fe8977-fba1-420d-a9bc-36017b845383",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "fuel_requisition_no",
            "index": 4
        },
        {
            "type": "header",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "Fuel Requisition Slip(FRS)",
            "label": "",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_0e3acac6-a109-4fa7-ba37-f7aa66ef4a87",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "_5",
            "index": 5
        },
        {
            "type": "select",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "label": "Plate No.",
            "fancy": true,
            "required": true,
            "description": "",
            "group": "g_0e3acac6-a109-4fa7-ba37-f7aa66ef4a87",
            "row_span": null,
            "col_span": null,
			"onchange": "loadRecentData(this)",
			"onclick": undefined,
            "span_column": false,
            "id": "plate_no",
			"list":"plate_noms",
            "index": 6
        },
        {
            "type": "text",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "label": "Recent Driver",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_0e3acac6-a109-4fa7-ba37-f7aa66ef4a87",
            "row_span": null,
            "col_span": null,
			"disabled": true,
            "span_column": false,
            "id": "recent_driver",
            "index": 7
        },
        {
            "type": "text",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "label": "Average Km/L",
            "fancy": true,
            "required": false,
            "description": "",
			"disabled": true,
            "group": "g_0e3acac6-a109-4fa7-ba37-f7aa66ef4a87",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "average_kml",
            "index": 8
        },
        {
            "type": "text",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "label": "Vehicle Description",
			"disabled": true,
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_0e3acac6-a109-4fa7-ba37-f7aa66ef4a87",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "vehicle_description",
            "index": 9
        },
        {
            "type": "select",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "label": "Driver/Requested By",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_0e3acac6-a109-4fa7-ba37-f7aa66ef4a87",
            "row_span": null,
            "col_span": null,
            "span_column": false,
			"list": "drivers",
            "id": "driverrequested_by",
            "index": 10
        },
        {
            "type": "select",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "label": "Branch",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_0e3acac6-a109-4fa7-ba37-f7aa66ef4a87",
            "row_span": null,
            "col_span": null,
            "span_column": false,
			"list":"branch_list",
            "id": "branch_id",
            "index": 11
        },
		
		{
            "type": "header",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "Last Fuel Record",
            "label": "",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_d63a3455-ae8b-4e35-8a98-d11c37d7e326",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "_5",
            "index": 5
        },
		
		
        {
            "type": "table",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "config": {
                "config": {
                    "min": "0",
                    "max": "0",
                    "custom_row": false,
                    "row_count": "1"
                },
                "items": [
                    "Previous Odo",
                    "Current Odo"
                ],
                "itemsConfig": [
                    {
                        "type": "text",
                        "attributes": {},
						"disabled":false,
						"onchange": "calculateDistTravelled(this)",
                    },
                    {
                        "type": "text",
                        "attributes": {},
						"onchange": "calculateDistTravelled(this)",
                    }
                ],
                "rowed": true,
                "fullspan": false,
                "responsivespan": true
            },
            "rowed": true,
            "fullspan": false,
            "responsivespan": true,
            "label": "",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_d63a3455-ae8b-4e35-8a98-d11c37d7e326",
            "row_span": null,
            "col_span": null,
            "span_column": true,
            "id": "last_fuel_recordltrs",
			"onchange": "calculateDistTravelled(this)",
            "index": 12
        },
        {
            "type": "text",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "label": "Dist. Travelled Kms",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_d63a3455-ae8b-4e35-8a98-d11c37d7e326",
            "row_span": null,
            "col_span": null,
            "span_column": false,
			"disabled": true,
            "id": "dist_travelled_kms",
            "index": 13
        },
        {
            "type": "text",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "label": "Est. Fuel Consumed",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_d63a3455-ae8b-4e35-8a98-d11c37d7e326",
            "row_span": null,
            "col_span": null,
            "span_column": false,
			"disabled": true,
            "id": "est_fuel_consumed",
            "index": 14
        },
        {
            "type": "text",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "label": "Actual Fuel Beg. (L)",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_d63a3455-ae8b-4e35-8a98-d11c37d7e326",
            "row_span": null,
            "col_span": null,
            "span_column": false,
			"onchange": "calculateTheoEnd(this)",
            "id": "actual_fuel_beg_l",
            "index": 15
        },
        {
            "type": "text",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "label": "Actual Fuel End(L)",
			"onchange": "calculateSOEnd()",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_d63a3455-ae8b-4e35-8a98-d11c37d7e326",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "actual_fuel_endl",
            "index": 16
        },
        {
            "type": "text",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "label": "Theo End (L)",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_d63a3455-ae8b-4e35-8a98-d11c37d7e326",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "theo_end_l",
			"disabled": true,
            "index": 17
        },
        {
            "type": "text",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "label": "S/(O) (Theo-Actl End) L",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_d63a3455-ae8b-4e35-8a98-d11c37d7e326",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "so_theoactl_end_l",
			"disabled": true,
            "index": 18
        },
		{
            "type": "header",
  
            "value": "CURRENT FUEL REQUEST",
            "label": "",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_5145d6e5-19d8-47df-b15d-531c9258d721",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "_5",
            "index": 5
        },
        {
            "type": "text",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "label": "Supplier / Vendor Name",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_5145d6e5-19d8-47df-b15d-531c9258d721",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "supplier_vendor_name",
			"list":"supplier_list",
            "index": 19
        },
        {
            "type": "text",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "label": "No. of Ltrs",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_5145d6e5-19d8-47df-b15d-531c9258d721",
            "row_span": null,
            "col_span": null,
            "span_column": false,
			"onchange": "calculateTheoEnd()",
            "id": "no_of_ltrs",
            "index": 20
        },
		
		
        {
            "type": "text",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "label": "Prev. Cost/Ltr",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_5145d6e5-19d8-47df-b15d-531c9258d721",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "prev_costltr",
            "index": 21
        },
        {
            "type": "text",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "label": "Activity Type",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_5145d6e5-19d8-47df-b15d-531c9258d721",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "activity_type",
            "index": 22
        },
        {
            "type": "text",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "label": "Crew/Occupants-1",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_0e3acac6-a109-4fa7-ba37-f7aa66ef4a87",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "crewoccupants1",
            "index": 23
        },
        {
            "type": "text",
            "events": {
                "eventname": "ev_06717c68-2b62-46ed-a21b-8e0e479909fe",
                "type": "hideon",
                "targetIndex": "2",
                "value": "2"
            },
            "value": "",
            "label": "Crew/Occupants-2",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_0e3acac6-a109-4fa7-ba37-f7aa66ef4a87",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "crewoccupants2",
            "index": 24
        }
    ],
    "groups": [
        {
            "name": "Dates",
            "type": "default",
            "column_count": "4",
            "row_view": false,
            "id": "g_f5fe8977-fba1-420d-a9bc-36017b845383"
        },
        {
            "name": "FRS",
            "type": "default",
            "column_count": "2",
            "row_view": false,
            "id": "g_0e3acac6-a109-4fa7-ba37-f7aa66ef4a87"
        },
		{
            "name": "Current Fuel Request",
            "type": "default",
            "column_count": "2",
            "row_view": true,
            "id": "g_5145d6e5-19d8-47df-b15d-531c9258d721"
        },
        {
            "name": "Last Fuel Record",
            "type": "default",
            "column_count": "3",
            "row_view": false,
            "id": "g_d63a3455-ae8b-4e35-8a98-d11c37d7e326"
        },
        {
            "name": "Occupants",
            "type": "default",
            "column_count": "2",
            "row_view": true,
            "id": "g_1dfe9fa6-fbc3-44dd-a121-41a082bd36b3"
        }
    ]
}



















let schema = {

    "date_requested": "", // Current Time Date
    "fuel_requisition_no": "", //System Generated
    "plate_no": "", //Supply With Current / Selected From Datalist 
    "recent_driver": "", //Based on Recent Entry 
    "average_kml": "",  // Supplied from Vehicle Entry Database
    "vehicle_description": "", //Supplied from Vehicle Entry on Database
    "driverrequested_by": "", //Input from Dropdown
    "branch_id": "", //Supplied From Dropdown


    "dist_travelled_kms": "", //Calculated (See Doc)
    "est_fuel_consumed": "", //Calculated (See Doc)
    "actual_fuel_beg_l": "",  //Input From User
    "actual_fuel_endl": "",   //Input From User
    "theo_end_l": "",        //Calculated (See Doc)
    "so_theoactl_end_l": "",  //Calculated (See Doc)
    "supplier_vendor_name": "", //Input From User
    "no_of_ltrs": "", //Input From User
    "prev_costltr": "", //Input From User
    "activity_type": "", //Supplied From Dropdown
    "crewoccupants1": "", //Supplied From Dropdown
    "crewoccupants2": "" //Supplied From Dropdown
};