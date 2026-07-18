
if(typeof(make) == 'undefined'){
	make = function(df){
		return document.createElement(df);
	}
}

if(typeof(_) == 'undefined'){
	_ = function(df){
		return document.getElementById(df);
	}
}


let sdsf = window.setInterval(getCurrent,3000);

async function getSummaryGeneral(callback=undefined){
	var form_data = new FormData();
	form_data.append('type', 'data');
	//createDialogue("wait", "Please wait...");
	var ajax_request = new XMLHttpRequest();
	ajax_request.onreadystatechange = async function() {
		if (this.readyState == 4 && this.status == 200) {		
			let responseData = JSON.parse(this.responseText);
			summaryData = responseData;
			if(callback){
				await callback(responseData); //Callback	
			}
		}else if(this.readyState == 4 && this.status == 0){
			 createDialogue('error', "Server Connection error!");		 
		}else if(this.readyState == 4 && this.status == 404){
			createDialogue('error', "Something went wrong!");	
		};
	}
	ajax_request.open("POST", "get_current");
	ajax_request.send(form_data);
}


function timeElapsed(dateTimeString) {
    const startTime = new Date(dateTimeString);
    const currentTime = new Date();
    const timeDiff = currentTime - startTime;
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    if (years > 0) {
        return years + ' year' + (years > 1 ? 's' : '') + ' ago';
    } else if (months > 0) {
        return months + ' month' + (months > 1 ? 's' : '') + ' ago';
    } else if (weeks > 0) {
        return weeks + ' week' + (weeks > 1 ? 's' : '') + ' ago';
    } else if (days > 0) {
        return days + ' day' + (days > 1 ? 's' : '') + ' ago';
    } else if (hours > 0) {
        return hours + ' hour' + (hours > 1 ? 's' : '') + ' ago';
    } else if (minutes > 0) {
        return minutes + ' minute' + (minutes > 1 ? 's' : '') + ' ago';
    } else {
        return seconds + ' second' + (seconds > 1 ? 's' : '') + ' ago';
    }
}

function getCurrent(){
	getSummaryGeneral(showDash);
	
	qBuilder.sendQuery(loadTable);
}

function showDash(data){
	// console.log(data);
	try{
	let stats = JSON.parse(data.status);
	let extId = 1;
	for(each of stats){
		try{
			_("s"+extId).innerText = onOff(each);
			_("z"+extId).innerText = "Zone # "+ extId;
		}catch(e){
			//-
		}
		extId++;
	}
	
	_("up_date").innerText = data.date + " (" + timeElapsed(data.date) + ")";
		}catch(e){
		//--
	}
	function onOff(df) {
        if (parseInt(df) === 1) {
            return "On";
        }
        return "Off";
    }
}


function removeLogs(){
	let numdays = parseInt(_("days_select").value);
	del_data_record(numdays);
}
