function modify_name(act){
	if(act == "open"){
	var current_name = document.getElementById('username').innerHTML;
		document.getElementById('f_name_info').value = current_name;
		document.getElementById('edit_nm').style.display = "flex";
	}else if(act =="close"){
		document.getElementById('edit_nm').style.display = "none";
		
	}
	
}






// new




function verify(){
	var display = document.getElementById('ind_c');
	var p1 = document.getElementById('p1').value;
	var p2 = document.getElementById('p2').value;
	var sub_b = document.getElementById('sub_b');
	
	if(p1 != p2){
		display.innerHTML = "<i style='color:red;'>Password did not matched!</i>";
		sub_b.disabled=true;
	}else{
		display.innerHTML = "<i class='secondary_color' >Password matched!</i>";
		sub_b.disabled=false;
	}
	
	
	
	
	
}






function verifyr(){
	var display = document.getElementById('ind_cr');
	var p1 = document.getElementById('pr1').value;
	var p2 = document.getElementById('pr2').value;
	var sub_b = document.getElementById('sub_br');
	
	if(p1 != p2){
		display.innerHTML = "<i style='color:red;'>Password did not matched!</i>";
		sub_b.disabled=true;
	}else{
		display.innerHTML = "<i class='secondary_color' >Password matched!</i>";
		sub_b.disabled=false;
	}
	
	
	
	
	
}



var pa = false;
function tog_pane(){
var pane = document.getElementById('a_pane');
	if(pa){
		pane.style.display = 'none';
		pa = false;
	}else{
		pane.style.display = 'flex';
		pa = true;
		
	}
	
}


function change_avatar(l,r){
	var fin = document.getElementById('avatar_in').value=l;
	
	document.getElementById('avs').src = r.childNodes[1].src;
	tog_pane();
}


//new
let HAS_CHANGES = false;
function updateEmailAddress(silent=false){
	
	if(!HAS_CHANGES){
		if(!silent){showToast("No changes");}
		return false;
	}else if(CURRENT_EMAIL == _('user_email').value){
		if(!silent){showToast("No changes");}
		return false;
	}
	
	let params = [
		{'name': 'email',
		'value': _('user_email').value,
		}
	]
	qBuilder.server_address = "_";
	qBuilder.sendQuery(updateFeedback, 'update_my_email',params);
}


function updateFeedback(data){
	let res_data = (JSON.parse(data.responseText));
	createDialogue(res_data.type, res_data.message);
	CURRENT_EMAIL = _('user_email').value;
	
}
