var s = false;
function show_pass_in(slf, input){
		
	if(!s){
		slf.innerHTML = "hide";
		document.getElementById(input).setAttribute("type","text");
		s = true;
	}else{
		document.getElementById(input).setAttribute("type","password");
		slf.innerHTML = "show";
		s = false;
	}
	
	
}


function check_pass(g){
	var sub_b = document.getElementById('_s_');
	var pass1 = document.getElementById('pass1');
	var i_n_f = document.getElementById('i_n_f');
	
	if(g.value == pass1.value){
		
		sub_b.disabled = false;
		i_n_f.innerHTML = ': Matched';
		i_n_f.style.color = 'green'
	}else{
		sub_b.disabled = true;
		i_n_f.innerHTML = ': Not matched';
		i_n_f.style.color = 'red'
	}
	
	
}



// ===================
// Signup Process
// ===================

async function proccess_signup(){
	let dep_id = localStorage.getItem("DEPARTMENT_ID");	
	
	if (!_("signup_form").checkValidity()) {
		return;
	}
	
	if(utility.spammingJam()){
		return showToast("Too many actions!");
	}
	
	createDialogue("wait");
	
	let params = [
		{'name':"username", 'value': _('name').value},
		{'name':"email", 'value': _('email').value},
		{'name':"password", 'value': _('pass1').value},
		{'name':"password_c", 'value': _('pass2').value},
		{'name':"department", 'value': dep_id},
	]
	
	
	qBuilder.sendQuery(feedback,'add_account_json',params);
	
	async function feedback(data){
		let resData = JSON.parse(data.responseText);
		destroy_dia();
		if(!resData){
			return;
		}
		showToast(resData.message);
		if(resData.type == "success"){
			await sleep(1000);
			create_loading();
			await sleep(1000);
			go_to("/");
		}else{
			//--
		}
	}
	
}

	
_('signup_form').addEventListener('submit', function(e) {
    const form = this;
	e.preventDefault();  
    if (!form.checkValidity()) {
        form.reportValidity();      // show default browser validation
    }
});

