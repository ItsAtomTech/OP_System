 function acard_get_size(elm){ //getting the size of an element	
	var refh = elm;
	var size = ['',''];

try{
	if(refh.offsetHeight){
		
		size[1] = refh.offsetHeight;
		size[0] = refh.offsetWidth;
		
	}else if(refh.style.pixelHeight){
		size[1] = refh.style.pixelHeight
		size[0] = refh.style.pixelWidth
		
	}
	
	}catch(e){
		console.log("Account_card: Either the Element is invalid");
	}
	return size;
}

var card_is_open = false;



function togle_dia_user(tis){
	var rect = tis.getBoundingClientRect(); // pos of element origin
	var b_rect = document.body.getBoundingClientRect(); //relative screen 
	var card_con = document.getElementById("main_card_con");
	

	if(card_is_open == false){
	card_con.classList.add("_show_dia_app");
	card_con.classList.remove("_hide_dia_app");		
	card_con.setAttribute("style","");
	
	
		if(rect.left + acard_get_size(card_con)[0] >= b_rect.width ){
			console.log("Overlap");
		
		}else{
		
			
		}
	card_con.style.left = (rect.left+40)+"px";
	card_is_open = true;
	
	}else{
			
	card_con.classList.remove("_show_dia_app");		
	card_con.classList.add("_hide_dia_app");		
	card_is_open = false;
	}
	
	
	
}





