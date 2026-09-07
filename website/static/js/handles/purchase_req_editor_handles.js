

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





async function loadForEdit(){
	let params = [
		{
		"name": "purchase_id",
		"data": getparam('id'),
		}
	];
	
	await qBuilder.sendPromise(proccessDataForCustomLogo,"get_logo_assets");
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
	
	
	let custom_logo = datajs.misc;
	
	try{
		custom_logo = JSON.parse(custom_logo);
		custom_logo = custom_logo.custom_logo;
	}catch(e){
		custom_logo = undefined;
	}
	
	
	
	let converted = {
		
		"date_required": datajs.date_required,
		"department_id": datajs.department_id,
		"approved_by": datajs.approved_by,
		"items": datajs.items,
		"requested_by": datajs.requested_by,
		"purpose_of_request": datajs.purpose_of_request,
		"date_requested": datajs.date,
		"company_id": datajs.company_id,
		"use_custom_logo": custom_logo,
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
}else{
	qBuilder.sendQuery(proccessDataForCustomLogo,"get_logo_assets");
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

	
	

//Misc Function
	
function proccessDataForCustomLogo(data){
	let res_data = (JSON.parse(data.responseText));
	
	if(res_data.files.length >= 1){
		_("use_custom_logo").innerHTML = "";
		let empty = make("option");
		
		
		_("use_custom_logo").appendChild(empty);
		
		for (each of res_data.files){
			let option = make("option");	
				option.innerText = each;
				_("use_custom_logo").appendChild(option);
		}
		
	}
}
	

function proccessCustom_image_previewPatch(){
	let prev_container = _("custom_images_preview").parentElement.parentElement;
		prev_container.innerHTML = "";
	
	let imagePreview = make("img");
		imagePreview.classList.add("custom_image_preview");
		imagePreview.id = "custom_image_preview";
	
	
	
		prev_container.appendChild(imagePreview);

	console.log(prev_container);

}	
proccessCustom_image_previewPatch();



//helper for getting the preview image
function change_image_preview(elm){
	let value = elm.value;
	
	
	_("custom_image_preview").src = STATIC_IMAGE_LINK + "/logos/" + value;
	
	console.log(elm);
}