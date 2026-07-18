

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
	if(pageType == "edit_request"){
		let custom_params = {
		"name": "request_id",
		"value": getparam('request_id'),
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
	if(res_data.type == "success" && pageType != "edit_purchase_request"){
		window.setTimeout(close, 1000);
	}
	function close(){
		postMessageToParent("close");
	}
	localStorage.setItem("shouldReloadRequests","true");
	hasChanges = false;
}









function loadForEdit(){
	let params = [
		{
		"name": "request_id",
		"data": getparam('id'),
		}
	];
	qBuilder.sendQuery(loadIntoForms,"get_purchase_request", params);
	
	//_("_0").value = "Update On Probation Student";
	
}

let userID = undefined;
function loadIntoForms(){
	let setdata = JSON.parse(event.target.responseText);
	
	console.log(setdata);
	
	if(setdata.type != "success"){
		return;
	}
	
	userID = current_user_id;
	
	loadEvents();	
	let datajs = setdata.student;
	
	    for (let key in datajs) {
        if (datajs.hasOwnProperty(key)) {
            let itemValue = datajs[key];
			
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


if(pageType == "edit_student"){
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




