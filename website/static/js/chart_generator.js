// Multiple datasets with their own labels
const datasets = [

  
];




qBuilder.server_address = "_";

//getsems_progdata


let year_ranges = "2000,2026";


function addZeros(int, numOfZeros = 4) {
	  //transforms number into a string, then fills the spatial void with '0'.
		return String(int).padStart(numOfZeros, '0');
}


//Filters and Modal Pickers Function:

let program_filter = [];


 function searchProgramOptions(searchText) {
    var listContainer = document.getElementById("group_text_3_");
    if (!listContainer) {
      return;
    }

    var query = (searchText || "").toString().trim().toLowerCase();
    var optionRows = listContainer.getElementsByClassName("check_options");

    for (var i = 0; i < optionRows.length; i++) {
      var row = optionRows[i];
      var input = row.querySelector('input[type="checkbox"]');
      var label = row.querySelector("label");

      if (!input || !label) {
        continue;
      }

      if (input.id === "check_all_") {
        row.style.display = "";
        continue;
      }

      var name = (label.textContent || label.innerText || "")
        .trim()
        .toLowerCase();
      row.style.display = name.indexOf(query) !== -1 ? "" : "none";
    }
  }
  
  
  
function getAllCheckedPrograms() {
    const checked = document.querySelectorAll('.check_options_input:checked');
    return Array.from(checked).map(cb => cb.value);
}


function selectAllProgram(el) {
    const allChecks = document.querySelectorAll('.check_options_input:not(#check_all_)');
    allChecks.forEach(cb => cb.checked = el.checked ? false : cb.checked);
	
	if(!el.checked){
		renderSelection();
	}
	
}


  
function deselectAll(el) {
	if(document.getElementById('check_all_')){
		   document.getElementById('check_all_').checked = false;
	}
}


async function saveSelection(){
	let allChecked = getAllCheckedPrograms();
	
	program_filter = allChecked;
	
	localStorage.setItem("savedSelections", JSON.stringify(program_filter));
	
	try{	
		showToast("Selections Applied");	
		showSelectionOnButton();
		populateTabItems();
		await sleep(200);
		preLoadSelectTab();
	}catch{
		//----
	}

		
	try{
		
		hasFilterChanges = true;

		fetchDashboardStats();
		renderSelection();
	}catch(e){
		//
	}
	
	
}


function renderSelection() {
    const allChecks = document.querySelectorAll('.check_options_input:not(#check_all_)');
    allChecks.forEach(cb => {
        cb.checked = program_filter.includes(cb.value);
    });
	
	
	deselectAll();//removes the selection on "all" button
}


function loadSavedSelections(){
	let saves = localStorage.getItem("savedSelections");
	if(saves == null){
		randomizeLoadout();	
		saveSelection();		
		
	}else{
		program_filter = JSON.parse(saves);
		renderSelection();
		
	}
			
	if(program_filter.length <= 0){
		let allChecks = Array.from(document.querySelectorAll('.check_options_input:not(#check_all_)'));
		
		if(allChecks.length >= 1){
			allChecks[0].checked = true;
		};
		
		saveSelection();
		
	}

	showSelectionOnButton();
}



function showSelectionOnButton(){
	let elm = _("probation-filter-program");
	
	if(program_filter == null || program_filter.length == 0 || (program_filter[0] == "all" && program_filter.length <= 1)){
		elm.value = "Selected Categories (All)"
	}else{
		elm.value = "Selected Categories ("+program_filter.length+")"
	}
	
}


function randomizeLoadout(counts = 10) {
	
	try{
		if(utility.spammingJam()){
			showToast("Too many actions... please relax a bit!");
			return false;
		};
	}catch{
		return;
	}

    const allChecks = Array.from(document.querySelectorAll('.check_options_input:not(#check_all_)'));
    
    allChecks.forEach(cb => cb.checked = false);

    const shuffled = allChecks.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(counts, allChecks.length));

    selected.forEach(cb => cb.checked = true);
}
loadSavedSelections();


//Empty out the options
function initCategoriesOptions(){
	let main = _("group_text_3_");
	let all_button  = _("choice_all").content.cloneNode(true);

	main.innerHTML = "";
	
	main.appendChild(all_button);

	
}

function addOptions(data){
	let main = _("group_text_3_");
	let choice_pill  = _("choice_pill").content.cloneNode(true);
	
	let input = tag("input", choice_pill)[0];
	let label = tag("label", choice_pill)[0];
	
		label.innerText = data.file_name;
		label.setAttribute("for","_cc_"+data.link);
		
		input.value = data.link;
		input.id = "_cc_"+data.link;

	main.appendChild(choice_pill);
}


