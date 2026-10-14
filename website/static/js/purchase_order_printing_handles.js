let DEFAULT_ADDRESS = "P. Burgos St. Barangay 23 6500 City of Tacloban Leyte";
let DEFAULT_COMPANY = "CHAWNAH FOODS INC.";
let DEFAULT_LOGO = "logos/cfi_big.png";

let orderLoaded = false;


async function getPrintableData(){
	qBuilder.server_address = "_";
	_("wrapper_doc").classList.add("blur_docs");
	await sleep(800);
	let data = localStorage.getItem("printPurchaseOrder");

	if(!data){
		return showToast("There was no data provided!");
	}

	data = JSON.parse(data);

	getInformationData(data);

	await sleep(200);
	_("wrapper_doc").classList.remove("blur_docs");

}


async function getInformationData(data){
	let params = [
		{"name": "purchase_order_id", "value": data.order_id},
		{"name": "include_company", "value": 1}
	];

	await qBuilder.sendPromise(generateDataOnDoc, '/get_order_by_id', params);

	if(!orderLoaded){
		return;
	}

	await sleep(1000);
	print();
}


function parseJSON(raw, fallback){
	try{
		let value = JSON.parse(raw);
		return value === null ? fallback : value;
	}catch(e){
		return fallback;
	}
}


function generateDataOnDoc(dataraw){
	let res_data = parseJSON(dataraw.responseText, {});

	if(res_data.type !== "success"){
		return showToast(res_data.message || "Unable to load the purchase order!");
	}

	let order = res_data.order;
	let purchase = res_data.purchase || {};
	let extra = parseJSON(order.json_data, {});

	_('po_number').innerText = order.po_no || '--';
	_('po_date').innerText   = order.date ? utility.formatDate(order.date) : '--';

	_('supplier_name').innerText           = order.supplier_name || '--';
	_('supplier_address').innerText        = order.supplier_address || '--';
	_('supplier_contact_person').innerText = order.contact_person || '--';
	_('supplier_contact_number').innerText = order.supplier_contact_number || '--';

	generatePaymentTerms(order.payment_terms);

	renderItems(parseJSON(purchase.items, []));

	_('grand_total').innerText = formatPeso(purchase.total_amount);

	_('remarks').innerText = order.remarks || '--';

	_('prepared_by').innerText       = order.prepared_by || extra.prepared_by || '--';
	_('prepared_position').innerText = extra.position_prepared_by || '--';
	_('approved_by').innerText       = order.approved_by || extra.approved_by || '--';
	_('approved_position').innerText = extra.position_approved_by || '--';

	generateHeaderTitles(res_data, order);

	orderLoaded = true;
}


function generatePaymentTerms(raw){
	let terms = parseJSON(raw, raw);

	if(!Array.isArray(terms)){
		terms = terms ? [terms] : [];
	}

	terms.forEach(term => {
		let box = _("term_" + String(term).trim().toLowerCase());
		if(box){
			box.classList.add("checked");
		}
	});
}


function renderItems(items){
	let tbody    = _('items_tbody');
	let template = _('po_row_template');
	tbody.innerHTML = '';

	let ROW_HEIGHT_CAPE = 400;

	let MIN_ROWS = 10;

	items.forEach(item => {
		let row = document.importNode(template.content, true);

		tag('item_desc', row)[0].innerText  = item[0] || item[2] || '--';
		tag('quantity', row)[0].innerText   = item[1] || '--';
		tag('unit_price', row)[0].innerText = item[3] ? formatPeso(item[3]) : '--';
		tag('amount', row)[0].innerText     = item[4] ? formatPeso(item[4]) : '--';

		tbody.appendChild(row);
	});

	let blanksNeeded = MIN_ROWS - items.length;
	for(let i = 0; i < blanksNeeded; i++){
		let row = document.importNode(template.content, true);

		tag('item_desc', row)[0].innerText  = ' ';
		tag('quantity', row)[0].innerText   = ' ';
		tag('unit_price', row)[0].innerText = ' ';
		tag('amount', row)[0].innerText     = ' ';

		tbody.appendChild(row);

		if(parseInt(tbody.getBoundingClientRect().height) >= ROW_HEIGHT_CAPE){
			break;
		}
	}
}


let companyData = {};

function generateHeaderTitles(res_data, order){
	
	
	companyData = res_data.purchase.company_data || (res_data.purchase || {}).company_data || res_data.company_data || {};

	console.log(companyData);
	
	
	_("company_address").innerText = companyData.address || DEFAULT_ADDRESS;
	_("company_name").innerText    = companyData.name || DEFAULT_COMPANY;

	if(!companyData.logo_link){
		_("company_logo").src = STATIC_IMAGE_LINK + "/" + DEFAULT_LOGO;
	}else{
		_("company_logo").src = STATIC_IMAGE_LINK + "/logos/" + companyData.logo_link;
	}

	let miscData = parseJSON(res_data.purchase.misc, {});

	if(miscData.custom_logo && miscData.custom_logo.length >= 4){
		_("company_logo").src = STATIC_IMAGE_LINK + "/logos/" + miscData.custom_logo;
	}

}



function formatPeso(data){
	return formatToPHP(data, "₱");
}

getPrintableData();
