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
		label: "Plate No.",
		data_path: "plate_no",
		sort: true,
		// parser:parseBranch,
		
	},
	{	
		label: "Description",
		data_path: "description",
		sort: true,
		// parser:parseBranch,
		
	},
	{	
		label: "Fuel Capacity (L)",
		data_path: "capacity_l",
		sort: true,
		// parser:parseBranch,
		
	},
	{	
		label: "Average Km/L",
		data_path: "average_km",
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
	let forms = resData.vehicles;

	
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
				headTr.setAttribute("code_id",record_id);
				
			//check columns
		let table_check = make("td");
			table_check.innerHTML = '<input class="check_input" row_selector  type="checkbox" data_id="'+data.user_id+'" form_id="'+data.form_data_form_id+'" onclick="selectHandle(this)" title="Select This Entry"/>';
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
	let params = [{"name":"vehicle_id", "value": item_id}];
	
	qBuilder.sendQuery(openModal,"/get_vehicle_by_id",params);
	
	
	function openModal(data){
		
		let res_data = (JSON.parse(data.responseText));
			selectedItemId = id;
		if(res_data.type == "success"){
			
			// console.log(res_data.student);
			showModalContent('vehicle_modal');
			
			res_data = res_data.vehicle;
					
			_("plate_no").value = res_data.plate_no;
			_("description").value = res_data.description;
			_("average_km").value = res_data.average_km;
			_("capacity_l").value = parseFloat(res_data.capacity_l);
							
			
			addFancyPlaceholder();
			saveMode = "edit";
			
		}else{
			createDialogue("error", res_data.message);
		}
	}
}


function saveItem(){
	let params = [
	{
		"name": "plate_no",
		"value": _("plate_no").value,
	},
	{
		"name": "description",
		"value": _("description").value,
	},
	{
		"name": "capacity_l",
		"value": _("capacity_l").value,
		
		
	},
	{
		"name": "average_km",
		"value": _("average_km").value,
		
		
	}];
	
		//for updating
	if(saveMode == "edit"){
		let custom_params = {
		"name": "vehicle_id",
		"value": selectedItemId,
		}
		
		params.push(custom_params);
		qBuilder.sendQuery(feedBackSaving,"update_vehicle", params);
		createDialogue("wait");
		return;
	}
	
	
	
	qBuilder.sendQuery(feedBackSaving,"save_vehicle",params);
	localStorage.setItem("shouldReload","true");
	
}



function feedBackSaving(){
	let res_data = (JSON.parse(event.target.responseText));
	createDialogue("info", res_data.message);
	if(res_data.type == "success" && saveMode != "edit"){
		window.setTimeout(close, 1000);
	}
	function close(){
		closeModalContent("vehicle_modal");
	}
	localStorage.setItem("shouldReload","true");

}



