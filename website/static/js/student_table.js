let tableFormat = [
	// {	
		// label: " "/*supposed to be checks*/,
		// data_path: ""
	// },
	{	
		label: "ID",
		data_path: "student_id",
		sort: true,
		// parser:parseBranch,
		
	},	
	{	
		label: "Student Name",
		data_path: "student_name",
		sort: true,
		parser:obfuscateText,
		
	},	
	{	
		label: "College",
		data_path: "college_name",
		sort: true,
		// parser:parseBranch,
		
	},
	{	
		label: "Program",
		data_path: "department",
		sort: true,
		// parser:parseBranch,
		
	},	
	{	
		label: "Subject",
		data_path: "subject_name",
		sort: true,
		// parser:parseBranch,
		
	},
	{	
		label: "Intructor Assigned",
		data_path: "instructor_name",
		sort: true,
		// parser:parseBranch,
		
	},
	{	
		label: "Current Status",
		data_path: "status",
		sort: true,
		parser:parseStatus,
		
	},	
	{	
		label: "Date",
		data_path: "date",
		sort: true,
		parser: utility.formatDate,
		
	},

		

];

let hiddenColumns = [];
let page = 1;

let userList;


if(current_user_role == "3"){
	//user is Department Chair, defaults to assigned department
	if(_("department")){
		_("department").value = current_user_department;
	}
}


