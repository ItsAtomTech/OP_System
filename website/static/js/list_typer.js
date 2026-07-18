//Utilities
try{
	if(_ == null){
	function _(ghf){
		return document.getElementById(ghf);
	}

	}
}catch(e){
		
function _(ghf){
		return document.getElementById(ghf);
	}	
		
}
	
	
	
const typer_list = {
	
	
	//init all typer forms and also generate from values 
	init_all_forms: function(){
		
		let get_all = document.querySelectorAll("[listtyper]");
		
		
		for(list of get_all){
			
			let id_of = list.getAttribute("listtyper");
			// console.log(id_of);
			list.setAttribute("id", "typer_"+id_of);
			
			try{
				JSON.parse(list.getAttribute('value'));
			}catch(e){
				list.setAttribute("value", '{"values":[]}');
			}
					
			
			let list_tabs_container = list.getElementsByClassName("list_tabs_container")[0];
			
			let typerlist_form = list.getElementsByClassName("typerlist_form")[0];
			
			// console.log(list_tabs_container);
			
			
			// Setting IDs
			list_tabs_container.setAttribute("id","typer_list_"+id_of);
			typerlist_form.setAttribute("id","typer_form_"+id_of);
			
			
			//Setting Event Listeners
			typerlist_form.setAttribute("onkeypress","typer_list.add_item_list("+id_of+")")
			
		
		}
		
		
	},
	

		
	add_item_list: function(){
		
		let key = (event.key);
		
		if(key.toLowerCase() != "enter"){
			return; //Do nothing
		}
		
		if(event.target.value.replaceAll(" ","").length <= 0){
			return; //Do nothing if its all spaces
		}
		
		let text = event.target.value;
		
		this_list = JSON.parse(event.target.parentNode.getAttribute('value'));
		this_list.values.push(text);
		
		stringed = JSON.stringify(this_list);
		event.target.parentNode.setAttribute('value', stringed );

		let parent_id = event.target.parentNode.getAttribute('listtyper');

		typer_list.load_form_values(parent_id);

		event.target.value = "";
		
	},
		
	add_item_list_okay_button: function(){
		
		let target = (event.target.parentNode);
		let this_id = (target.getAttribute("listtyper"));
		
		let input_element = _("typer_form_"+this_id);

		
		if(input_element.value.replaceAll(" ","").length <= 0){
			return; //Do nothing if its all spaces
		}
		
		let text = input_element.value;
		this_list = JSON.parse(event.target.parentNode.getAttribute('value'));
		this_list.values.push(text);
		
		stringed = JSON.stringify(this_list);
		event.target.parentNode.setAttribute('value', stringed );
		let parent_id = event.target.parentNode.getAttribute('listtyper');
		typer_list.load_form_values(parent_id);
		input_element.value = "";
	},
	
	//Generate the tab elements and return the generated node;
	gen_tab_form: function(text, parent, index){
		
		let tab_list_cup = document.createElement("div");
			tab_list_cup.classList.add("tab_list_cup","secondary_background");
			
			tab_list_cup.innerText = text;
			
		let remove_this_tab = document.createElement("span");
			remove_this_tab.setAttribute("onclick","typer_list.remove_this_tab()");
			remove_this_tab.classList.add("remove_this_tab");
			remove_this_tab.setAttribute("parent",parent);
			remove_this_tab.setAttribute("index",index);
			remove_this_tab.innerHTML = "&times;";
			
		tab_list_cup.appendChild(remove_this_tab);
		
		return tab_list_cup;
	},
	
	
	
	//Visually show the data form, id - lets you load sepecefic lister elements
	load_form_values: function(id){
		let get_all;
		
		if(id != null || id != undefined ){
			get_all = document.querySelectorAll("[listtyper='"+id+"']");
		}else{
			get_all = document.querySelectorAll("[listtyper]");
		}

		// console.log(get_all);
		for(list of get_all){
			
			let id_of = list.getAttribute("listtyper");
			
			let list_tabs_container = list.getElementsByClassName("list_tabs_container")[0];
			
			list_tabs_container.innerHTML = "";
			
			let this_list = JSON.parse(list.getAttribute('value'));
			
				for(z=0; z<= this_list.values.length; z++){
					
					if(this_list.values[z] != undefined){
							// console.log(this_list.values[z]);
						let tabs = typer_list.gen_tab_form(this_list.values[z], id_of, z);
						
						list_tabs_container.appendChild(tabs);
					}	
				}	
		}
	
	},
	
	
	//Remove a tab from the lister 
	remove_this_tab: function(){
		try{
			let this_tab = event.target;
			let parent = this_tab.getAttribute("parent");
			let index =	this_tab.getAttribute("index");
			
			let tab_parent = _("typer_"+ parent);
				
				let this_lister = JSON.parse(tab_parent.getAttribute('value'));
				this_lister.values.splice(index,1);
				let serialized = JSON.stringify(this_lister);
				tab_parent.setAttribute('value',serialized);
			
			typer_list.load_form_values(parent);
			
		}catch(e){
			console.warn("error occured on removing the tab: " , event.target);
			console.error(e);
			return false;
		}
			
		
		
		
		
		
		
		
	}
	
	
	
	
	
	
	
}	


typer_list.init_all_forms();
typer_list.load_form_values();
	