let tableFormat = [
	// {	
		// label: " "/*supposed to be checks*/,
		// data_path: ""
	// },
	{	
		label: "ID",
		data_path: "order_id",
		sort: true,
		// parser:parseBranch,
		
	},	
	{	
		label: "Items",
		data_path: "items",
		sort: false,
		parser:parseItems,
		
	},

	{	
		label: "Total Ammount",
		data_path: "total_amount",
		sort: true,
		// parser:parseBranch,
		
	},
	{	
		label: "Prepared By",
		data_path: "prepared_by",
		sort: true,
		// parser:parseBranch,
		
	},
	{	
		label: "Remarks",
		data_path: "remarks",
		sort: false,
		parser:purposeParse,
		
	},
	{	
		label: "Status",
		data_path: "status",
		sort: true,
		parser: parseStatus,
		
	},
	{	
		label: "Requested By (Department)",
		data_path: "department_name",
		sort: true,
		
	},

	
	{	
		label: "Date Created",
		data_path: "date",
		sort: true,
		parser:utility.dateNormalize,
		
	},
	

];

let hiddenColumns = [];
let page = 1;

let dataList;

let saveMode = "new";

function tableLoader(data){
	let resData = (JSON.parse(data.responseText));
	let forms = resData.purchase_order_list;

	
	dataList = forms;
	
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
		let record_id = (data.order_id);
			let headTr = make("tr");
				headTr.classList.add("padded_colms","clickable_row");
				headTr.setAttribute("onclick","clickedOnRow("+record_id+")");
				headTr.setAttribute("data_id",record_id);
				headTr.setAttribute("code_id",record_id);
				
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
					edit_action.setAttribute("onclick",'loadItemToEdit("'+forms[index].order_id+'")');
						
					action_div.appendChild(edit_action);		
					
			if(pageType == "trash"){
				
				let remove_action = make("div");
					remove_action.classList.add("fa","fa-refresh","flexed","df_button_flat","df_small","medium","remove", "buttonize");
					remove_action.setAttribute("onclick","restoreItemHelper('"+forms[index].purchase_id+"')");
					remove_action.setAttribute("title","Restore to Items Table");
					
					action_div.appendChild(remove_action);
					
			}else{
				
				let remove_action = make("div");
					remove_action.classList.add("fa","fa-trash","flexed","df_button_flat","df_small","medium","remove", "buttonize");
					remove_action.setAttribute("onclick","moveToTrashHelper('"+forms[index].purchase_id+"')");
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
	qBuilder.filters.status = _("status_filter").value;
	qBuilder.filters.department_id = _("department_id").value;

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
	let params = [{"name":"id", "value": item_id}];
	
	console.log(id);
	
	if(inIframe()){
		postMessageToParent('openModal:{"link":"purchase_order_edit_standalone?order_id='+id+'","custom_class":"no_close_button,blurred"}');
	}else{
		open_modal('purchase_order_edit_standalone?order_id='+id,'no_close_button,blurred');
	}
	
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
	localStorage.setItem("shouldReloadFuel","true");

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
monitorChanges("shouldReloadPurchaseReq", loadAllItems);



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
		localStorage.setItem("shouldReloadPurchaseReq","true");
	}	
}

