let formStructure = {
    "forms": [
        {
            "type": "header",
            "value": "Purchasing Request Form",
            "label": "",
            "fancy": false,
            "required": false,
            "description": "",
            "group": "g_d8e2e0bb-ce3e-474e-b055-7f993aa0a36d",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "_0",
            "index": 0
        },
        {
            "type": "date",
            "value": "",
            "label": "Date Required",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_d8e2e0bb-ce3e-474e-b055-7f993aa0a36d",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "date_required",
            "index": 1
        },
        {
            "type": "select",
            "value": "",
            "label": "Requesting Department",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_d8e2e0bb-ce3e-474e-b055-7f993aa0a36d",
            "row_span": null,
            "col_span": null,
            "span_column": false,
			"list":"departments",
            "id": "department_id",
            "index": 4
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
                    "Total Ammount"
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
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_d8e2e0bb-ce3e-474e-b055-7f993aa0a36d",
            "row_span": 0,
            "col_span": 2,
            "span_column": false,
            "id": "items",
            "index": 2
        },
        {
            "type": "textarea",
            "value": "",
            "label": "Purpose of Request",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_d8e2e0bb-ce3e-474e-b055-7f993aa0a36d",
            "row_span": null,
            "col_span": 2,
            "span_column": false,
            "id": "purpose_of_request",
            "index": 3
        }
    ],
    "groups": [
        {
            "name": "Group 1",
            "type": "default",
            "column_count": "2",
            "row_view": true,
            "id": "g_d8e2e0bb-ce3e-474e-b055-7f993aa0a36d"
        }
    ]
}