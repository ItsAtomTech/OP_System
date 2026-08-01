let tableFormat = [
	// {	
		// label: " "/*supposed to be checks*/,
		// data_path: ""
	// },
	{	
		label: "ID",
		data_path: "id",
		sort: true,
		// parser:parseBranch,
		
	},	
	{	
		label: "File No.",
		data_path: "fuel_requisition_no",
		sort: true,
		// parser:parseBranch,
		
	},
	{	
		label: "Plate No.",
		data_path: "vehicle_plate_no",
		sort: true,
		// parser:parseBranch,
		
	},
	{	
		label: "Requested By",
		data_path: "driver_name",
		sort: true,
		// parser:parseBranch,
		
	},
	{	
		label: "Branch",
		data_path: "branch_id",
		sort: true,
		// parser:parseBranch,
		
	},
	
	

	

];

let hiddenColumns = [];
let page = 1;

let userList;

let saveMode = "new";

function tableLoader(data){
	let resData = (JSON.parse(data.responseText));
	let forms = resData.fuel_req_files;

	
	userList = forms;
	
	let tableHeader = generateTableHeaders(false);
	_("data_generative").innerHTML = "";
	for(z=0;z < forms.length;z++){
		_("data_generative").appendChild(generateTableDataRows(forms[z],z));
	}

		function generateTableHeaders(numbered = true){
		
		let headTr = make("tr");
			headTr.className = "sticky_header padded_header primary_color_invert secondary_background small";
			
			//check columns
		let table_check = make("th");
			table_check.innerHTML = '<input class="check_input"  type="checkbox" onclick="selectAllHandle()" title="Select All"/>';
			table_check.className = "sticky_column_left secondary_background_darker check_cols primary_color_invert";
			headTr.appendChild(table_check);	
			
			
		if(numbered){
			let coln = make("th");
				coln.innerText = "#";
			headTr.appendChild(coln);
		}	
			
		
		for(each of tableFormat){
			
			//ignore hidden columns
			if(hiddenColumns.indexOf(each.label) >= 0){
				continue;
			}
			
			let tabTh = make("th");
				tabTh.innerText = each.label;
				tabTh.classList.add("minimum_width");
				headTr.appendChild(tabTh);
				
				//sortBy click
				
				if(each.sort){
					tabTh.setAttribute("onclick","sortByThis(this)");
					tabTh.setAttribute("sortname",each.data_path);
					tabTh.classList.add("sortable");
					
					if(each.order == undefined){
						tabTh.setAttribute("order","asc");
					}else{
						tabTh.setAttribute("order",each.order);
					}
					
					
					
				}
				
				
				if(each.type == "id"){
					tabTh.className = "";
				}
		}
		
		
		//check columns
		let tabAc = make("th");
			tabAc.classList.add("sticky_column_right","action_cols","secondary_background");
			tabAc.innerHTML = "Actions";
			headTr.appendChild(tabAc);	
		
		_("header_generative").innerHTML = "";
		_("header_generative").appendChild(headTr);
		
		// console.log(headTr);
	}
	
	
	
		
	function generateTableDataRows(data, index = undefined){
		let record_id = (data.id);
			let headTr = make("tr");
				headTr.classList.add("padded_colms","clickable_row");
				headTr.setAttribute("onclick","clickedOnRow("+record_id+")");
				headTr.setAttribute("data_id",record_id);
				headTr.setAttribute("code_id",data.record_id);
				
			//check columns
		let table_check = make("td");
			table_check.innerHTML = '<input class="check_input" row_selector  type="checkbox" data_id="'+record_id+'" form_id="'+data.form_data_form_id+'" onclick="selectHandle(this)" title="Select This Entry"/>';
			table_check.className = "sticky_column_left primary_background_darker check_cols";
			headTr.appendChild(table_check);
		
			if(index != undefined){
			let coln = make("td");
				coln.innerText = index+1;
				coln.classList.add("tiny","auto_width_col");
			// headTr.appendChild(coln);
		}
			
			
		
		
			for(each of tableFormat){
				
				//ignore hidden columns
				if(hiddenColumns.indexOf(each.label) >= 0){
					continue;
				}
				
				
				let tabTh = make("td");
					if(each.parser){
						tabTh.innerHTML =  each.parser(getDataFromPath(each.data_path, data));
					}else{
						tabTh.innerText = getDataFromPath(each.data_path, data);
					}
					// tabTh.classList.add("");
					
					if(each.type == "id"){
						tabTh.className = "tiny auto_width_col";
					}
					//Do Something with each of the data 
					headTr.appendChild(tabTh);
				
			
			}
			
			let tabAc = make("td");
				tabAc.className = "sticky_column_right primary_color primary_background_darker action_cols_td";
				
				//action select column td
			let action_div = make("div");
				action_div.innerHTML = "";
		
				
			if(current_role == "admin"){
										
							
				let edit_action = make("div");
					edit_action.classList.add("fa","fa-edit","flexed","df_button_flat","df_small","medium","modify","buttonize");
					edit_action.setAttribute("onclick",'loadItemToEdit("'+forms[index].id+'")');
				
					
					action_div.appendChild(edit_action);
					
					
			if(pageType == "trash"){
				
				let remove_action = make("div");
					remove_action.classList.add("fa","fa-refresh","flexed","df_button_flat","df_small","medium","remove", "buttonize");
					remove_action.setAttribute("onclick","restoreItemHelper('"+forms[index].user_id+"')");
					remove_action.setAttribute("title","Restore to Items Table");
					
					action_div.appendChild(remove_action);
					
			}else{
				
				let remove_action = make("div");
					remove_action.classList.add("fa","fa-trash","flexed","df_button_flat","df_small","medium","remove", "buttonize");
					remove_action.setAttribute("onclick","moveToTrashHelper('"+forms[index].id+"')");
					action_div.appendChild(remove_action);
					
			}
					
	
					
				}
					
				
			tabAc.appendChild(action_div);
			headTr.appendChild(tabAc);	
		return headTr;
	}
	
	function getDataFromPath(path, data) {
		const keys = path.split('.');
		let result = data;

		for (const key of keys) {
			if (result && result.hasOwnProperty(key)) {
				result = result[key];
			} else {
				return undefined; // Handle cases where the path is not valid
			}
		}

		return result;
	}
	
}




