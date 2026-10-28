let formStructure = {
    "forms": [
        {
            "type": "header",
            "value": "Purchase Order Form",
            "label": "",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_c6956005-08ba-420a-9cbc-2548a045033b",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "_0",
            "index": 0
        },
		{
            "type": "text",
            "events": {},
            "value": "",
            "label": "PO No.",
            "fancy": true,
            "required": true,
            "description": "",
            "group": "g_c6956005-08ba-420a-9cbc-2548a045033b",
            "row_span": null,
			"onchange": "monitorPOValue(this)",
            "col_span": null,
            "span_column": true,
            "id": "po_no",
            "index": 1
        }
		,
		{
            "type": "select",
            "events": {},
            "value": "",
            "label": "Company",
            "fancy": true,
            "required": false,
            "description": "If not Specified, defaults to Current User's company assigned",
            "group": "g_c6956005-08ba-420a-9cbc-2548a045033b",
            "row_span": null,
            "col_span": null,
            "span_column": false,
			"list": "company_list",
            "id": "company_id",
            "index": 6
        },
        {
            "type": "select",
            "value": "",
            "label": "Requesting Department",
            "fancy": true,
            "required": false,
            "description": "Please Specify which department this PO is for.",
            "group": "g_c6956005-08ba-420a-9cbc-2548a045033b",
            "row_span": null,
            "col_span": null,
            "span_column": false,
			"list":"departments",
            "id": "department_id",
            "index": 4
        },
        {
            "type": "text",
            "events": {},
            "value": "",
            "label": "Supplier Name",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_c6956005-08ba-420a-9cbc-2548a045033b",
            "row_span": 0,
            "col_span": 0,
            "span_column": false,
            "id": "supplier_name",
            "index": 1
        },
        {
            "type": "text",
            "events": {},
            "value": "",
            "label": "Supplier Address",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_c6956005-08ba-420a-9cbc-2548a045033b",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "supplier_address",
            "index": 2
        },
        {
            "type": "text",
            "events": {},
            "value": "",
            "label": "Contact Person",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_c6956005-08ba-420a-9cbc-2548a045033b",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "contact_person",
            "index": 3
        },
        {
            "type": "checkboxes",
            "events": {},
            "value": "",
            "config": {
                "config": {
                    "min": "1",
                    "max": "1",
                    "column_view": true,
                    "allow_others": false
                },
                "items": [
                    "Credit",
                    "Cash",
                    "Check"
                ]
            },
            "label": "Payment Terms",
            "fancy": true,
            "required": true,
            "description": "",
            "group": "g_c6956005-08ba-420a-9cbc-2548a045033b",
            "row_span": 2,
            "col_span": null,
            "span_column": false,
            "id": "payment_terms",
            "index": 4
        },
        {
            "type": "text",
            "events": {},
            "value": "",
            "label": "Supplier Contact Number",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_c6956005-08ba-420a-9cbc-2548a045033b",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "supplier_contact_number",
            "index": 5
        },
		
        {
            "type": "table",
            "value": "",
            "config": {
                "config": {
                    "min": "0",
                    "max": "0",
                    "custom_row": true,
                    "row_count": "1"
                },
                "items": [
                    "Item Name",
                    "Quantity",
                    "Item Description",
                    "Unit Cost",
                    "Total Amount"
                ],
                "itemsConfig": [
                    {
                        "type": "text",
                        "attributes": {},
                        "required": true
                    },
                    {
                        "type": "number",
                        "attributes": {},
						"onchange": "calculateTotal(this)",
						"min":1,
						"class":"test_class",
                    },
                    {
                        "type": "text",
                        "attributes": {},
						
                    },
                    {
                        "type": "number",
                        "attributes": {},
                        "required": true,
						"onchange": "calculateTotal(this)",
                    },
                    {
                        "type": "text",
                        "attributes": {},
                        "required": true
                    }
                ],
                "rowed": true,
                "fullspan": true,
                "responsivespan": true
            },
            "rowed": false,
            "fullspan": true,
            "responsivespan": true,
            "label": "Item Lists",
            "fancy": false,
            "required": false,
            "description": "",
            "group": "g_c6956005-08ba-420a-9cbc-2548a045033b",
            "row_span": 0,
            "col_span": 2,
            "span_column": false,
            "id": "items",
            "index": 2
        },
        {
            "type": "textarea",
            "value": "",
            "label": "Remarks",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_c6956005-08ba-420a-9cbc-2548a045033b",
            "row_span": null,
            "col_span": null,
            "span_column": true,
            "id": "remarks",
            "index": 6
        },
		{
            "type": "header",
            "events": {},
            "value": "",
            "label": "",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_c6956005-08ba-420a-9cbc-2548a045033b",
            "row_span": null,
            "col_span": null,
            "span_column": true,
            "id": "_8",
            "index": 8
        },
        {
            "type": "text",
            "events": {},
            "value": "",
            "label": "Prepared By:",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_c6956005-08ba-420a-9cbc-2548a045033b",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "prepared_by",
            "index": 9
        },
        {
            "type": "text",
            "events": {},
            "value": "",
            "label": "Position",
            "fancy": true,
            "required": false,
			"list":"positions",
            "description": "",
            "group": "g_c6956005-08ba-420a-9cbc-2548a045033b",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "position_prepared_by",
            "index": 10
        },
        {
            "type": "text",
            "events": {},
            "value": "",
            "label": "Approved By:",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_c6956005-08ba-420a-9cbc-2548a045033b",
            "row_span": null,
            "col_span": null,
            "span_column": false,
			"list":"common_names",
            "id": "approved_by",
            "index": 11
        },
        {
            "type": "text",
            "events": {},
            "value": "",
            "label": "Position",
            "fancy": true,
            "required": false,
            "description": "",
			"list":"positions",
            "group": "g_c6956005-08ba-420a-9cbc-2548a045033b",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "position_approved_by",
            "index": 12
        },
		{
            "type": "select",
            "events": {},
            "value": "",
            "label": "Use Custom Logo",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_c6956005-08ba-420a-9cbc-2548a045033b",
            "row_span": 0,
            "col_span": 1,
            "span_column": false,
            "id": "use_custom_logo",
			"onchange": "change_image_preview(this)",
            "index": 0
        },        
		{
            "type": "file",
            "events": {},
            "value": "",
            "config": {
                "multiple": false,
                "accept": "",
                "min": "0",
                "max": "0",
                "signatureType": false
            },
            "label": "",
            "fancy": true,
			"disabled":true,
            "required": false,
            "description": "",
            "group": "g_c6956005-08ba-420a-9cbc-2548a045033b",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "custom_images_preview",
            "index": 0
        }

    ],
    "groups": [
        {
            "name": "Group 1",
            "type": "default",
            "column_count": "2",
            "row_view": false,
            "id": "g_c6956005-08ba-420a-9cbc-2548a045033b"
        }
    ]
}