function tableLoader(data){
	let resData = (JSON.parse(data.responseText));
	let forms = resData.students;
	
	
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
		let record_id = (data.student_id);
			let headTr = make("tr");
				headTr.classList.add("padded_colms","clickable_row");
				headTr.setAttribute("onclick","clickedOnRow("+record_id+")");
				headTr.setAttribute("data_id",record_id);
				headTr.setAttribute("code_id",data.code);
				
			//check columns
		let table_check = make("td");
			table_check.innerHTML = '<input class="check_input" row_selector  type="checkbox" data_id="'+data.student_id+'" form_id="'+data.student_id+'" onclick="selectHandle(this)" title="Select This Entry"/>';
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
					edit_action.setAttribute("onclick",'loadItemToEdit("'+forms[index].student_id+'")');
				
					
					if(forms[index].progress == "" || forms[index].progress == "on_probation" ) action_div.appendChild(edit_action);
					
					
			if(pageType == "trash"){
				
				let remove_action = make("div");
					remove_action.classList.add("fa","fa-refresh","flexed","df_button_flat","df_small","medium","remove", "buttonize");
					remove_action.setAttribute("onclick","restoreItemHelper('"+forms[index].student_id+"')");
					remove_action.setAttribute("title","Restore to Items Table");
					
					if(forms[index].progress == "") action_div.appendChild(remove_action);
					
			}else{
				
				let remove_action = make("div");
					remove_action.classList.add("fa","fa-trash","flexed","df_button_flat","df_small","medium","remove", "buttonize");
					remove_action.setAttribute("onclick","moveToTrashHelper('"+forms[index].student_id+"')");
					
					if(forms[index].progress == "" || forms[index].progress == "on_probation" ) action_div.appendChild(remove_action);
					
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
	
	try{
		qBuilder.filters.status = _("status_filter").value;
		qBuilder.filters.subject_id = _("subject_input").value;	
	}catch(e){
		//--
	}
	qBuilder.filters.subject_id = _("subject_input").value;
	qBuilder.filters.department = _("department").value;
	qBuilder.filters.college = current_user_college; //will only return the results based on current College of the user 
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



function loadItemToEdit(id){
	if(inIframe()){
		postMessageToParent('openModal:{"link":"update_student_editor?id='+id+'","custom_class":"no_close_button,blurred"}');
	}else{
		open_modal('update_student_editor?id='+id,'no_close_button,blurred');
	}
	

}



function addNewStudent(){
	if(inIframe()){
		postMessageToParent('openModal:{"link":"add_student","custom_class":"no_close_button,blurred"}');
	}else{
		open_modal('add_student','no_close_button,blurred');
	}
	
}




// View Detials Function
//Open Edit View/Modal - 


// ===================
// History and View Section Start 
// ===================
let ALL_INFO;
let HISTORY_INFO;

function loadItemToDetails(id){
	let student_id = parseInt(id);	

	let params = [{"name":"student_id", "value": student_id}];

	

	qBuilder.sendQuery(openModal,"/get_student_info_all",params);

	

	function openModal(data){
		let res_data = (JSON.parse(data.responseText));
		if(res_data.type == "success"){
			showModalContent('view_stat_1');
			
			res_data = res_data.student;
			selectedItemId = student_id;
			ALL_INFO = res_data;
			
			
			tag('student_name',_('view_stat_1'))[0].innerHTML = obfuscateText(res_data.student_name);
			
			tag('student_number',_('view_stat_1'))[0].innerText = res_data.student_number;	
			
			let subject_obj = findById(subjects, res_data.subject_id);
			
			tag('subject',_('view_stat_1'))[0].innerText = subject_obj.subject;
			
			
			tag('instructor_name',_('view_stat_1'))[0].innerText = res_data.instructor_name;
			
			tag('date',_('view_stat_1'))[0].innerText = utility.formatDate(res_data.date);	
			
			tag('sem_lapsed',_('view_stat_1'))[0].innerText = res_data.sems_passed;
			
			
			if(res_data.subject_type <= 1 || res_data.subject_type == null){
				tag('subject_type',_('view_stat_1'))[0].innerText = "";
			}else{
									
				tag('subject_type',_('view_stat_1'))[0].innerText = "(" + parseSubjectType(res_data.subject_type) + ")";
			}
			
			_("progress_option").value = res_data.progress;
			_("status_input").value = res_data.status;
			_("reason_input").value = res_data.reason;
			_("remarks_input").value = res_data.remarks;
			
			try{
				getHistoryOnProbation(res_data);
			}catch(e){
				//--
			}
			
			
			addFancyPlaceholder();
		}else{
			createDialogue("error", res_data.message);
		}
	}
}


//For gettinge the Data of On-Probation history
function getHistoryOnProbation(data){
	let student_number = data.student_number;
	
	
	let params = [{"name":"student_number", "value": student_number}];

	qBuilder.sendQuery(openModal,"/get_student_history",params);
	
		

	function openModal(data){
		let res_data = (JSON.parse(data.responseText));
		HISTORY_INFO = res_data;
		if(res_data.type == "success"){
			
			tag('probation_count',_('view_stat_1'))[0].innerText = res_data.summary.probation_count;
			
			tag('passed_count',_('view_stat_1'))[0].innerText = res_data.summary.passed_count;
			
			tag('failed_count',_('view_stat_1'))[0].innerText = res_data.summary.failed_count;
			
			
			populateHistoryTable(res_data);
			
			addFancyPlaceholder();
		}else{
			createDialogue("error", res_data.message);
		}
	}
	
		
	function populateHistoryTable(rdata){
		let history = rdata.history;
		
		_("table_history").innerHTML = "";
		selectedItemId;
		for(each of history){
			
			if(each.student_id == selectedItemId){
				continue;
			}
			
			let clone = document.importNode(_("table_columns").content, true);
			
			
	tag('subject', clone)[0].innerText = each.subject_name +

    ((each.subject_type >= 2) ? " (" + parseSubjectType(each.subject_type) + ")" : "") +
    " (" + each.subject_code + parseSubjectTypeCode(each.subject_type) + ")";
			
			
			tag('assigned Teacher', clone)[0].innerText = each.instructor_name;
			tag('status', clone)[0].innerHTML = parseStatus(each.status.trim()) || "N/A";
			tag('reason', clone)[0].innerText = each.reason || "N/A";
			tag('date', clone)[0].innerText = each.date;
			
			_("table_history").appendChild(clone);
		}
	}
		
	
	
}


// ===================
// History Section End 
// ===================



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
monitorChanges("shouldReloadStudents", loadAllItems);



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
		localStorage.setItem("shouldReloadStudents","true");
	}	
}

