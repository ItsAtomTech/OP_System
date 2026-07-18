let activityForm = {
    "forms": [
        {
            "type": "header",
            "value": "Assesment Editor",
            "label": "",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_de19ecbb-60d4-499c-b071-373b2806d61e",
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
            "label": "Assesment Name",
            "fancy": true,
            "required": true,
            "description": "",
            "group": "g_de19ecbb-60d4-499c-b071-373b2806d61e",
            "row_span": 0,
            "col_span": 0,
            "span_column": false,
            "id": "name",
            "index": 1
        },
        {
            "type": "select",
            "value": "",
            "label": "Category",
            "fancy": true,
            "required": true,
            "description": "",
            "group": "g_de19ecbb-60d4-499c-b071-373b2806d61e",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "list": "categories",
            "id": "category",
            "index": 2
        },
        {
            "type": "select",
            "value": "",
            "items": [],
            "label": "Assesment Type",
            "fancy": true,
            "list":"activity_type",
            "required": true,
            "description": "",
            "group": "g_de19ecbb-60d4-499c-b071-373b2806d61e",
            "eventlist": [
                "ev_a6485669-b176-4a07-8036-2a442738b2fe",
                "ev_fad6d855-6b89-41aa-b39b-ee288dd6c984",
                "ev_55b40499-6336-4105-8c8e-d5f6238cf5a8",
                "ev_d79a0ac7-16f9-4eae-8040-b6f08781eb19"
            ],
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "assesment_type",
            "index": 3
        },
        {
            "type": "select",
            "value": "",
            "label": "Difficulty",
            "list": "difficulty",
            "fancy": true,
            "required": true,
            "description": "",
            "group": "g_de19ecbb-60d4-499c-b071-373b2806d61e",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "difficulty",
            "index": 4
        },
        {
            "type": "number",
            "value": "",
            "label": "Semester",
            "fancy": true,
            "required": true,
            "description": "",
            "group": "g_de19ecbb-60d4-499c-b071-373b2806d61e",
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "list":'quarter_list',
            "id": "quarter",
            "index": 2
        },
        {
            "type": "textarea",
            "value": "",
            "label": "Assessment Question",
            "fancy": true,
            "required": true,
            "description": "",
            "group": "g_de19ecbb-60d4-499c-b071-373b2806d61e",
            "eventlist": [
            ],
            "row_span": null,
            "col_span": null,
            "span_column": true,
            "id": "activity_prompt",
            "index": 6
        },
        
        {
            "type": "textarea",
            "events": {
                "eventname": "ev_a6485669-b176-4a07-8036-2a442738b2fe",
                "type": "showon",
                "targetIndex": "3",
                "value": "coding",
                "condition": ""
            },
            "value": "\n\n\n\n\n\n",
            "label": "Code Input",
            "fancy": false,
            "required": false,
            "description": "",
            "group": "g_de19ecbb-60d4-499c-b071-373b2806d61e",
            "row_span": null,
            "col_span": null,
            "span_column": true,
            "id": "code_input",
            "index": 5
        },

        {
            "type": "textarea",
            "events": {
                "eventname": "ev_fad6d855-6b89-41aa-b39b-ee288dd6c984",
                "type": "showon",
                "targetIndex": "3",
                "value": "coding",
                "condition": ""
            },
            "value": "",
            "label": "Expected Output",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_de19ecbb-60d4-499c-b071-373b2806d61e",
            "eventlist": [
            ],
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "expected_output",
            "index": 7
        },
        {
            "type": "textarea",
            "events": {
                "eventname": "ev_55b40499-6336-4105-8c8e-d5f6238cf5a8",
                "type": "showon",
                "targetIndex": "3",
                "value": "coding",
                "condition": ""
            },
            "value": "",
            "label": "Code Requirements",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "g_de19ecbb-60d4-499c-b071-373b2806d61e",
            "eventlist": [
            ],
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "custom_check_prompt",
            "index": 8
        },
        {
            "type": "table",
            "events": {
                "eventname": "ev_d79a0ac7-16f9-4eae-8040-b6f08781eb19",
                "type": "showon",
                "targetIndex": "3",
                "value": "multiple",
                "condition": ""
            },
            "value": "",
            "config": {
                "config": {
                    "min": "0",
                    "max": "0",
                    "custom_row": true,
                    "row_count": "1"
                },
                "items": [
                    "Choice",
                    "Correct"
                ],
                "itemsConfig": [
                    {
                        "type": "text",
                        "attributes": {},
                        "required": true
                    },
                    {
                        "type": "select",
                        "attributes": {
                            "items": [
                                "false",
                                "true"
                            ]
                        },
                        "required": true
                    }
                ],
                "rowed": true,
                "fullspan": true,
                "responsivespan": true
            },
            "rowed": true,
            "fullspan": true,
            "responsivespan": true,
            "label": "Choices",
            "fancy": true,
            "required": false,
            "description": "",
            "group": "none",
            "eventlist": [

            ],
            "row_span": null,
            "col_span": null,
            "span_column": false,
            "id": "choices",
            "index": 9
        }
    ],
    "groups": [
        {
            "name": "Group 1",
            "type": "default",
            "column_count": "2",
            "row_view": false,
            "id": "g_de19ecbb-60d4-499c-b071-373b2806d61e"
        }
    ]
}