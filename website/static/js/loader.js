var main_body_l = document.body;
var doc_head = document.head;
var init_counter = window.setInterval(initgetbody, 110);

var lowResThreshold = 400;

var sessioned = true;
var is_done = sessionStorage.getItem("loaded");
var isLowSpecs = sessionStorage.getItem("specs");
var lowSpecs = false;



var doSomeHeavyStuff = function(){
  for (var i = 1; i <= 1e8; i++){
    ;
  }  
};


let execTime;

function benchmark(){
var start = new Date().getTime();
doSomeHeavyStuff();
var end = new Date().getTime();

// calculate and output the difference
execTime = end - start;    
console.log(end - start);


}


if(isLowSpecs == "low"){
	lowSpecs = true;
	
}


function initgetbody(){	
	if(main_body_l == null){
		

		main_body_l = document.body
		clearInterval(init_counter);
		main_body_l.onload = setTimeout(finished_load, 3500);
		
		
		if(is_done == null || is_done != "done"){
			create_loading();
			//check device specs capabilty by exec time
			benchmark();
			setTimeout(finished_load, 10000);
			
		}
		
		
		
	}	
}



function hover_on(){
	var load_c = document.getElementById("load_c");
	load_c.classList.add("hover_on");
	
}


function load_out(){
	var load_c = document.getElementById("load_c");
	load_c.classList.remove("hover_on");
	load_c.classList.add("load_out");
	
}

function finished_load(){
	
	try{
		load_out();
		setTimeout(fade_out_load, 700);
		setTimeout(remove_load, 1000);
		if(sessioned == true){
			sessionStorage.setItem("loaded","done");
	
		}
		
		//store detecting if device is low on specs
		if(execTime >= lowResThreshold){
			sessionStorage.setItem("specs","low");	
			console.log("Low Device spec detected!");
			lowSpecs = true;
		}
		
		
	
	}catch(e){
		//
	}
}

function fade_out_load(){
	document.getElementById("loader_con").classList.add("fade_out_load");
	
}

function remove_load(){
	
	try{
		document.getElementById("loader_con").remove()
	}catch(e){
		//
	}
}


function create_loading(){
	remove_load();
	var loader_con = document.createElement("div");
		loader_con.className = "loader_con_main secondary_background";
		loader_con.setAttribute("id","loader_con");
		
		loader_con.innerHTML = "<div class='loader_con'><div class='brand_name primary_color_invert'> Loading</div><div class='load_con_progress primary_color_invert' id='load_c'><span class='bx_1 b1'> </span><span class='bx_2 b2'> </span><span class='bx_1 b3'> </span></div>"+
		 "<div class='boxes'>     <div class='box'>         <div></div>         <div></div>         <div></div>         <div></div>     </div>     <div class='box'>         <div></div>         <div></div>         <div></div>         <div></div>     </div>     <div class='box'>         <div></div>         <div></div>         <div></div>         <div></div>     </div>     <div class='box'>         <div></div>         <div></div>         <div></div>         <div></div>     </div> </div>" 

		+"</div>"
	
	
	document.body.appendChild(loader_con);
	
	setTimeout(hover_on, 800);
	
}





