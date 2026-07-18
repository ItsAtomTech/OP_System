let filterExtracted = {};

qBuilder.server_address = "get_students_deadline";

function getCurrentDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${month}/${day}/${year}`;
}

_("print_date").innerText = getCurrentDate();
function loadPayload(){
		
	if(localStorage.getItem("onPro")){
		filterExtracted = JSON.parse(localStorage.getItem("onPro"));
	}
	
	
}


loadPayload();






async function retriveData(){
	
	qBuilder.filters = filterExtracted.filters;
	qBuilder.page = filterExtracted.page;
	qBuilder.sort = filterExtracted.sort;
	qBuilder.order_by = filterExtracted.order_by;
	qBuilder.search = filterExtracted.search;
	
	qBuilder.filters.unique = "student_number";
	// qBuilder.filters.skip_statuses = "passed,failed";
	
	qBuilder.sendQuery(proccess);
	
	console.log(qBuilder.filters.unique);
	
	
	function proccess(data){
		loadToListTable(data.responseText);
	}
	
}



retriveData();

async function loadToListTable(data){
	let dataFrom = JSON.parse(data).data;
	
	console.log(dataFrom);
	
	_("probation_list_body").innerHTML = "";
	_("wrapper_doc").classList.add("blur_docs");
	showToast("Preparing Table...");
	await sleep(400);
	
	
	for(each of dataFrom){
		let clone = document.importNode(_("table_row_template").content, true);
		
		tag("student_number",clone)[0].innerText = each.student_number;
		tag("student_name",clone)[0].innerText = each.student_name;
		tag("year_level",clone)[0].innerText = getOrdinal(each.year_level);
		tag("entry_sem",clone)[0].innerText = each.entry_sem;
		
		
		_("probation_list_body").appendChild(clone);
		
	}
	await sleep(1200);
	_("wrapper_doc").classList.remove("blur_docs");
	await sleep(1000);
	window.print();
	// console.log(dataFrom);
	
}