function loadAllItems(dataOnly=false){
	// qBuilder.filters.status = _("status_input").value;

	

	qBuilder.search = _("search_input").value;
	
	qBuilder.sendQuery(process);
	
	//createDialogue("wait", "Please wait...");
	if(dataOnly == true){
		createDialogue('wait', 'loading');
	}
		
	
	function process(data){
		
			tableLoader(data);
			genPages(data.responseText);
	}
}




loadAllItems();

function delayedQuerry(){
	window.setTimeout(loadAllItems(), 500);
}

function delayedExit(){

	window.setTimeout(clox_mod, 1000);
	
	function clox_mod(){

		let userForm = _('new_user_contents');
		let allElementsWithName = userForm.querySelectorAll('[name]');
		var form_data = new FormData();

		_('create_text_info').innerText = "";
		_('create_text_info').classList.remove('error');	

		for(each of allElementsWithName){
			each.value = "";
		}
		try{
			closeModalContent('add_user_modal')
			addFancyPlaceholder();
		}catch(e){
			//--
		}
		
	}
	
}


function selectType(t){
	let selections = (event.target.parentNode.getElementsByTagName('a'));
	for(each of selections){
		each.classList.remove("active");
	}
	event.target.classList.add("active");
	_("user_type").value = t;
	delayedQuerry();
	
}




function sortByThis(elm){
	let sortname = elm.getAttribute("sortname");
	for(each of tableFormat){
		if(each.data_path == sortname){
			if(each.order == undefined || each.order == "desc"){
				each.order = "asc";
			}else{
				each.order = "desc";
			}
			qBuilder.sort = sortname;
			qBuilder.order_by = each.order;
			
		}
	}
	delayedQuerry();
	// console.log(tableFormat);
	
}





function clearAll(el){
	let userForm = _(el);
	let allElementsWithName = userForm.querySelectorAll('[name]');


	for(each of allElementsWithName){
		each.value = "";
	}
	
	
}

//Open Edit View/Modal - 

function loadItemToEdit(id){
	
	let item_id = parseInt(id);	
	let params = [{"name":"crew_id", "value": item_id}];
	
	
	return showToast("Not yet implemented");
	
	//To-Do: 
	// Open using modalizer the view for Fuel Req. Form
}


function saveItem(){
	
	
	//
	
}



function feedBackSaving(){
	let res_data = (JSON.parse(event.target.responseText));
	createDialogue("info", res_data.message);
	if(res_data.type == "success" && saveMode != "edit"){
		window.setTimeout(close, 1000);
	}
	function close(){
		closeModalContent("input_modal");
	}
	localStorage.setItem("shouldReload","true");

}



