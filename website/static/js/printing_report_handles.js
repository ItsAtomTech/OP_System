selectedItemId = null;
let statNames = {
	"on_probation":	"On Probation",
	"on_tracking": "On Tracking",
	"total_failed":	"Total Failed",
	"total_passed":	"Total Passed",
	"to_shift":"Advised to Shift",
	"to_transfer": "Advised to Transfer"
}


let semName = {
	"1": "1st Sem",
	"2": "2nd Sem",
	"3": "Summer", 
	"all": "All",
	
}

async function getPrintableData(){
	qBuilder.server_address = "_";
	_("wrapper_doc").classList.add("blur_docs");
	await sleep(800);
	let data = localStorage.getItem("reportFile");
	
	if(data){
		data = JSON.parse(data);
	}

	getInformationData(data);
	_("print_date").innerText = getCurrentDate();
	
	
	await sleep(200);
	_("wrapper_doc").classList.remove("blur_docs");
	await sleep(800);
	print();
}



function getCurrentDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${month}/${day}/${year}`;
}


let currentFilter;
function getInformationData(data){
		// console.log(data);
		currentFilter = data.currentFilters;
		
		let params =  [
			{ 
				"name":"currentFilters",
				"value": JSON.stringify(data.currentFilters),
			},
			{ 
				"name":"stat_filters",
				"value": JSON.stringify(data.stat_filters),
			}
		];
		
		qBuilder.sendQuery(generateDataTables,'get_data_per_stat',params);	
}


let canvasIds = {};


async function generateDataTables(dataraw){
	let data = (JSON.parse(dataraw.responseText));
	_("charts_section").innerHTML = "";
	let stats = data.data_per_stat;
		canvasIds = {};
	
	
	_("program").innerHTML = "";
	_("college").innerHTML = "";
	let departments = [];
	let college = [];
	
	
	for(each of data.data_per_department){
		departments.push(parseProgramName(each.department_name));
		
		addUniqueString(college,parseProgramName(each.college_name));
	}
	
	_("program").innerText = departments.join(", ");
	
	if(currentFilter.department_filter == "all"){
		_("program").innerText = "All Programs";
	}else{
		_("program").innerText = departments.join(", ");

	}
	
	_("college").innerText = college.join(", ");
	
	
	//Generate Table Data 	
	
	generateTableData(data);
	
	
	//Generate Canvas Elements before putting data into them
	
	for(each of stats){		
		let clone = document.importNode(_("stat_chart_section").content, true);
		let canvas = tag("chartCanvas",clone)[0];
		let title = tag("stat_title",clone)[0];
		
		
		canvasIds[each.stat_name] = "c_"+ each.stat_name;
		canvas.setAttribute("id", "c_"+ each.stat_name);
		title.innerText = statNames[each.stat_name];
		
		// console.log(each);
		
		_("charts_section").appendChild(clone);
	}
	
	
	for(each of stats){
		
		let canvas_elm = canvasIds[each.stat_name];
			if(!canvas_elm) continue;
		
		
		generateMultiBarChart(
		  removeZeroSemData(each.departments),
		  canvas_elm,
		  false  // asPercentage = false for raw numbers
		);

		
		
	}
}



function removeZeroSemData(datasets) {
  return datasets.filter((dataset) =>
    dataset.data.some(([sem, val]) => val !== 0)
  );
}


/**
 * Adds a string to an array only if it does not already exist within it.
 *
 * @param {Array<string>} targetArray - The array to evaluate and modify.
 * @param {string} newString - The string to potentially add to the array.
 * @returns {Array<string>} The updated array.
 */
function addUniqueString(targetArray, newString) {
    // Check if the array does NOT already contain the string
    if (!targetArray.includes(newString)) {
        targetArray.push(newString);
    }
    return targetArray;
}




function generateTableData(data){
	let table_data = data.stat;	
	
	let elm = _("selected_filter");
	elm.innerHTML = "";
	
	
	_("year_range").innerText = currentFilter.year_range.length ? currentFilter.year_range : "All";
	
	
	_("semester").innerText = currentFilter.semester.length ? semName[currentFilter.semester] : "All";
	
		
	let collh = make("th");
		collh.innerText = "College";
		elm.appendChild(collh);	
		
	let progh = make("th");
		progh.innerText = "Program";
		elm.appendChild(progh);	
			
	
	let sorted = sortDataByCollege(data.data_per_department);
	
	//Gen Headers
	for(each of data.data_per_stat){
		let th_elm = make("th");
			th_elm.innerText = statNames[each.stat_name];
			elm.appendChild(th_elm);
	}
	
	let tableRows = _("table_tr_row");
	
	
	
	// Gen Data Rows
	
	let printedCollege = [];
	for(each of sorted){
		
		let row = make("tr");
			
			
			if(printedCollege.indexOf(each.college_name) >= 0){
				each.college_name = "";
			}else{
				printedCollege.push(each.college_name);
				
				row.classList.add("above_border");
			}
			
		let coll = make("td");
			coll.innerText = parseProgramName(each.college_name);
			coll.classList.add("bold");
			
			row.appendChild(coll);
			
		let progs = make("td");
			progs.innerText = parseProgramName(each.department_name);
			progs.classList.add("bold");
			
			row.appendChild(progs);
			
			for(rows of each.stats){
				let datarow = make("td");
					datarow.innerText = (rows.count);
					
				row.appendChild(datarow);
					
			}
			
		tableRows.appendChild(row);	
	}	
	
	function sortDataByCollege(data) {
		return data.sort((a, b) => {
			let collegeA = a.college_name.toUpperCase();
			let collegeB = b.college_name.toUpperCase();

			if (collegeA < collegeB) {
				return -1;
			}
			if (collegeA > collegeB) {
				return 1;
			}
			return 0;
		});
	}
}



	
	

//Calls this function when the page is done loading
window.onload = () => getPrintableData();