// =================================
// Tab buttons Section
// =================================
let selectedTab = localStorage.getItem("TAB_SELECTED_DASH") || "";

function populateTabItems(item) {
	let items = item || formCollections;
	
	
    let container = _("category_tabs");
    let template = _("tab_button");

    container.innerHTML = "";
	initCategoriesOptions();
	
    items.forEach(item => {
		if(!item.filed){
			return;
		}
		
		if((item.company_id != current_user_company) && current_role != 2 ){
			return;
		};
		
        let clone = template.content.cloneNode(true);
        let button = clone.querySelector(".tab_button");
		
		tag("tab_icon", clone)[0].classList.add(item.tab_icon || "fa-file-text-o");
        tag("tab_text", clone)[0].textContent = charLimit(item.file_name, 40);

        button.title = "Dashboard Item";
        button.setAttribute("name", item.link);
        button.setAttribute("onclick", "tabSetActive(this)");
        button.dataset.link = item.link;
        button.dataset.formId = item.form_id;
        button.dataset.companyId = item.company_id;
		
		if(includeForRequest(item.link)){
			 container.appendChild(clone);
		}
		
		try{
			addOptions(item);
		}catch(e){
			console.error(e);
			//-- 
		}
    });
}

//trying this instead of a direct call
window.addEventListener("load", function () {
    initCategoriesOptions();
	populateTabItems();
	
	//-----------------
	preLoadSelectTab();
	loadSavedSelections();
	
	//----------------- 

	
});


function tabSetActive(elm) {
    if (!elm) {
        return;
    }
    let tabItems = tag("tab_button", _("category_tabs"));
    for (let each of tabItems) {
        each.classList.remove("active");
    }
    elm.classList.add("active");
	
	selectedTab = elm.getAttribute("name");
	localStorage.setItem("TAB_SELECTED_DASH", selectedTab);
	
	let chartContainer = document.querySelectorAll(".charts_parent");
	
	for(each of chartContainer){
		if(each.getAttribute("name") != selectedTab){
			each.classList.remove("show");
		}else{
			each.classList.add("show");
		}
		
	}
}


function preLoadSelectTab() {
    if (!selectedTab) {
        return;
    }

    let tabItems = tag("tab_button", _("category_tabs"));
	if(tabItems.length == 1){
		tabItems[0].click();
		return;
	}
	
    for (let each of tabItems) {
        if (each.getAttribute("name") == selectedTab) {
            each.click();
            return;
        }
    }
}

// ==================================
//Section for year filtering:
// ==================================
let current_year_value = new Date().getFullYear();
let current_month_value = new Date().getMonth();



function initilizeUserStartYear(elm){
	
	let userSavedYear = localStorage.getItem("USER_DASH_START_YEAR");
	if(userSavedYear != null && userSavedYear.length >= 1){
		elm.value = (userSavedYear);
	}
	
	// init the end date as well
	
	_("year_filter_end").value = [current_year_value,addZeros((current_month_value+1),2)].join("-");
}


function saveDashYearStartUser(elm){
	let elmValue = (elm.value);
	
	if(typeof(elmValue) == 'number' || typeof(elmValue) == 'string'){
		localStorage.setItem("USER_DASH_START_YEAR",elmValue)
	}
}


initilizeUserStartYear(_("year_filter_start"));

function filterOnYears(){
	let start = _("year_filter_start").value;
	let end = _("year_filter_end").value;
	
	if (!start) {
        let min = _("year_filter_start").getAttribute("min");
        start = min ? min : current_year_value;
    }

    if (!end) {
		let currentValueDate = [current_year_value,addZeros((current_month_value+1),2)];
		
        end = currentValueDate.join("-");
    }
	
	//If no user defined input, put before current year 
	if(_("year_filter_start").value.length <= 0){
		
		let currentValueDate = [current_year_value,addZeros((current_month_value+1)-1,2)];
		
		_("year_filter_start").value = currentValueDate.join("-");
	}
	
	
    year_ranges = start+","+end;	
}


filterOnYears();


function applyFilterRange(){
	filterOnYears();
	try{
		if(utility.spammingJam()){
			return false;
		};		
	}catch(e){
		//---
	}

	try{
		fetchDashboardStats();
	}catch(e){
		//
	}
}
