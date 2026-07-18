

//For Saving Config
function saveChangesToConfig(){
	let values = {
		"months": _("number_of_months").value,
		"month_1st_sem": _("month_first").value,
		"month_2nd_sem": _("month_second").value,
		"summer_count": _("summer_count").value,
		"month_summer": _("month_summer").value,
		"number_of_years": _("number_of_years").value,
		
	}
	let params = [
		{
		"name": "config_data",
		"value": JSON.stringify(values),
		}
	
	];
	
	
	if(!validateRequired(formIdCollections)){
		return;
	};
	
	
	qBuilder.sendQuery(feedBackSaving,"save_config", params);
	createDialogue("wait");

}





function feedBackSaving(){
	let res_data = (JSON.parse(event.target.responseText));
	createDialogue("info", res_data.message);
	

}





function loadForEdit(){
	let params = [
		{
		"name": "sample",
		"data": "",
		}
	];
	qBuilder.sendQuery(loadIntoForms,"get_config", params);
	
}


function loadIntoForms(){
	let setdata = JSON.parse(event.target.responseText);
	
	
	if(setdata.type != "success"){
		return;
	}
	let datajs = setdata.data;
	
	_("number_of_months").value = datajs['months'];
	_("month_first").value = datajs['month_1st_sem'];
	_("month_second").value = datajs['month_2nd_sem'];
	_("month_summer").value = datajs['month_summer'];
	_("summer_count").value = datajs['summer_count'];
	_("number_of_years").value = datajs['number_of_years'];
	
	
	addFancyPlaceholder();
	
}


loadForEdit();




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



function calculateSecondSemMonth() {
    const numMonths = parseInt(_("number_of_months").value) || 0;
    const firstMonth = parseInt(_("month_first").value) || 0;

    if (!numMonths || !firstMonth) return;

    let secondMonth = firstMonth + numMonths;
    if (secondMonth > 12) secondMonth = secondMonth - 12;

    _("month_second").value = secondMonth;
	
	addFancyPlaceholder();
}


