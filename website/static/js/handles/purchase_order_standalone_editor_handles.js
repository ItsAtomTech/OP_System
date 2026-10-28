let common_designations = [];



//For Saving User
function submitForm(confirmed){
	let values = formMaker.retriveFormInput(true);
	
	values["order_id"] = getparam('order_id');

	
	let params = [
		{
		"name": "order_data",
		"value": JSON.stringify(values),
		}
	
	];
	
	if(!validateRequired(formIdCollections)){
		return;
	};
	
	
	if(confirmed == undefined){
		askUser("You are about to save this data entry, are you sure that all fields are correct? ",submitForm,arguments);
		return;
	}
	destroy_dia();
	
	if(confirmed != "pass"){
		return;
	}
	
	//add to common desigs
	addCommonDesig(_("position_prepared_by").value);
	addCommonDesig(_("position_approved_by").value);
	
	
	//for updating
	if(pageType == "purchase_order_edit_standalone"){
		let custom_params = {
		"name": "order_id",
		"value": getparam('order_id'),
		}
		
		params.push(custom_params);
		qBuilder.sendQuery(feedBackSaving,"update_purchase_order_standalone", params);
		localStorage.setItem("shouldReloadPurchaseOrderModal","true");
		createDialogue("wait");
		return;
	}

	
	console.log(params);
	
	qBuilder.sendQuery(feedBackSaving,"save_purchase_order_standalone", params);
	localStorage.setItem("shouldReloadPurchaseOrderModal","true");
	createDialogue("wait");

}



let nextFormID = undefined;

function feedBackSaving(){
	let res_data = (JSON.parse(event.target.responseText));
	createDialogue("info", res_data.message);
	if(res_data.type == "success" && pageType != "purchase_order_edit_standalone"){
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



async function makeLatestPoId(){
	await qBuilder.sendPromise(makePO,"get_lastest_standalone_order_id");
	
	function makePO(data){
		let setdata = JSON.parse(data.responseText);
		_("po_no").value = utility.addZeros(parseInt(setdata.count) + 1, 5);
		
		addFancyPlaceholder(["po_no"])
	}
}



async function loadForEdit(){
	let params = [	
		{
		"name": "order_id",
		"data": getparam('order_id'),
		},
	];
	
	
	await qBuilder.sendPromise(proccessDataForCustomLogo,"get_logo_assets");
	qBuilder.sendQuery(loadIntoForms,"get_order_by_id_standalone", params);
	
	//_("_0").value = "Update On Probation Student";
}


function monitorPOValue(elm){
	let elmVal = elm.value;
	
	
	if(elm.value.trim().length <= 0){
		
		if(pageType == "purchase_order_edit_standalone"){
			elm.value = loadedPO;
			// elm.disabled = true;
		}else{
			makeLatestPoId();
		}
		
	};
	
}

let userID = undefined;
let loadedPO = undefined;
function loadIntoForms(){
	let setdata = JSON.parse(event.target.responseText);

	
	if(setdata.type != "success"){
		return;
	}
	

	userID = current_user_id;
	
	loadEvents();	
	let datajs = setdata.purchase;
	let datajs_order = setdata.order;
	let raw_json = JSON.parse(setdata.order.json_data);
	
	let custom_logo = setdata.order['misc'];
	
	try{
		custom_logo = JSON.parse(custom_logo);
		custom_logo = custom_logo.custom_logo;
	}catch(e){
		custom_logo = undefined;
	}
	
		
	if(setdata.order.status == "processed"){
		loadForms(1,0,1,1);	
		showToast("The form is now readonly!");
		
		_("submitButton").remove();
		
	}
	
	if (datajs_order.po_no) loadedPO = datajs_order.po_no;

	
	let converted = {
		
		"po_no": datajs_order.po_no,
		"supplier_name": datajs_order.supplier_name,
		"supplier_address": datajs_order.supplier_address,
		"contact_person": datajs_order.contact_person,
		"payment_terms": datajs_order.payment_terms,
		"supplier_contact_number": datajs_order.supplier_contact_number,
		"remarks": datajs_order.remarks,
		"prepared_by": datajs_order.prepared_by,
		"approved_by": datajs_order.approved_by,
		"position_prepared_by": raw_json.position_prepared_by,
		"position_approved_by": raw_json.position_approved_by,
		
		
		"department_id": datajs_order.department_id,
		"items": datajs_order.items,
		"requested_by": datajs_order.requested_by,
		"purpose_of_request": datajs_order.purpose_of_request,
		"date_requested": datajs_order.date,
		"company_id": datajs_order.company_id,
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



if(pageType == "purchase_order_edit_standalone"){
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

async function printDoc (){

	//Extract the Filters to pass onto the overall printing	
	let filters_to_pass = {
		"id": getparam('id'),  //purhcase_request id
		"order_id":nextFormID,
	}
	
	localStorage.setItem("printPurchaseOrder", JSON.stringify(filters_to_pass));
	
	showToast("Preparing Document filters ... ");
	await sleep(1200);
	
	window.open('/purchase_order_print', 'printPurchaseOrder');
}




// Handlers and Parsers

//Calculate value for each cell
function calculateTotal(elm){
	
	let el = elm.parentNode.parentNode;
	
	let totalAmmount = (el.querySelectorAll("[column_name='Total Amount']"));
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
	
	res_data.files.sort(); 
	
	
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

}	
proccessCustom_image_previewPatch();



//helper for getting the preview image
function change_image_preview(elm){
	let value = elm.value;
	
	
	_("custom_image_preview").src = STATIC_IMAGE_LINK + "/logos/" + value;
	
}



// Load and save logic for Common Designations on local storage
function loadCommonDesig(){
	let com = localStorage.getItem("COMMON_DESIG");
	if(!com){
		return;
	}
	try{
		common_designations = JSON.parse(localStorage.getItem("COMMON_DESIG"));
		return;
	}catch(e){
		//--
	}
	common_designations = [];
}

loadCommonDesig();



function addCommonDesig(str) {
    if (!str || str.length <= 1) {
        return console.warn("Empty value was ignored");
    }

    let index = common_designations.indexOf(str);
    if (index !== -1) {
        common_designations.splice(index, 1);
    }
    common_designations.push(str);

    if (common_designations.length > 50) {
        common_designations.shift();
    }
    localStorage.setItem("COMMON_DESIG", JSON.stringify(common_designations));
}



function loadToDatalist() {
  if (!_("positions")) {
    return;
  }

  for (let each of common_designations) {

    if (isStringInDatalist(each)) {
      continue;
    }

    let options = make("option");
    options.innerText = each;
    _("positions").appendChild(options);
  }
}


function isStringInDatalist(inputString) {
  let datalist = _("positions");

  if (datalist) {
    let options = datalist.getElementsByTagName('option');
    for (let i = 0; i < options.length; i++) {
      if (options[i].innerText === inputString) {
        return true;
      }
    }
  }
  return false;
}

loadToDatalist();
