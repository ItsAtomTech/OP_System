

//For Saving User
function submitForm(){
	let values = formMaker.retriveFormInput(true);
	let params = [
		{
		"name": "form_data",
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
		qBuilder.sendQuery(feedBackSaving,"", params);
		createDialogue("wait");
		return;
	}

	
	console.log(params);
	
	qBuilder.sendQuery(feedBackSaving,"save_fuel_req", params);
	createDialogue("wait");

}




function feedBackSaving(data){
	let res_data = (JSON.parse(event.target.responseText));
	createDialogue("info", res_data.message);
	if(res_data.type == "success" && pageType != "edit_purchase_request"){
		window.setTimeout(close, 1000);
	}
	
	function close(){
		nextFormID = res_data.id;
		askForPrint();
	}
	localStorage.setItem("shouldReloadRequests","true");
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
		"name": "request_id",
		"data": getparam('id'),
		}
	];
	qBuilder.sendQuery(loadIntoForms,"", params);
	
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


let FUEL_CAPACITY = null;
let MAX_FUEL_CAP = null;

//Other Essential Functions
function loadRecentData(elm){
	
	let vehicle_id = (elm.value);
	let custom_param = [
		{"name": "plate_no", value: vehicle_id},
	];		
	
	if(isNaN(vehicle_id) || vehicle_id.length <= 0){
		return;
	}
	
	qBuilder.sendQuery(proccess,"get_latest_fuel_req_by_vehicle", custom_param);
	
	
	function proccess(data){
		let setdata = JSON.parse(event.target.responseText);
		
		if(setdata.type != "success"){
			return createDialogue("error",setdata.message);
		}
		
		
		// console.log(setdata.latest_fuel_req);
		
		//Proccess Vehicle Details
		_("vehicle_description").value = setdata.vehicle.description;
		_("average_kml").value = setdata.vehicle.average_km;
		
		FUEL_CAPACITY = setdata.vehicle.capacity_l;
		
		console.log();
		
		
		if(setdata.has_recent){
		
			_("recent_driver").value = setdata.latest_fuel_req.driver_name;
			_("last_fuel_date").value = utility.dateNormalize(setdata.latest_fuel_req.date);
			
			_("last_fuel_issuedltrs").value = setdata.latest_fuel_req.no_of_ltrs;
			
			_("prev_costltr").value = setdata.latest_fuel_req.prev_costltr
			_("actual_fuel_beg_l").value = setdata.latest_fuel_req.actual_fuel_endl
			
			console.log(setdata.vehicle);
			

			processOPrevOdo(setdata.latest_fuel_req.last_fuel_recordltrs);
			
			
			
		}else{
			
			_("last_fuel_date").value = "";
			_("recent_driver").value = "";	
			_("last_fuel_issuedltrs").value = "";
			
			processOPrevOdo("");
		
		}
		
		generateReqNo(setdata.next_id);
		calculateDistTravelled();
		
		addFancyPlaceholder();
	}
	
}



let nextFormID = undefined;
function generateReqNo(data){
	
	let year = getCurrentYear();
	let nom = utility.addZeros(data);
	let str = "FRN-"+ year + "-" + nom;
	
	_("fuel_requisition_no").value = str;
	nextFormID = data;
}



function calculateDistTravelled(elm){
	
	let tableValue = _("last_fuel_recordltrs").value;
	if (!tableValue) return; 
	let odoData = JSON.parse(tableValue)[0];
	
	
	let calculation = odoData[1] - odoData[0];
	_("dist_travelled_kms").value = calculation;
	
	calculateEstFuelConsumed();
	calculateSOEnd();
	addFancyPlaceholder();
	
	// console.log(odoData, calculation);	
}


function processOPrevOdo(data){
	
	
	try{
		let odoData = JSON.parse(data)[0]
		let prevData = odoData[1];
		let currentData = "";
		
		let tableValue = _("last_fuel_recordltrs").value;
		let CurrentodoData = JSON.parse(tableValue)[0]
		if(CurrentodoData[1].length){
			currentData = CurrentodoData[1];
		}
		
		
		let partData = [[prevData, currentData]];
		
		setValues("last_fuel_recordltrs",JSON.stringify(partData),formDatas.forms[formIdCollections.indexOf("last_fuel_recordltrs")])
		
	}catch(e){
		
		let partData = [['', '']];
		setValues("last_fuel_recordltrs",JSON.stringify(partData),formDatas.forms[formIdCollections.indexOf("last_fuel_recordltrs")])
		
		//
	}
	
	
}


function calculateEstFuelConsumed(elm){
	
	let distTravel = _("dist_travelled_kms").value;
	let averageKM = _("average_kml").value;
	
	
	_("est_fuel_consumed").value = (distTravel / averageKM).toFixed(2);
	
	
	return;
	
	console.log(_("est_fuel_consumed").value);
	
	
}




function calculateTheoEnd(){
	
	let calculatedValue;
	
	let a = parseFloat(_("actual_fuel_beg_l").value);
	let b = (_("last_fuel_issuedltrs").value).length ?  parseFloat(_("last_fuel_issuedltrs").value): 0  ;
	
	// console.log(b);	
	
	let c = parseFloat(_("est_fuel_consumed").value);
	
	calculatedValue = (a + b) - c;
		
	_("theo_end_l").value = calculatedValue;
	
	
	proccessFuelWarn(calculatedValue, FUEL_CAPACITY);
	
	
	calculateSOEnd();
	
	addFancyPlaceholder();
}



function calculateSOEnd(){
	
	let calculatedValue;
	
	let a = parseFloat(_("actual_fuel_endl").value);
	let b = parseFloat(_("theo_end_l").value);
	
	
	calculatedValue = (a - b);
	
	
	_("so_theoactl_end_l").value = calculatedValue;
	addFancyPlaceholder();
	
}




function proccessFuelWarn(calculatedValue, FUEL_CAPACITY){
	
	let fuelToInput = (_("no_of_ltrs").value).length ? parseFloat(_("no_of_ltrs").value): 0;
	
	let cap = FUEL_CAPACITY - calculatedValue;
	
	if(fuelToInput <= 0){
		return;
	}
	

	if(parseFloat(fuelToInput) > parseFloat(cap)){			
		showToast("You appear to have entered a Fuel \n beyond your maximum tank capacity" + "\n cap is: "+ cap +"L");	
	}
};




//Printing Logics
async function printDoc(){

	//Extract the Filters to pass onto the overall printing	
	let filters_to_pass = {
		"id": nextFormID,
	}
	localStorage.setItem("printFuelRequest", JSON.stringify(filters_to_pass));
	showToast("Preparing Document filters ... ");
	await sleep(500);
	
	window.open('/fuel_requisition_slip_print', 'printFuelRequest');
}
