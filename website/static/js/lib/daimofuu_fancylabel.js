// Module fot adding fancy label/placeholder onto forms
// v1.2
// This tiny module was made in bundle with daimofuu form lib along side with the daimofuu_fancylabel.css, it can also work on its own


function addFancyPlaceholder(idList=undefined){
	let allLabels = document.getElementsByClassName('placeholder_label');
	
	//implements the ability to selective adding/proccessing of fancy labels
	if(idList != undefined && typeof(idList) == "object"){
		
		allLabels.length = 0;
		allLabels = [];
		
		for(each of idList){
			try{
				let toAddon = document.getElementById(each).parentNode.getElementsByTagName("label")[0];
				allLabels.push(toAddon);
			}catch(e){
				console.log("Error on fancy_label: "+ e);
			}
		}
	}else if(idList != undefined){
		console.warn("Please provide array of id Strings instead of a string");
	}
	
	// console.log(allLabels);
	
	for(each of allLabels){	
		let targetInput = each.getAttribute('for');			
		try{
			let thisinput = document.getElementById(targetInput);
			// console.log(thisinput);
			thisinput.addEventListener('focus',focusPlaceholder);
			thisinput.addEventListener('focusout',focusPlaceholder);
			if(thisinput.value.length > 0){	//Auto focus class on filled forms already
				each.classList.add('infocus');
			}else if(document.activeElement == thisinput){
				each.classList.add('infocus'); //Don't loose focus of the active Element..
			}else{
				each.classList.remove('infocus');
			}			
		}catch(e){
			//-
			console.error(e, "Make sure that label placeholder has 'for' attribute assigned to the target input id: ", targetInput);
		}	
	}	
};
addFancyPlaceholder();

function focusPlaceholder(){
	let formtarget  = event.target;
	let idTag = (formtarget.getAttribute('id'));
	let labelPlaceholder = document.querySelector("[for="+idTag+"]");
	//Apply style to the label accordingly
	if(event.type == "focus"){
		labelPlaceholder.classList.add('infocus');
	}else if(event.type != "focus" && formtarget.value.length <= 0){
		labelPlaceholder.classList.remove('infocus');	
	};
	
}