function addNewEntry(){
	saveMode = "new";
	
	
	_("plate_no").value = "";
	_("description").value = "";
	_("average_km").value = "0.0";
	_("capacity_l").value = 0;
	
	showModalContent('vehicle_modal');
	
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
	let itemvalue = [{"name":"subject_id", "value": ids}];
	qBuilder.sendQuery(doNothing,"remove_subject",itemvalue);
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
	let itemvalue = [{"name":"vehicle_id", "value": idSelected}];
	qBuilder.sendQuery(feedBackRemoving,"/remove_vehicle",itemvalue);
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


// Misc Functions ====
let qBuilder2 = deepCloneWithFunctions(qBuilder);

function clickedOnRow(id){
	let ev = event;
	let parent_attrib;
	try{
		parent_attrib = (ev.target.parentNode);
	}catch(e){
		parent_attrib = {};
	}
	
	
	let dataId = id;

	

	console.log(dataId);
	
	let params = [
		{"name": "vehicle_id", "value": dataId},	
	];
	
	
		qBuilder2.sendQuery(generateDataView,'get_fuel_s_o',params);	
		selectedItemId = dataId;

}

let selectedItemId;



function generateDataView(data) {
			let res_data = JSON.parse(data.responseText);
			let s_list   = res_data.s;
			let o_list   = res_data.o;
			let pagination = res_data.pagination;
			
			console.log(res_data);
			
			
			if(s_list.length  == 0 && o_list.length == 0){
				showToast("This vehicle has no history yet!");
				closeModalContent("view_stat_1");
				return;
			}
			
			// Vehicle Info
			tag('plate_no',     _('view_stat_1'))[0].innerText = res_data.vehicle.plate_no      || '--';
			tag('vehicle_desc', _('view_stat_1'))[0].innerText = res_data.vehicle.description   || '--';
			tag('capacity_l',   _('view_stat_1'))[0].innerText = res_data.vehicle.capacity_l    || '--';
			tag('avg_kml',      _('view_stat_1'))[0].innerText = res_data.vehicle.average_km    || '--';

			
			
			// Clear tables first
			_('shortage_table_body').innerHTML = '';
			_('over_table_body').innerHTML     = '';

			// Shortage Table
			let shortage_total = 0;
			if (s_list.length === 0) {
				_('shortage_table_body').innerHTML = '<tr><td colspan="4" class="centered small">No shortage records found.</td></tr>';
			} else {
				s_list.forEach(record => {
					let row = document.importNode(_('shortage_row_template').content, true);
					tag('frs_no',      row)[0].innerText = record.fuel_requisition_no || '--';
					tag('driver_name', row)[0].innerText = record.driver_name         || '--';
					tag('so_value',    row)[0].innerText = Math.abs(record.so_theoactl_end_l)   || '--';
					
					
					tag('date',        row)[0].innerText = record.date                || '--';
					
					_('shortage_table_body').appendChild(row);
					shortage_total += parseFloat(record.so_theoactl_end_l) || 0;
				});
			}
			tag('shortage_total', _('view_stat_1'))[0].innerText = Math.abs(shortage_total.toFixed(2));

			// Over Table
			let over_total = 0;
			if (o_list.length === 0) {
				_('over_table_body').innerHTML = '<tr><td colspan="4" class="centered small">No over records found.</td></tr>';
			} else {
				o_list.forEach(record => {
					let row = document.importNode(_('over_row_template').content, true);
					tag('frs_no',      row)[0].innerText = record.fuel_requisition_no || '--';
					tag('driver_name', row)[0].innerText = record.driver_name         || '--';
					tag('so_value',    row)[0].innerText = "("+record.so_theoactl_end_l + ")"   || '--';
					tag('date',        row)[0].innerText = record.date                || '--';
					_('over_table_body').appendChild(row);
					over_total += parseFloat(record.so_theoactl_end_l) || 0;
				});
			}
			tag('over_total', _('view_stat_1'))[0].innerText = "("+ over_total.toFixed(2) +")";

			// Pagination
			let pag_html = '';
			
			
			let generated = generatePagination(pagination,'paginatesSub', 'jumpToPageSub');
			
			console.log(generated);
			
			_('so_pagination').innerHTML = generated.innerHTML || '';

		showModalContent("view_stat_1");
}
		
		


		
function jumpToPageSub(page_n){
	page = page_n;
	
	let params = [
		{"name": "vehicle_id", "value": selectedItemId},	
		{"name": "page", "value": page},	
	];
	
	
	qBuilder2.sendQuery(generateDataView,'get_fuel_s_o',params);	
}



function paginatesSub(dir){
	qBuilder2.paginate(dir,true);
		let params = [
		{"name": "vehicle_id", "value": selectedItemId},	

	];
	
	qBuilder2.sendQuery(generateDataView,'get_fuel_s_o', params);	
};


function itemNotifyUpdate(data){
	
	if(!data.responseText){
		return createDialogue("error","Server Response error");
	}
	
	data = JSON.parse(data.responseText);
	
	showToast(data.message);
	// closeModalContent("modal_1");
	
}