function silentlyMovetoRemove(ids){
	let itemvalue = [{"name":"request_id", "value": ids}];
	qBuilder.sendQuery(doNothing,"remove_purchase_request_file",itemvalue);
	
	
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
	let itemvalue = [{"name":"purchase_id", "value": idSelected}];
	qBuilder.sendQuery(feedBackRemoving,"/remove_purchase_request_file",itemvalue);
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


//Items Parser ===

function parseItems(data){
	let container = make("div");
	container.className = "items_parsed_on";

	data.forEach(item => {
		let [name, qty, desc, price, amount] = item;

		let itemSpan = make("span");
		itemSpan.className = "item_entry";

		let nameEl = make("span");
		nameEl.className = "item_name bold";
		nameEl.textContent = charLimit(name,12) || "—";

		let qtyEl = make("i");
		qtyEl.className = "item_qty";
		qtyEl.textContent = `Qty: ${qty || 0}`;

		let descEl = make("span");
		descEl.className = "item_desc";
		descEl.textContent = charLimit(desc,15) || "—";

		let priceEl = make("span");
		priceEl.className = "item_price";
		priceEl.textContent = `Unit: ${price || 0}`;

		let amountEl = make("span");
		amountEl.className = "item_amount bold float_right";
		amountEl.textContent = `Amount: ${amount || 0}`;
		
		let iconElm = make("span");
			iconElm.classList.add("fa","fa-cube","icon_on_side");
			
		
		itemSpan.append(iconElm, nameEl, qtyEl, descEl, priceEl, amountEl);
		container.appendChild(itemSpan);
	});

	return container.outerHTML;
}



function purposeParse(data){
	return charLimit(data, 45);
}


function doNothing(){
	localStorage.setItem("shouldReloadPurchaseReq","true");
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




function clickedOnRow(elm){
	if(elm && elm.target){
		elm = elm.target;
	}
	if(!elm || typeof elm.closest !== 'function'){
		elm = window.event ? window.event.target : null;
	}

	if(!elm || elm.classList.contains("buttonize")){
		return;
	}

	let parent_attrib = elm.closest('[data_id]');
	if(!parent_attrib){
		return;
	}

	targetID = parent_attrib.getAttribute('data_id');

	let params = [
		{"name": "order_id", "value": targetID},
	];

	qBuilder.sendQuery(generatePurchaseOrderDataView, 'get_order_by_id_standalone', params);

	function generateItemsTable(items){
		let tbody = _('purchase_order_items_table_body');
		tbody.innerHTML = '';

		items.forEach(item => {
			let [name, qty, desc, unitCost, totalAmount] = item;

			let row = make("tr");
			row.className = "padded_colms small";

			let nameTd = make("td");
			nameTd.className = "tiny";
			nameTd.textContent = name || "--";

			let qtyTd = make("td");
			qtyTd.className = "tiny";
			qtyTd.textContent = qty || "--";

			let descTd = make("td");
			descTd.className = "tiny";
			descTd.textContent = desc || "--";

			let unitCostTd = make("td");
			unitCostTd.className = "tiny";
			unitCostTd.textContent = unitCost || "--";

			let totalTd = make("td");
			totalTd.className = "tiny sticky_column_right primary_background";
			totalTd.textContent = totalAmount || "--";

			row.append(nameTd, qtyTd, descTd, unitCostTd, totalTd);
			tbody.appendChild(row);
		});
	}

	function generatePurchaseOrderDataView(data) {
		let res_data = JSON.parse(data.responseText);
		let order = res_data.order;
		let modal = _('view_purchase_order_1');

		if(!order){
			closeModalContent('view_purchase_order_1');
			return;
		}

		let items_list = [];
		try {
			items_list = JSON.parse(order.items);
		} catch(e) {
			items_list = [];
		}
		if(!Array.isArray(items_list)){
			items_list = [];
		}

		let terms = order.payment_terms || '--';
		try {
			let parsed_terms = JSON.parse(order.payment_terms);
			if(Array.isArray(parsed_terms)){
				terms = parsed_terms.join(', ') || '--';
			}
		} catch(e) {}

		let total = order.total_amount;
		if(total === undefined || total === null){
			total = 0;
			items_list.forEach(row => {
				let amount = parseFloat(row[4]);
				if(!isNaN(amount)){
					total += amount;
				}
			});
		}

		tag('po_no',                   modal)[0].innerText = order.po_no || '--';
		tag('supplier_name',           modal)[0].innerText = order.supplier_name || '--';
		tag('supplier_address',        modal)[0].innerText = order.supplier_address || '--';
		tag('contact_person',          modal)[0].innerText = order.contact_person || '--';
		tag('supplier_contact_number', modal)[0].innerText = order.supplier_contact_number || '--';
		tag('payment_terms',           modal)[0].innerText = terms;
		tag('department',              modal)[0].innerText = order.department_name || order.department_id || '--';
		tag('date_ordered',            modal)[0].innerText = utility.formatDate(order.date);

		generateItemsTable(items_list);

		_('view_order_total_amount').value = total;
		_('view_order_remarks').value = order.remarks || '';
		_('view_order_prepared_by').value = order.prepared_by || '--';
		_('view_order_approved_by').value = order.approved_by || '--';

		addFancyPlaceholder();
	}

	showModalContent("view_purchase_order_1");
}


monitorChanges("shouldReloadPurchaseReqModal", reloadModalView);
monitorChanges("shouldReloadPurchaseOrderModal", reloadOrderModalView);



let selectedItemId;
function itemNotifyUpdate(data){
	
	if(!data.responseText){
		return createDialogue("error","Server Response error");
	}
	
	data = JSON.parse(data.responseText);
	
	showToast(data.message);
	// closeModalContent("modal_1");
	
}



function parseDestination(data){
	try{
		let parsed = JSON.parse(data);
		let extracted = parsed.join(", ");	
		return extracted;
	}catch(e){
		//--
	}
	
	return "--";
}


//Printing Logics
async function printDoc(){

	//Extract the Filters to pass onto the overall printing	
	let filters_to_pass = {
		"id": targetID,//purhcase_request id
		"order_id": targetID,
		"type": "standalone",
	}
	
	localStorage.setItem("printPurchaseOrder", JSON.stringify(filters_to_pass));
	
	showToast("Preparing Document filters ... ");
	await sleep(1000);
	
	window.open('/purchase_order_print', 'printPurchaseOrder');
}



async function assignedPurchaseReqStatus(elm){
	if (targetID == undefined){
		return;
	}
	
	if(utility.spammingJam()){
		return await sleep(1500);
	}
	
	let values = elm.value;
	
	let itemvalue = [
		{"name":"purchase_id", "value": targetID},
		{"name":"status", "value": values},
	];
	
	createDialogue("wait");
	await qBuilder.sendPromise(updateListen,"updatePurchaseReqStatus",itemvalue);
	destroy_dia();
	

	
	function updateListen(data){
			let res_data = (JSON.parse(data.responseText));
			showToast(res_data.message);
			
				orderButtonState();
	}
	
}


function orderButtonState(){
	let button = _("order_floating");
	let inputval = _("status_option_");
	
	if(inputval.value == "approved" || inputval.value == "processed" ){
		button.classList.remove("hidden");
	}else{
		button.classList.add("hidden");
	}
	
}


// Purchase Order Handles ================================

async function popOrderActions(){
	
	if(orderData.hasOrder){
		
		// --- open the modal for Order Details if existing --	
		let params = [
			{"name":"purchase_order_id", "value":orderData.order_id}
			
		];
		
		await qBuilder.sendPromise(generatePurchaseOrderDataView,"get_order_by_id",params);
		
		showModalContent("view_purchase_order_1");
		
	}else{
		showToast("No P.O. detected, opening editor...");
		await sleep(2000);
		openEditorPO(targetID);
	}
	
}

function openEditorPO(id){
	
	let item_id = parseInt(id);	
	let params = [{"name":"id", "value": item_id}];
	
	console.log(id);
	
	if(inIframe()){
		postMessageToParent('openModal:{"link":"purchase_order?id='+id+'","custom_class":"no_close_button,blurred"}');
	}else{
		open_modal('purchase_order?id='+id,'no_close_button,blurred');
	}
	
}




function editOrderActions(elm){
	
	let purchase_id = 0;
	let order_id = elm.getAttribute("order_id");
	
	
	let params = [
		{"name":"order_id", "value": order_id}, 
	];
	
	console.log(params);
	
	if(inIframe()){
		postMessageToParent('openModal:{"link":"purchase_order_edit_standalone?id='+purchase_id+'&order_id='+order_id+'","custom_class":"no_close_button,blurred"}');
	}else{
		open_modal('purchase_order_edit_standalone?id='+purchase_id+'&order_id='+order_id,'no_close_button,blurred');
	}
	
}



function openFileofOrder(id){
	
	let selected = dataList[id];
		orderData = selected.purchase_order;
	
	popOrderActions();	
}


function reloadModalView(){
	let targetElm =  document.querySelector('[data_id="' + targetID + '"]');
	
	// console.log(targetElm);
	if(targetElm){
		clickedOnRow(targetElm);
	}

}


function reloadOrderModalView(){
	popOrderActions();
}


// Refresh handler =========================

REFRESH_HANDLER = function(){
	
	if(isMinimized){
		isMinimized = false;
		return;
	}
	
	showToast("You are already here!");
	
}
