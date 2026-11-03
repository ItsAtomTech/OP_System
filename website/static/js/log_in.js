	var s = false 
function toggle_pass(slf, input){
	

	
	if(!s){
		slf.innerHTML = "hide"
		document.getElementById(input).setAttribute("type","text");
		s = true;
		
	}else{
		slf.innerHTML = "show"
		document.getElementById(input).setAttribute("type","password");
		s = false;
		
	}
		
}

//---- Autoload last typed name

function rememberLastName(){
	let name = _("user_email").value;
	sessionStorage.setItem("TEMP_NAME", name);
}


function loadPrev(){
	let tempSave = sessionStorage.getItem("TEMP_NAME", name);
	if(tempSave){
		_("user_email").value = tempSave;
	}
}

loadPrev();