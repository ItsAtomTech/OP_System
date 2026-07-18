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