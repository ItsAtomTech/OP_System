selectedItemId = null;

async function getPrintableData(){

	_("wrapper_doc").classList.add("blur_docs");
	await sleep(800);
	let data = localStorage.getItem("printFile");
	
	if(data){
		data = JSON.parse(data);
	}
	
	console.log(data);
	
	
	
	putInformationData(data.currentAll);
	putDataHistory(data.currentHistory);
	_("print_date").innerText = getCurrentDate();
	
	
	await sleep(200);
	
	_("wrapper_doc").classList.remove("blur_docs");
	
	
	
	await sleep(500);
	print();
}



function getCurrentDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${month}/${day}/${year}`;
}



function putInformationData(data){
	
	
	
	if (data.remarks){  _("academic_status").innerText = data.remarks}else{
		_("academic_status").innerText = "N/A"
	}
	
	
	_("student_id").innerText = data.student_number;
	_("student_name").innerText = data.student_name;
	_("student_name").innerText = data.student_name;
	
	_("college_name").innerText = data.college_name;
	
	
	_("department_name").innerText = data.department_name;
	_("subject_code").innerText = data.subject_code + parseSubjectTypeCode(data.subject_type);
	_("subject_name").innerText = data.subject_name;
	_("instructor_name").innerText = data.instructor_name;
	_("reason").innerText = data.reason;
	_("progress").innerText = data.progress;
	_("status").innerText = data.status;
	_("probation_date").innerText = formatDate(data.date);
	
	selectedItemId=data.student_id;
	
}




function putDataHistory(data){
	
	console.log(data);
	let summary = data.summary;
	
	
	_("probation_count").innerText = summary.probation_count;
	_("passed_count").innerText = summary.passed_count;
	_("failed_count").innerText = summary.failed_count;
	
	populateHistoryTable(data);
	
	
	function populateHistoryTable(rdata){
		let history = rdata.history;
		
		_("table_history").innerHTML = "";
		for(each of history){
			
			if(each.student_id == selectedItemId){
				continue;
			}
			
			let clone = document.importNode(_("table_columns").content, true);
			
			tag('subject', clone)[0].innerText = each.subject_name + 
			
			((each.subject_type >= 2) ? " (" + parseSubjectType(each.subject_type) + ")" : "") +
    " (" + each.subject_code + parseSubjectTypeCode(each.subject_type) + ")";
			
			
			tag('assigned Teacher', clone)[0].innerText = each.instructor_name;
			tag('status', clone)[0].innerHTML = each.status.trim().toUpperCase() || "N/A";
			tag('reason', clone)[0].innerText = each.reason || "N/A";
			tag('date', clone)[0].innerText = each.date;
			
			_("table_history").appendChild(clone);
		}
	}
		
	
	
	
	
	
	
	
	
	
	
}







//Calls this function when the page is done loading
window.onload = () => getPrintableData();