

//For Saving User
function submitForm(){
	let values = formMaker.retriveFormInput(true);
	let params = [
		{
		"name": "purchase_data",
		"value": JSON.stringify(values),
		}
	
	];
	
	if(!validateRequired(formIdCollections)){
		return;
	};
	
	//for updating
	if(pageType == "update_purchase_req_editor"){
		let custom_params = {
		"name": "purchase_id",
		"value": getparam('id'),
		}
		
		params.push(custom_params);
		qBuilder.sendQuery(feedBackSaving,"update_purchase_request", params);
		createDialogue("wait");
		return;
	}

	
	console.log(params);
	
	qBuilder.sendQuery(feedBackSaving,"save_purchase_request", params);
	createDialogue("wait");

}





function feedBackSaving(){
	let res_data = (JSON.parse(event.target.responseText));
	createDialogue("info", res_data.message);
	if(res_data.type == "success" && pageType != "update_purchase_req_editor"){
		window.setTimeout(close, 1000);
	}
	function close(){
		postMessageToParent("close");
	}
	localStorage.setItem("shouldReloadPurchaseReq","true");
	hasChanges = false;
}









function loadForEdit(){
	let params = [
		{
		"name": "purchase_id",
		"data": getparam('id'),
		}
	];
	qBuilder.sendQuery(loadIntoForms,"get_purchase_request_by_id", params);
	
	//_("_0").value = "Update On Probation Student";
	
}


let userID = undefined;
function loadIntoForms(){
	let setdata = JSON.parse(event.target.responseText);

	
	if(setdata.type != "success"){
		return;
	}
	
	userID = current_user_id;
	
	loadEvents();	
	let datajs = setdata.purchase;
	
	let converted = {
		
		"date_required": datajs.date_required,
		"department_id": datajs.department_id,
		"approved_by": datajs.approved_by,
		"items": datajs.items,
		"requested_by": datajs.requested_by,
		"purpose_of_request": datajs.purpose_of_request,
		"date_requested": datajs.date,
		
	}
	
	
	    for (let key in converted) {
        if (converted.hasOwnProperty(key)) {
            let itemValue = converted[key];
			
			try{
				let form = formDatas.forms[formIdCollections.indexOf(key)];
					if(form.type == "date"){
						itemValue = utility.dateNormalize(itemValue);
					}
				
				setValues(key, itemValue,form);
			}catch(e){
			//	
			}
        }
    }
	addFancyPlaceholder();
}


if(pageType == "update_purchase_req_editor"){
	loadForEdit();
}


function cancelEditor(){
	if(!hasChanges){
		postMessageToParent("close");
		return;
	}
	
	
	let conf = window.confirm("Are you sure to discard your changes? ");	
	if(conf == true){
		postMessageToParent("close");
	}
}



// Handlers and Parsers

//Calculate value for each cell
function calculateTotal(elm){
	
	let el = elm.parentNode.parentNode;
	
	let totalAmmount = (el.querySelectorAll("[column_name='Total Ammount']"));
	let cost = (el.querySelectorAll("[column_name='Unit Cost']"));
	let quantity = (el.querySelectorAll("[column_name='Quantity']"));
	
	
	if(cost[0].value.length && quantity[0].value.length){		
		let calc_total = cost[0].value * quantity[0].value;
			
			totalAmmount[0].value = calc_total;
			console.log(totalAmmount[0].value);
			
			tableGroupsUpdate(table_items_,items);
	}	
	//console.log(totalAmmount, cost, quantity);
	
}