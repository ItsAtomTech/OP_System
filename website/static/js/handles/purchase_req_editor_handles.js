

//For Saving User
function submitForm(confirmed){
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
	
	
	if(confirmed == undefined){
		askUser("You are about to save this form entry, are you sure that all fields are correct? ",submitForm,arguments);
		return;
	}
	destroy_dia();
	
	if(confirmed != "pass"){
		return;
	}
	
	
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



let nextFormID = undefined;

function feedBackSaving(){
	let res_data = (JSON.parse(event.target.responseText));
	createDialogue("info", res_data.message);
	if(res_data.type == "success" && pageType != "update_purchase_req_editor"){
		window.setTimeout(close, 1000);
	}
	function close(){
		nextFormID = res_data.id;
		askForPrint();
	}
	localStorage.setItem("shouldReloadPurchaseReq","true");
	hasChanges = false;
}





async function askForPrint(confirmed = undefined){
	
	if(confirmed == undefined){
		askUser("Do you want to Print the Document now?",askForPrint,arguments);
		return;
	}
	destroy_dia();
	
	if(confirmed == "pass"){
		printDoc();
		await sleep(1000);
		postMessageToParent("close");
	}else{
		postMessageToParent("close");
	}
	console.log(confirmed);

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



//Printing Logics
async function printDoc(){

	//Extract the Filters to pass onto the overall printing	
	let filters_to_pass = {
		"id": nextFormID,
	}
	localStorage.setItem("printPurchaseRequest", JSON.stringify(filters_to_pass));
	showToast("Preparing Document filters ... ");
	await sleep(500);
	
	window.open('/purchase_request_print', 'printFuelRequest');
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