selectedItemId = null;


let DEFAULT_ADDRESS = "P. Burgos St. Barangay 23 6500 City of Tacloban Leyte";
let DEFAULT_COMPANY = "CHAWNAH FOODS INC.";
let DEFAULT_LOGO = "logos/cfi_big.png";


async function getPrintableData(){
	qBuilder.server_address = "_";
	_("wrapper_doc").classList.add("blur_docs");
	await sleep(800);
	let data = localStorage.getItem("printPurchaseRequest");
	
	if(!data){
		return showToast("There was no data provided!"); 
	}
	
	
	if(data){
		data = JSON.parse(data);
	}

	
	getInformationData(data);

	await sleep(200);
	_("wrapper_doc").classList.remove("blur_docs");
	await sleep(1000);
	print();
}


function getInformationData(data){
	let idPost = undefined;
	idPost = data.id;

	let params = [
		{"name": "purchase_id", "value": idPost},
		{"name": "include_company", "value": 1}
	];

	qBuilder.sendQuery(generateDataOnDoc, '/get_purchase_request_by_id', params);
}


function generateDataOnDoc(dataraw){
	let res_data = (JSON.parse(dataraw.responseText));
	let purchase = res_data.purchase;

	let items = [];
	try{
		items = JSON.parse(purchase.items);
	}catch(e){
		items = [];
	}

	// Header Info
	_('date_requested').innerText        = utility.formatDate(purchase.date);
	_('date_required').innerText         = utility.formatDate(purchase.date_required);
	_('pr_number').innerText             = purchase.purchase_id || '--';
	_('requesting_department').innerText = purchase.department_name || '--';

	// Items
	renderItems(items);

	// Grand Total — already computed server-side ...
	_('grand_total').innerText = purchase.total_amount
		? ` ${formatToPHP(parseFloat(purchase.total_amount).toFixed(2), "₱")}`
		: '₱ 0.00';

	// Purpose
	_('purpose_of_request').innerText = purchase.purpose_of_request || '--';

	// Requested By
	_('requested_by').innerText = purchase.requested_by || purchase.requestor_name;
	
	//Approved By fields
	generateApprovefBy(purchase.approved_by);
	
	
	generateHeaderTitles(purchase);
	
}




function renderItems(items){
	let tbody    = _('items_tbody');
	let template = _('pr_row_template');
	tbody.innerHTML = '';
	
	let ROW_HEIGHT_CAPE = 400;
	
	const MIN_ROWS = 12;

	items.forEach(item => {
		let row = document.importNode(template.content, true);

		tag('item_name', row)[0].innerText  = item[0] || '--';
		tag('quantity', row)[0].innerText   = item[1] || '--';
		tag('item_desc', row)[0].innerText  = item[2] || '--';
		tag('unit_price', row)[0].innerText = item[3] ? formatPeso((parseFloat(item[3]).toFixed(2))) : '--';
		tag('amount', row)[0].innerText     = item[4] ? formatPeso(parseFloat(item[4]).toFixed(2)) : '--';

		tbody.appendChild(row);
	});

	// Pad with blank rows so the table always shows at least MIN_ROWS caped at max height
	let blanksNeeded = MIN_ROWS - items.length;
	for(let i = 0; i < blanksNeeded; i++){
		let row = document.importNode(template.content, true);

		tag('item_name', row)[0].innerText  = '\u00A0';
		tag('quantity', row)[0].innerText   = '\u00A0';
		tag('item_desc', row)[0].innerText  = '\u00A0';
		tag('unit_price', row)[0].innerText = '\u00A0';
		tag('amount', row)[0].innerText     = '\u00A0';

		tbody.appendChild(row);
		
		if(parseInt(tbody.getBoundingClientRect().height) >= ROW_HEIGHT_CAPE){
			break;
		};
		
	}
}


function generateApprovefBy(data){
	
	if(!data){
		return;
	}
	
	data = JSON.parse(data);
	
	let counter = 1; 
	for(each of data){
		
		_("approved_"+ counter) ? _("approved_"+ counter).innerText = each[1]: false;
		_("position_"+ counter) ? _("position_"+ counter).innerText = each[0]: false;
		
		
		counter++;
	}
	
}






// ========================================================
//Populate the header fields and other none Item Stuffs ===

let companyData = {};

function generateHeaderTitles(data){
	
	
	if(data.company_data){
		companyData = data.company_data;
	};
	
	
	if(!companyData.address){
		_("company_address").innerText = DEFAULT_ADDRESS;
	}else{
		_("company_address").innerText = companyData.address;
	}
		
	
	if(!companyData.name){
		_("company_name").innerText = DEFAULT_COMPANY;
	}else{
		_("company_name").innerText = companyData.name;
	}
	
	
	if(!companyData.logo_link){
		_("company_logo").src = STATIC_IMAGE_LINK + "/" + DEFAULT_LOGO;
	}else{
		_("company_logo").src = STATIC_IMAGE_LINK + "/logos/" + companyData.logo_link;
	}
	
	
	let miscData = {}
	if(data.misc){
		try{
			miscData = JSON.parse(data.misc);
		}catch(e){
			console.warn(e);
			// ---
		}
	}
		
	if(miscData.custom_logo && miscData.custom_logo.length >= 4){
		_("company_logo").src = STATIC_IMAGE_LINK + "/logos/"+ miscData.custom_logo
	}
	console.log(miscData);
	
}


function formatPeso(data){
	return formatToPHP(data, "₱");
}

getPrintableData();