function addNewEntry(){
	saveMode = "new";
	
	
	_("name").value = "";
	_("position").value = "";
	_("department").value = "";
	_("status").value = "";
	
	showModalContent('input_modal');
	
}




//Pagination Function Helpers ===
function genPages(data){
	let paginations = JSON.parse(data).pagination_data;	
	let generated = generatePagination(paginations,'paginates', 'jumpToPage');
	_("paginations") ? _("paginations").innerHTML = generated.innerHTML : false;
}

function paginates(dir){
	qBuilder.paginate(dir,true);
	delayedQuerry();
};


function jumpToPage(page_n){
	page = page_n;
	qBuilder.page = page;
	delayedQuerry();
}

function dateFormater(d){
	return utility.formatDate(d);
}


//Other functions
loadRecords = loadAllItems;
monitorChanges("shouldReload", loadAllItems);



let idSelected = undefined;
function moveToTrashHelper(id,silent=false){
	idSelected = id;
	if(silent){
		silentlyMovetoRemove(id);
		return;
	}
	
	moveToTrash();
}


function restoreItemHelper(id,silent=false){
	idSelected = id;
	if(silent){
		silentlyRestoreItem(id);
		return;
	}
	
	restoreItem();
}



function feedBackRemoving(){
	console.log(event);
	let res_data = (JSON.parse(event.target.responseText));
	createDialogue(res_data.type, res_data.message);
	
	if(res_data.type == "success"){
		localStorage.setItem("shouldReload","true");
	}	
}

function silentlyMovetoRemove(ids){
	let itemvalue = [{"name":"request_id", "value": ids}];
	qBuilder.sendQuery(doNothing,"remove_fuel_request_file",itemvalue);
	
	
}

function silentlyDeleteItem(ids){
	
	let itemvalue = [{"name":"item_id", "value": ids}];
	// qBuilder.sendQuery(doNothing,"/remove_user_permanent",itemvalue);
}

function silentlyRestoreItem(ids){
	
	console.log(ids);
	
	let itemvalue = [{"name":"item_id", "value": ids}];
	// qBuilder.sendQuery(doNothing,"/restore_item",itemvalue);
}




function moveToTrash(confirmed = undefined,silent=false){
	if(confirmed == undefined){
		askUser("Are you sure to Remove this item?",moveToTrash,arguments);
		return;
	}
	destroy_dia();
	if(confirmed == 'fail'){
		return;
	}
	let itemvalue = [{"name":"request_id", "value": idSelected}];
	qBuilder.sendQuery(feedBackRemoving,"/remove_fuel_request_file",itemvalue);
}




function moveToTrashMulti(confirmed = undefined){
	if(confirmed == undefined){
		askUser("Are you sure to move selected items to Trash?",moveToTrashMulti,arguments);
		return;
	}
	destroy_dia();
	if(confirmed == 'fail'){
		return;
	}
	
	
	let table_data = _("data_generative").getElementsByClassName("check_input");
	
	showToast("Removing Selected Item ...");
	
	for(each of table_data){
		if(each.checked){
			silentlyMovetoRemove(each.getAttribute("data_id"));
		};
	}
}




function categoryParse(id){
	return categoriesList[id];
}


//parsing status data 
function parseStatus(data){

	if(data == ""){
		return "None"
	};
	
	return data;
}


function parseDepartment(data){
	return findById(departments,data).name;
}



function doNothing(){
	localStorage.setItem("shouldReload","true");
}


//Check Functions ===
function selectAllHandle(){
	let table_data = _("data_generative").getElementsByClassName("check_input");
	let checkedStatus = event.target.checked;
	for(each of table_data){
		each.checked = checkedStatus;
	}
	toggleSelectOption(checkedStatus);
	
}

function selectHandle(){
	let hasChecks = false;
	let table_data = _("data_generative").getElementsByClassName("check_input");
	for(each of table_data){
		if(each.checked){
			hasChecks = true;
		}
	}
	
	
	toggleSelectOption(hasChecks);
}



function toggleSelectOption(visible=false){
	let options = _("selection_options").getElementsByClassName("df_button_flat");
	
	for(each of options){
		
		let tag = each.getAttribute("tag");
		if(visible && selectTypes.indexOf(tag) >= 0){
			each.classList.remove("hidden_op");
		}else{
			each.classList.add("hidden_op");
		}
		
	}
}


