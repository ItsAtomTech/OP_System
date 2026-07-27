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
	let data = localStorage.getItem("printFuelRequest");
	
	if(data){
		data = JSON.parse(data);
	}

	getInformationData(data);
	
	
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
		
		let idPost = undefined
		console.log(data.id);
			idPost = data.id;
		
		let params =  [
			{"name": "request_id" , "value": idPost},
			
		];
		
	qBuilder.sendQuery(generateDataOnDoc,'get_fuel_request_data_by_id',params);	
}


let canvasIds = {};
async function generateDataOnDoc(dataraw) {
    let res_data = (JSON.parse(dataraw.responseText));
    let fuel_req = res_data.fuel_req;
    let vehicle  = res_data.vehicle;
    let raw_json = res_data.json_data;

    try {
        raw_json = JSON.parse(raw_json);
    } catch(e) {
        raw_json = {};
    }

    console.log(raw_json);

    // Header Info
    _('last_fuel_date').innerText   = raw_json.last_fuel_date   || '--';
    _('last_fuel_issued').innerText = raw_json.last_fuel_issuedltrs || '--';
    _('date_requested').innerText   = utility.formatDate(fuel_req.date);
    _('frs_number').innerText       = fuel_req.fuel_requisition_no || '--';

    // Vehicle Info
    _('plate_no').innerText            = vehicle.plate_no        || '--';
    _('recent_driver').innerText       = raw_json.recent_driver  || '--';
    _('avg_kml').innerText             = vehicle.average_km      || '--';
    _('vehicle_desc').innerText        = vehicle.description     || '--';
    _('driver_requested_by').innerText = fuel_req.driver_name    || '--';
    _('branch').innerText              = fuel_req.branch_id      || '--';

    // Odometer
    let last_fuel = [];
    try {
        last_fuel = JSON.parse(fuel_req.last_fuel_recordltrs);
    } catch(e) {
        last_fuel = [['--', '--']];
    }
    _('prev_odo').innerText = last_fuel[0][0];
    _('curr_odo').innerText = last_fuel[0][1];

    // Calculated Fields — from raw_json
    _('dist_travelled').innerText    = raw_json.dist_travelled_kms  || '--';
    _('est_fuel_consumed').innerText = raw_json.est_fuel_consumed   || '--';
    _('actual_fuel_beg').innerText   = raw_json.actual_fuel_beg_l   || '--';
    _('actual_fuel_end').innerText   = raw_json.actual_fuel_endl    || '--';
    _('theo_end').innerText          = raw_json.theo_end_l          || '--';
    _('surplus_over').innerText      = isNaN(parseFloat(raw_json.so_theoactl_end_l))
                                       ? '--'
                                       : parseFloat(raw_json.so_theoactl_end_l).toFixed(2);

    // Current Fuel Request
    _('supplier_name').innerText  = fuel_req.supplier_vendor_name || '--';
    _('no_of_ltrs').innerText     = raw_json.no_of_ltrs           || '--';
    _('prev_cost_ltr').innerText  = raw_json.prev_costltr         || '--';
    _('total_cost').innerText     = (parseFloat(raw_json.no_of_ltrs) * parseFloat(raw_json.prev_costltr)) 
                                    ? (parseFloat(raw_json.no_of_ltrs) * parseFloat(raw_json.prev_costltr)).toFixed(2) 
                                    : '--';

    // Activity & Crew
    _('activity_type').innerText = fuel_req.activity_type    || '--';
    _('crew_1').innerText        = fuel_req.crewoccupants1   || '--';
    _('crew_2').innerText        = fuel_req.crewoccupants2   || '--';
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

}

	

//Calls this function when the page is done loading
getPrintableData();