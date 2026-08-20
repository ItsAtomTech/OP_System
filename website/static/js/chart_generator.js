// Multiple datasets with their own labels
const datasets = [
  {
    label: "BLIS",
    data: [
      ['2023 - 1st Sem', 12],
      ['2023 - 2nd Sem', 1],
      ['2024 - 1st Sem', 23],
      ['2024 - 2nd Sem', 43],
      ['2025 - 1st Sem', 32],
      ['2025 - 2nd Sem', 71],
    ]
  },
  {
    label: "BSIT",
    data: [
      ['2023 - 1st Sem', 31],
      ['2023 - 2nd Sem', 43],
      ['2024 - 1st Sem', 43],
      ['2024 - 2nd Sem', 12],
      ['2025 - 1st Sem', 76],
      ['2025 - 2nd Sem', 83],
    ]
  },
  {
    label: "BEED",
    data: [
      ['2023 - 1st Sem', 12],
      ['2023 - 2nd Sem', 43],
      ['2024 - 1st Sem', 50],
      ['2024 - 2nd Sem', 85],
      ['2025 - 1st Sem', 32],
      ['2025 - 2nd Sem', 10],
    ]
  },
  
];




qBuilder.server_address = "_";

//getsems_progdata


let year_ranges = "2000,2026";


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


function saveSelection(){
	let allChecked = getAllCheckedPrograms();
	
	program_filter = allChecked;
	
	localStorage.setItem("savedSelections", JSON.stringify(program_filter));
	
	showToast("Selections Applied");
	

		
	try{
		fetchDashboardStats();
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
	
	showSelectionOnButton();
}



function showSelectionOnButton(){
	let elm = _("probation-filter-program");
	
	if(program_filter == null || program_filter.length == 0 || (program_filter[0] == "all" && program_filter.length <= 1)){
		elm.value = "Selected Programs (All)"
	}else{
		elm.value = "Selected Programs ("+program_filter.length+")"
	}
	
}


function randomizeLoadout(counts = 10) {
	if(utility.spammingJam()){
		showToast("Too many actions... please relax a bit!");
		return false;
	};
	

    const allChecks = Array.from(document.querySelectorAll('.check_options_input:not(#check_all_)'));
    
    allChecks.forEach(cb => cb.checked = false);

    const shuffled = allChecks.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(counts, allChecks.length));

    selected.forEach(cb => cb.checked = true);
}
loadSavedSelections();



// ==================================
//Section for year filtering:
// ==================================
let current_year_value = new Date().getFullYear();
_("year_filter_end").value = current_year_value;


function initilizeUserStartYear(elm){
	
	let userSavedYear = localStorage.getItem("USER_DASH_START_YEAR");
	if(userSavedYear != null && userSavedYear.length >= 1){
		elm.value = parseInt(userSavedYear);
	}
}


function saveDashYearStartUser(elm){
	let elmValue = parseInt(elm.value);
	
	if(typeof(elmValue) == 'number'){
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
        end = current_year_value;
    }
	
	//If no user defined input, put before current year 
	if(_("year_filter_start").value.length <= 0){
		_("year_filter_start").value = current_year_value - 1;
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