//Check Functions End

let targetID;
// Misc Functions ====
function clickedOnRow(elm){
	let ev = event;
	let parent_attrib = (ev.target.parentNode);
	if(!parent_attrib.getAttribute('data_id')){
		return;
	};
	
	targetID = parent_attrib.getAttribute('data_id');
	
	console.log(targetID);

	
	
	let params =  [
			{"name": "request_id" , "value": targetID},
		];
		
	qBuilder.sendQuery(generateDataView,'get_fuel_request_data_by_id',params);	
		
		

		function generateDataView(data) {
			let res_data = (JSON.parse(data.responseText));
			let fuel_req = res_data.fuel_req;
			let vehicle  = res_data.vehicle;
			let raw_json = res_data.json_data;

			try {
				raw_json = JSON.parse(raw_json);
			} catch(e) {
				raw_json = {};
			}
		
		console.log(raw_json);

			// Vehicle Info
			tag('plate_no',           _('view_stat_1'))[0].innerText = vehicle.plate_no;
			tag('vehicle_desc',       _('view_stat_1'))[0].innerText = vehicle.description;
			tag('avg_kml',            _('view_stat_1'))[0].innerText = vehicle.average_km;
			tag('capacity_l',          _('view_stat_1'))[0].innerText = vehicle.capacity_l;

			// Driver / Request Info
			tag('recent_driver',      _('view_stat_1'))[0].innerText = raw_json.recent_driver;
			tag('driver_requested_by',_('view_stat_1'))[0].innerText = fuel_req.driver_name;
			tag('branch',             _('view_stat_1'))[0].innerText = fuel_req.branch_id;
			tag('date_requested',     _('view_stat_1'))[0].innerText = utility.formatDate(fuel_req.date);
			tag('frs_number',         _('view_stat_1'))[0].innerText = fuel_req.fuel_requisition_no;
			tag('supplier_name',      _('view_stat_1'))[0].innerText = fuel_req.supplier_vendor_name;

			// Fuel Request Details
			_('view_no_of_ltrs').value    = raw_json.no_of_ltrs;
			_('view_prev_cost_ltr').value = raw_json.prev_costltr;
			_('view_total_cost').value    = (parseFloat(raw_json.no_of_ltrs) * parseFloat(raw_json.prev_costltr)).toFixed(2);

			// Odometer
			_('view_prev_odo').value = raw_json.last_fuel_recordltrs ? JSON.parse(raw_json.last_fuel_recordltrs)[0][0] : '--';
			_('view_curr_odo').value = raw_json.last_fuel_recordltrs ? JSON.parse(raw_json.last_fuel_recordltrs)[0][1] : '--';

			// Calculated Fields — pulled directly from raw_json
			_('view_dist_travelled').value    = raw_json.dist_travelled_kms    || '--';
			_('view_est_fuel_consumed').value = raw_json.est_fuel_consumed      || '--';
			_('view_actual_fuel_beg').value   = raw_json.actual_fuel_beg_l      || '--';
			_('view_actual_fuel_end').value   = raw_json.actual_fuel_endl       || '--';
			_('view_theo_end').value          = raw_json.theo_end_l             || '--';
			_('view_surplus_over').value      = raw_json.so_theoactl_end_l 
												? raw_json.so_theoactl_end_l 
												: "--";
				
				console.log(raw_json.so_theoactl_end_l);
				
			// Activity & Crew
			_('view_activity_type').value = fuel_req.activity_type;
			_('view_crew_1').value        = fuel_req.crewoccupants1;
			_('view_crew_2').value        = fuel_req.crewoccupants2;

			addFancyPlaceholder();
		}
	
	
	showModalContent("view_stat_1");
}




let selectedItemId;
function itemNotifyUpdate(data){
	
	if(!data.responseText){
		return createDialogue("error","Server Response error");
	}
	
	
	
	data = JSON.parse(data.responseText);
	
	showToast(data.message);
	// closeModalContent("modal_1");
	
}




//Printing Logics
async function printDoc(){

	//Extract the Filters to pass onto the overall printing	
	let filters_to_pass = {
		"id": targetID,
	}
	
	localStorage.setItem("printFuelRequest", JSON.stringify(filters_to_pass));
	
	showToast("Preparing Document filters ... ");
	await sleep(1200);
	
	window.open('/fuel_requisition_slip_print', 'printFuelRequest');
}



