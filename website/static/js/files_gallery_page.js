



function loadAllFormsToView(){
	
	_("form_list_main").innerHTML = "";
	
	let requestedForms = getQueryForms();
	
	
	for(each of requestedForms){	

		if(!each.filed){
			continue;
		}
	
		let clone = document.importNode(_("form_card").content, true);
		let name = tag("name",clone)[0];
		let text_details = tag("text_details",clone)[0];
		let index = tag("index",clone)[0];

		
		
		name.innerText = each.file_name;
		text_details.innerText = each.file_description;
		
		index.setAttribute("index",each.form_id);
		index.setAttribute("link",each.file_link);
		
		// console.log(each);
		
		_("form_list_main").appendChild(clone);
	}
	
	if(requestedForms.length <= 0){
		_("form_list_main").innerHTML = "No matching Form Found for this name... :-( ";
	}
	
	
}


//Simulating the Server Query, if ever implemented for backend use.
function getQueryForms(){
	
	let search_input = _("search_input").value ? _("search_input").value : undefined;
	

		if (search_input) {
			let collected = decople(formCollections);

			collected = collected.filter(form => {
				const query = search_input.toLowerCase();
				return (
					form.name.toLowerCase().includes(query) ||
					form.small_description.toLowerCase().includes(query)
				);
			});

			return collected;
		}
			
	return formCollections;
	
}
loadAllFormsToView();


//Search Handle
async function searchLocal(){
	
	if(_("search_input").value.length <= 0){
		loadAllFormsToView();
	};
	
	if(utility.spammingJam()){
		await sleep(300);
		return;
	}

	loadAllFormsToView();
	
}



function openForm(elm){
	let indexTarget = elm.getAttribute("link");
	console.log(indexTarget);
	
	go_to(indexTarget);
	
	
}