function silentlyMovetoRemove(ids){
	
	
	let itemvalue = [{"name":"student_id", "value": ids}];
	qBuilder.sendQuery(doNothing,"/remove_student_record",itemvalue);
}

function silentlyDeleteItem(ids){
	
	let itemvalue = [{"name":"item_id", "value": ids}];
	qBuilder.sendQuery(doNothing,"/remove_user_permanent",itemvalue);
}

function silentlyRestoreItem(ids){
	
	console.log(ids);
	
	let itemvalue = [{"name":"item_id", "value": ids}];
	qBuilder.sendQuery(doNothing,"/restore_item",itemvalue);
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
	let itemvalue = [{"name":"student_id", "value": idSelected}];
	qBuilder.sendQuery(feedBackRemoving,"/remove_student_record",itemvalue);
}


function restoreItem(confirmed = undefined,silent=false){
	if(confirmed == undefined){
		askUser("Are you sure to restore this item?",restoreItem,arguments);
		return;
	}
	destroy_dia();
	if(confirmed == 'fail'){
		return;
	}
	let itemvalue = [{"name":"item_id", "value": idSelected}];
	qBuilder.sendQuery(feedBackRemoving,"/restore_item",itemvalue);
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
	
	showToast("Removing Selected Items ...");
	
	for(each of table_data){
		if(each.checked){
			silentlyMovetoRemove(each.getAttribute("data_id"));
		};
	}
}

function removePermanentItemMulti(confirmed = undefined){
	if(confirmed == undefined){
		askUser("Are you sure to delete selected items from Trash?",removePermanentItemMulti,arguments);
		return;
	}
	destroy_dia();
	if(confirmed == 'fail'){
		return;
	}
	
	
	let table_data = _("data_generative").getElementsByClassName("check_input");
	for(each of table_data){
		if(each.checked){
			silentlyDeleteItem(each.getAttribute("data_id"));
		};
	}
	
	showToast("Deleting Items...");
}


function restoreItemMulti(confirmed = undefined){
	if(confirmed == undefined){
		askUser("Are you sure to Restore selected items?",restoreItemMulti,arguments);
		return;
	}
	destroy_dia();
	if(confirmed == 'fail'){
		return;
	}
	
	
	let table_data = _("data_generative").getElementsByClassName("check_input");
	for(each of table_data){
		if(each.checked){
			silentlyRestoreItem(each.getAttribute("data_id"));
		};
	}
	
	loadAllItemProduct();
	
}



function categoryParse(id){
	return categoriesList[id];
}


//parsing status data 
function parseStatus(data){

	if(data == ""){
		return "None"
	};
	
	return parseStatusText(data);
}




function doNothing(){
	localStorage.setItem("shouldReloadStudents","true");
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
function clickedOnRow(){
	let ev = event;
	let ids;
	let parent_attrib = (ev.target.parentNode);
	
	if(!parent_attrib.getAttribute('data_id')){
		return;
	};
	
	ids = parent_attrib.getAttribute('data_id');
	loadItemToDetails(ids);
	
	
	
	console.log(ids);
	
}


let selectedItemId;



function updateCountItem(op){
	
	let params = [{
		"name": "item_id",
		"value": selectedItemId,
	},
	{
		"name": "amount",
		"value": _("item_count").value,
	},
	{
		"name": "operation",
		"value": op,
	}];
	qBuilder.sendQuery(itemNotifyUpdate,"update_item_quantity",params);
	localStorage.setItem("shouldReload","true");
}



function itemNotifyUpdate(data){
	
	if(!data.responseText){
		return createDialogue("error","Server Response error");
	}
	
	data = JSON.parse(data.responseText);
	
	showToast(data.message);
	closeModalContent("modal_1");
	
}



