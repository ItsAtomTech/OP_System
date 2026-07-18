

//For Saving User
function saveUser(){
	let values = formMaker.retriveFormInput(true);
	let params = [
		{
		"name": "user_data",
		"value": JSON.stringify(values),
		}
	
	];
	
	if(!validateRequired(formIdCollections)){
		return;
	};
	
	//for updating
	if(pageType == "edit_user"){
		let custom_params = {
		"name": "user_id",
		"value": userID,
		}
		
		params.push(custom_params);
		qBuilder.sendQuery(feedBackSaving,"save_user_update", params);
		createDialogue("wait");
		return;
	}
	
	if(_('password').value != _('repassword').value){
		createDialogue("error", "Password not matched!");
		return;
	}
	
	qBuilder.sendQuery(feedBackSaving,"save_user", params);
	createDialogue("wait");

}





function feedBackSaving(){
	let res_data = (JSON.parse(event.target.responseText));
	createDialogue("info", res_data.message);
	if(res_data.type == "success" && pageType != "edit_user"){
		window.setTimeout(close, 1000);
	}
	function close(){
		postMessageToParent("close");
	}
	localStorage.setItem("shouldReloadUsers","true");
	hasChanges = false;
}





function loadForEdit(){
	let params = [
		{
		"name": "user_id",
		"data": getparam('id'),
		}
	];
	qBuilder.sendQuery(loadIntoForms,"get_user_by_id", params);
	
}

let userID = undefined;
function loadIntoForms(){
	let setdata = JSON.parse(event.target.responseText);
	
	if(setdata.type != "success"){
		return;
	}
	
	userID = getparam('id');
	
	loadEvents();	
	let datajs = setdata.user;
	
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
	toggleDepColFields(_("type"));
	
}


if(pageType == "edit_user"){
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


// ======================
//Custom Events goes here
// ======================
function toggleDepColFields(elm){
	let fieldValue = elm.value;
	let college_elm = _("college").parentNode.parentNode;
	let department_elm = _("department").parentNode.parentNode;
	
	college_elm.style.display = "none";

	if(fieldValue == 2 || fieldValue == 5){
		college_elm.style.display = "initial";
		college_elm.classList.remove("disabled");	
		department_elm.style.display = "none";
	}else if(fieldValue == 3){
		college_elm.style.display = "none";
		department_elm.style.display = "initial";
		department_elm.classList.remove("disabled");	
	}else{
		college_elm.classList.add("disabled");
		department_elm.classList.add("disabled");
	}
	
	
}

toggleDepColFields({value: 1});


