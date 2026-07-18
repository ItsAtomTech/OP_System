// console.log("Atomtech: website | log event")


function go_to(l){

    window.location = l;

}
function go_remove(l){

    var conf_ = window.confirm("Are you sure to Remove this Post?");

    if(conf_ == true){
		loopback();
        window.location = l;
    }else{
        console.log("Remove item aborted!")
    }

}

function loopback(){
	sessionStorage.setItem('loopback',window.location.href);
	
}


function go_back(){
	var lp = sessionStorage.getItem('loopback',window.location.href);
	if(lp == null){
		window.history.back();
	}else{
		window.location = lp;
		
	}
	
}


function go_to_modal(link,onclose){
	
	let page = open_modal(link, 'modal_on_container,page_containment', _('general_container'), false, onclose);
	
}


function oncloseProfile(){
	if(document.getElementsByClassName("modal_iframe_con").length >= 2) return;
	hideDashboardContents(false);
}



function get_started(){
	showModalContent("get_started_modal");
	disableScroll(document.body)
}



async function save_department(){
	localStorage.setItem("DEPARTMENT_ID", _('department').value);	
	showToast("Please Wait...");
	await sleep(1000);
	closeModalContent('get_started_modal');
	enableScroll(document.body);
	

	
	
	sign_up();
}




function sign_up(){
	if(inIframe()){
		postMessageToParent('openModal:{"link":"signup","custom_class":"custom_close"}');
	}else{
		open_modal('signup','custom_close');
	}
	
	
}


function logs_in(){
	if(inIframe()){
		postMessageToParent('openModal:{"link":"login","custom_class":"custom_close"}');
	}else{
		open_modal('login','custom_close');
	}
	
	
}


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



if(typeof(tag) == 'undefined'){
	tag = function (tagName, root = document) {
	  // Return all elements that have the custom attribute [tag="..."]
	  return root.querySelectorAll(`[tag="${tagName}"]`);
	}
}


function mod_item(lid){

     window.location = lid;

}

function search(){
    var sform = document.getElementById("s_form").value;

    try{
        var cat_f = document.getElementById("f_category_s").value;
    }catch(e){
        var cat_f = "";
    }

    window.location = "/search?search="+sform+"&cat="+cat_f;

}
function open_cat(val){
    var sform = document.getElementById("s_form").value;

    window.location = "/search?search="+sform+"&cat="+val;

}

function paginate(url,act){
    var pa_in = document.getElementById("page_num").value;
	
	if(act == "next"){
		pa_in = parseInt(pa_in)+1
		
	}else if(act == "manual"){
		
		pa_in = parseInt(pa_in);
	}else{
		if(parseInt(pa_in) > 1 ){
			pa_in = parseInt(pa_in) - 1;
		}
		
	}
	
	if(url == ""){
		window.location = "?page="+pa_in;
	}else{
		window.location = "?"+url+"&page="+pa_in;
	}

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// ========

function getparam(h){
    get_param = window.location.href

    var url = new URL(get_param)
    var param_value = url.searchParams.get(h);
    return param_value;
}



function get(name){
  const parts = window.location.href.split('?');
  if (parts.length > 1) {
    name = encodeURIComponent(name);
    const params = parts[1].split('&');
    const found = params.filter(el => (el.split('=')[0] === name) && el);
    if (found.length) return decodeURIComponent(found[0].split('=')[1]);
  }
}
var params = '';

function begin(){
	var parted = params.split('?');
	if(params.length > 1){
		return '&';
	}else{
		return '?';
	}
}

//Utilities
const utility = {
	//Spam Detect
  lastClickTime: 0,
  timeThreshold: 500, // Adjust this threshold as needed (in milliseconds)

//Spam button detector
  spammingJam: function() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - this.lastClickTime;

    if (elapsedTime < this.timeThreshold) {
      // Button is being spammed
      return true;
    } else {
      // Button click is within the acceptable threshold
      this.lastClickTime = currentTime;
      return false;
    }
  },
  
 //Smooth Scroll to an Element
  smoothScroll: function(elm,align='center'){
	  
	  elm.scrollIntoView({ behavior: "smooth", block: align, inline: "nearest" });
	  
  },
  
  formatSafe: function(str){
		// Remove spaces and special characters
	  let stripped = str.replace(/[^\w\s]/gi, '').replace(/\s+/g, '');
	  // Convert to lowercase
	  let lowercase = stripped.toLowerCase();
	  return lowercase;  
  },
  
  dateNormalize: function(dtr){
		let options = {
			timeZone: "Asia/Manila",
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		};

		let formatter = new Intl.DateTimeFormat('en-CA', options); // format: YYYY-MM-DD
		let parts = formatter.formatToParts(new Date(dtr));

		let year = parts.find(p => p.type === 'year').value;
		let month = parts.find(p => p.type === 'month').value;
		let day = parts.find(p => p.type === 'day').value;

		return `${year}-${month}-${day}`;
  },
  
  //Returns the Date in formated like: Fri, 2024 MAR 1
  formatDate: function(dateString, simple=false) {
    const dateObject = new Date(dateString);
		if (isNaN(dateObject.getTime())) {
			return null; // Return null if the date is not valid
		} else {
			let options;
			if(simple){
				options = { year: 'numeric', month: 'short', day: 'numeric' };
			}else{
				options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
			}
			
		
			const formattedDate = dateObject.toLocaleDateString('en-US', options);
			return formattedDate;
		}
	},
	monthsSince: function(dateString) {
		const givenDate = new Date(dateString); // Parse the input date string
		const currentDate = new Date(); // Get the current date
		
		// Calculate the year and month differences
		const yearsDifference = currentDate.getFullYear() - givenDate.getFullYear();
		const monthsDifference = currentDate.getMonth() - givenDate.getMonth();
		
		// Total months difference
		return yearsDifference * 12 + monthsDifference;
	},
	  
  
};





//Returns ellipsed string based on limit value
function charLimit(str, limit){
	if(str.length > limit){
		return str.slice(0,limit) + " ...";	
	}
	return str;
}


//remove Spcecial chars
function removeSpecialChars(str) {
  return str.replace(/[^a-zA-Z0-9 ]/g, '');
}


//Convert Underscores to spaces and Capitalize
function formatString(str) {
  if (!str) return "";
  
  const withSpaces = str.replace(/_/g, " ");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

//Format a string into Privacy *** text 
function obfuscateText(str, asString = false) {
  if (typeof str !== "string") return null;

  const obfuscated = str
    .split(" ")
    .map(word => {
      if (word.length <= 2) return word; // too short to obfuscate

      const firstTwo = word.slice(0, 2);
      const lastChar = word.slice(-1);
      const stars = "*".repeat(word.length - 3);

      return firstTwo + stars + lastChar;
    })
    .join(" ");

  if (asString) {
    return obfuscated;
  }

  const span = document.createElement("span");
  span.textContent = obfuscated;
  span.setAttribute("original", btoa(str)); // base64 encode original text
  span.setAttribute("onclick", "toggleObfuscation(this)");
  span.classList.add("obfuscated_text");


  return span.outerHTML;
}

//function helper to get the original to show up
function toggleObfuscation(el) {
  const encoded = el.getAttribute("original");
  if (!encoded) return;

  const original = atob(encoded);

  // helper to obfuscate same way as before
  function obfuscate(str) {
    return str
      .split(" ")
      .map(word => {
        if (word.length <= 2) return word;

        const firstTwo = word.slice(0, 2);
        const lastChar = word.slice(-1);
        const stars = "*".repeat(word.length - 3);

        return firstTwo + stars + lastChar;
      })
      .join(" ");
  }

  // check current state
  if (el.textContent === original) {
    el.textContent = obfuscate(original);
  } else {
    el.textContent = original;
  }
}


// parse status text
function parseStatusText(text){
	let sp = make("span");
		sp.innerText = formatString(text);
		
	try{
		sp.classList.add("status_"+text.toLowerCase(), "status_pill");
	}catch(e){
		//--
	}		
	
	if(text == " "){
		sp.innerText = "None";
	}
	
	return sp.outerHTML;
	
}



function parseSubjectType(data){
	let params = ["","","Laboratory", "Lecture/Lab"];
	
	if(data <= 1 || data == undefined){
		return "";
	}
	return params[data];
	
}

function parseSubjectTypeCode(data){
	let params = ["","","L", "/L"];
	
	if(data <= 1 || data == undefined){
		return "";
	}
	return params[data];
	
}


// for playing sound effects
function playSfx(path) {
	let ext_path;
	
	if(typeof(static_audiomaster_link) != 'undefined'){
		ext_path = static_audiomaster_link + "/" + path;
	}else{
		ext_path = path;
		
	}
	
	let id_path = path.split(".");
	
	
	//play preloaded if available
	if(id_path[0]){
		if(_(id_path[0])){
			_(id_path[0]).currentTime = 0;
			_(id_path[0]).play();
			return false;
		}
	}
	const sfx = new Audio(ext_path);
	
    sfx.play();
}





function secondsToHms(seconds) {
	// Source - https://stackoverflow.com/a
	// Posted by Wilson Lee, modified by community. See post 'Timeline' for change history
	// Retrieved 2026-01-08, License - CC BY-SA 3.0
    const d = Number(seconds);

    if (!Number.isFinite(d) || d < 0) return "0 seconds";

    const units = [
        { label: "hour",   value: Math.floor(d / 3600) },
        { label: "minute", value: Math.floor((d % 3600) / 60) },
        { label: "second", value: Math.floor(d % 60) }
    ];

    return units
        .filter(u => u.value > 0)
        .map(u => `${u.value} ${u.label}${u.value !== 1 ? "s" : ""}`)
        .join(", ");
}



function goFullScreen() {
	let element = document.documentElement;
	
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) { // For Firefox
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) { // For Chrome, Safari, and Opera
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) { // For Internet Explorer/Edge
    element.msRequestFullscreen();
  }
}
// =============

function getOrdinal(num) {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = num % 100;
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

function getCSSVar(varName, element = document.documentElement) {
  return getComputedStyle(element)
    .getPropertyValue(varName)
    .trim();
}


function generatePagination(paginationData = undefined, callbackName , jumpNameCallback = undefined) {
    const container = document.createElement("div");

    let global_current = 1;

    try {
        global_current = page;
    } catch (e) {
        // --
    }

    const currentPage = paginationData?.current_page ?? global_current;
    const totalPages = paginationData?.total_pages ?? 1;

    // Create Prev button
    const prevPage = document.createElement("a");
    prevPage.textContent = "Prev page";
    if (currentPage > 1) {
        prevPage.setAttribute("onclick", `${callbackName}('prev')`);
    }else{
		prevPage.classList.add('disabled');
	}
    container.appendChild(prevPage);

    // Helper function to create a page link
    function createPageLink(pageNumber, isActive = false) {
        const pageLink = document.createElement("a");
        pageLink.textContent = pageNumber;
		
		if(paginationData == undefined){
			 pageLink.textContent = currentPage;
		}else{
			pageLink.textContent = pageNumber;
			
		}
		
        if (isActive) {
            pageLink.classList.add("active");
        }
        pageLink.setAttribute("onclick", `${jumpNameCallback}(${pageNumber})`);
        container.appendChild(pageLink);
    }

    // Generate pagination links based on total pages
    if (totalPages <= 5) {
        // Display all pages if 5 or fewer
        for (let i = 1; i <= totalPages; i++) {
            createPageLink(i, i === currentPage);
        }
    } else {
        // Truncate pages when totalPages > 5
        if (currentPage <= 3) {
            for (let i = 1; i <= 5; i++) {
                createPageLink(i, i === currentPage);
            }
            container.appendChild(document.createTextNode(" ... "));
            createPageLink(totalPages);
        } else if (currentPage >= totalPages - 2) {
            createPageLink(1);
            container.appendChild(document.createTextNode(" ... "));
            for (let i = totalPages - 4; i <= totalPages; i++) {
                createPageLink(i, i === currentPage);
            }
        } else {
            createPageLink(1);
            container.appendChild(document.createTextNode(" ... "));
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                createPageLink(i, i === currentPage);
            }
            container.appendChild(document.createTextNode(" ... "));
            createPageLink(totalPages);
        }
    }

    // Create Next button
    const nextPage = document.createElement("a");
    nextPage.textContent = "Next page";
    if (currentPage < totalPages || paginationData == undefined) {
        nextPage.setAttribute("onclick", `${callbackName}('next')`);
    }else{
		nextPage.classList.add('disabled');
	}
    container.appendChild(nextPage);

    return container;
}

function paginate_data(dir){
	
	if(page == undefined || page == null){
		let page = 1;
	}
	
		
	if(dir == 'next'){
		page = page+1;
	}else if(dir == 'prev'){
		page = page-1;
		if(page <= 0){
			page = 1;
		}
		
	}else{
		page = page+1;
		if(page <= 0){
			page = 1;
		}
		
	}
	
	return page;
}




function sortwith(el){
	var search = get('search');
	var profile_id = get('profile_id');
	var page = get('page');
	
	params = '';
	
	if(search != '' && search != undefined){
		params = params+begin()+'search='+search;
	}	
	if(profile_id != '' && profile_id != undefined){
		params = params+begin()+'profile_id='+profile_id;
	}		
	if(page != '' && page != undefined){
		params = params+begin()+'page='+page;
	}	
	params = params+begin()+'sort='+el;
	
	params = params+begin()+"gal=true";
	go_to(params);
	
	
}
function type_of(el){
	var search = get('search');
	var profile_id = get('profile_id');
	var page = get('page');
	var type = get('type');
	
	params = '';
	
	if(search != '' && search != undefined){
		params = params+begin()+'search='+search;
	}	
	if(profile_id != '' && profile_id != undefined){
		params = params+begin()+'profile_id='+profile_id;
	}		
	
	
	params = params+begin()+'type='+el;
	
	params = params+begin()+"gal=true";
	go_to(params);
	
	
}
function search_(id){
	var search = document.getElementById(id).value;
	var profile_id = get('profile_id');
	
	var sort = get('sort');
	params = '';
	
	
		params = params+begin()+'search='+search;
		
	if(profile_id != '' && profile_id != undefined){
		params = params+begin()+'profile_id='+profile_id;
	}			
	if(sort != '' && sort != undefined){
		params = params+begin()+'sort='+sort;
	}
	
	
	params = params+begin()+"gal=true";
	go_to(params);
	
	
}

//Form Validate if filled
function validateRequired(from_ids,scroll=false){
	
		for(zx=0;zx < from_ids.length;zx++){
		

			try{

				if((document.getElementById(from_ids[zx]).required == true && 	utility.formatSafe(_(from_ids[zx]).value).length <= 0)){
					
					//ignore if hidden by an event but is required
					if(document.getElementById(from_ids[zx]).getAttribute('event_hidden') == 'true'){
						continue;
						// return true;
					}
					
					
					 createDialogue('error', "Fill up required Fields!");
					 document.getElementById(from_ids[zx]).classList.add("form_required");
					 
					 if(scroll){utility.smoothScroll(_(from_ids[zx]))};
					 
					return false;
				}else{
					_(from_ids[zx]).classList.remove("form_required");
				}
		}catch(e){
			//-
			console.log(e);
		}
			 		
		}
			return true;
}




if(get('gal') == 'true'){
	try{
		document.getElementById('thumbs_gal').scrollIntoView(false);
	}catch(e){
		//
	}
}


function formatDate(isoString) {
    const date = new Date(isoString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    return date.toLocaleString('en-US', options);

};

function formatToPHP(amount) {
  return 'P' + Number(amount).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}





var shown = false;
var created = false;
function createDialogue_old(type,data){
	var body = document.getElementById('main_body');
		if(shown){destroy_dia();};
	var dia = document.createElement('div');
		dia.className = "dialogue_con";
		dia.setAttribute('id','dai_con');
		
		switch(type){
		
		case "buy":
		
			dia.innerHTML = "<div class='dialogue_box'><span class='close_dia' onclick='destroy_dia()'>&times;</span> <span class='dia_title'>Order and Send Notification to the Shop owner?</span> <hr class='line_2'>"+ 
			
			"<button class='buy_button' onclick='place_order_buy("+data+")'> Proceed </button>"
			
			+" </div>"
		
			created = true;
		break;	
		case "comm":
		
			dia.innerHTML = "<div class='dialogue_box'><span class='close_dia' onclick='destroy_dia()'>&times;</span> <span class='dia_title'>Confirm and Send Notification to the User?</span> <hr class='line_2'>"+ 
			
			"<button class='buy_button' onclick='place_order_comm("+data+")'> Proceed </button>"
			
			+" </div>"
		
			created = true;
		break;	
		case "wait":
		
			dia.innerHTML = "<div class='dialogue_box'><span class='close_dia' onclick='destroy_dia()'>&times;</span> <span class='dia_title'> Working ... Please wait</span> <hr class='line_2'> </div>"
		
			created = true;
		break;	
		case "error":
		
			dia.innerHTML = "<div class='dialogue_box '><span class='close_dia' onclick='destroy_dia()'>&times;</span> <span class='dia_title'> "+data+"</span> <hr class='line_2'> </div>"
		
			created = true;
		break;		
		case "info":
		
			dia.innerHTML = "<div class='dialogue_box '><span class='close_dia' onclick='destroy_dia()'>&times;</span> <span class='dia_title'> "+data+"</span> <hr class='line_2'> </div>"
		
			created = true;
		break;
		case "custom" :
		
			dia.innerHTML = "<div class='dialogue_box'><span class='close_dia' onclick='destroy_dia()'>&times;</span>  "+data+" </div>"	
				
		
		break;
		default:
			
			console.log(type + " dialog not known");
			setTimeout(destroy_dia, 500);
		break;
		
		}
		
		
		
		
		
		if(created){
			shown = true;
			body.appendChild(dia);
		}
	
	
}


function createDialogue(type, data,config={}) {
    const body = document.getElementById('main_body');
    if (shown) { destroy_dia(); }
    const dia = document.createElement('div');
    dia.className = "ns_modal_container_standard";
    dia.setAttribute('id', 'dai_con');

    // Define icon classes based on dialogue type
    let iconClass = "fa-info"; // Default icon is "info"
	
	let icontype = type;
		config.type ? icontype = config.type : false;
	
    switch (icontype) {
        case "error":
            iconClass = "fa-exclamation-circle"; // Error icon
            break;
        case "wait":
            iconClass = "fa-spinner fa-spin"; // Loading spinner
            break;
        case "info":
            iconClass = "fa-info-circle"; // Info icon
            break;
        case "success":
            iconClass = "fa-check-circle"; // Check icon
            break;
        case "confirm":
        case "remove_order":
        case "remove_record_data":
        case "remove_category":
        case "remove_barangay":
            iconClass = "fa-question-circle"; // Question mark for confirmation
            break;
    }

    // HTML template with dynamic icon and action buttons
    dia.innerHTML = `
        <div class="ns_container">
            <div class="ns_modal_content">
                <span class="fa ${iconClass} ns_modal_icon medium"></span>
                <p class='small'>${type === "custom" || type === "custom2" ? data : getMessage(type, data)}</p>
                <div class="choices_button">
                    ${getButtons(type, data)}
                    ${shouldShowCloseButton(type) ? '<button class="ns_button cancel" onclick="destroy_dia()">Close</button>' : ''}
                </div>
            </div>
        </div>`;

    if (type === "custom2") {
        const csCon = document.createElement('div');
        csCon.className = 'ns_modal_content';
        csCon.innerHTML = `<span class="fa ${iconClass} ns_modal_icon medium"></span>`;
        csCon.appendChild(data);
        dia.querySelector('.ns_container').innerHTML = "";
        dia.querySelector('.ns_container').appendChild(csCon); // Embeds the passed-in custom HTML
    }

    if (!shown) {
        shown = true;
        body.appendChild(dia);
    }

    function getMessage(type, data) {
        switch (type) {

            case "confirm":
                return data.message;
            case "remove_record_data":
                return "Confirm deletion of data?";
            case "remove_category":
                return "Confirm deletion of category.";
            case "remove_barangay":
                return "Are you sure to delete this item?";
            case "wait":
                return "Working... Please wait";
            case "error":
                return data;
            case "info":
                return data;
            case "success":
                return data;
            default:
                return "";
        }
    }

    function getButtons(type, data) {
        switch (type) {
            case "buy":
                return `<button class="ns_button" onclick="place_order_buy(${data})">Proceed</button>`;
            case "comm":
                return `<button class="ns_button" onclick="place_order_comm(${data})">Proceed</button>`;
            case "confirm":
                return `<button class="ns_button" onclick="${data.responseRec}='pass'">Yes</button>
                        <button class="ns_button cancel" onclick="${data.responseRec}='fail'">No</button>`;
            case "remove_order":
            case "remove_record_data":
            case "remove_category":
            case "remove_barangay":
                return `<button class="ns_button" onclick="sendDeleteBarangay(${data})">Delete</button>`;
            default:
                return ""; // No additional buttons for other types
        }
    }

    function shouldShowCloseButton(type) {
        return type !== "confirm" && type !== "custom" && type !== "custom2";
    }

    function capitalize(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
}



var timeout = 1000000; // 1000000ms = 1000 seconds
var lib = function() {}; // Let's create an empty object 
function setFoo() {
    lib.foo = "bar"; // set the variable foo within the object lib to equal bar
}
// This is the promise code, so this is the useful bit
function ensureFooIsSet(timeout) {
    var start = Date.now();
    return new Promise(waitForFoo); // set the promise object within the ensureFooIsSet object
 
    // waitForFoo makes the decision whether the condition is met
    // or not met or the timeout has been exceeded which means
    // this promise will be rejected
    function waitForFoo(resolve, reject) {
        if (window.lib && window.lib.foo)
            resolve(window.lib.foo);
        else if (timeout && (Date.now() - start) >= timeout)
            reject(new Error("timeout"));
        else
            setTimeout(waitForFoo.bind(this, resolve, reject), 30);
    }
}

// Custom User Confirm
function askUser(messageText="Confirm action.",callback,argumentsList,extra={}){
	if(!argumentsList){
		console.error("You should pass the arguments list as 'arguments'. ", "This method can only be called inside functions.");
		return;
	}
	let datas = {
		message: messageText,
		responseRec: 'lib.foo',
	};
	lib.foo = undefined;
	
	if(_('_custom_cofirm_dialog')){
		show_custom_confirm(datas);
	}else{
		createDialogue('confirm',datas,extra);
	}
	

	// This runs the promise code
	ensureFooIsSet(timeout).then(function(){
		
		let customArgs = [];
		for(args of argumentsList){
			customArgs.push(args);
		}
		customArgs.push(lib.foo);
		
		callback.apply(callback, customArgs || []); 
		//callback(arguments);
		
		
	});
	
}

function show_custom_confirm(datas){
	_("_custom_cofirm_dialog").style.display = "flex";
	console.log(datas);
	
	
	
}


 
function log_out(){
	if(inIframe()){
		postMessageToParent("goToParent:logout");
	}else{
		go_to('logout');
	}
}


function destroy_dia(){
	var dia = document.getElementById('dai_con');
	try{
		dia.remove();
		shown = false;
	}catch(e){
		//
	}
}


function gen_link(lk){
	var ln = window.location.host;
	var prot = window.location.protocol;
	
	window.prompt("Here is your share link: ", prot+'//'+ln+'/user_gallery?profile_id='+lk);
	
}



function typeEffect(elementId, text, speed = 80) {
    const el = _(elementId);
    if (!el) return;

    let index = 0;
    el.innerHTML = '';
    
    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.style.display = 'inline-block';
    cursor.style.animation = 'blinks 0.8s infinite';
    el.appendChild(cursor);

    function typeNext() {
        if (index < text.length) {
            const jitter = Math.random() * 100; // random jitter
            cursor.insertAdjacentText('beforebegin', text.charAt(index));
            index++;
            setTimeout(typeNext, speed + jitter);
        }
    }

    typeNext();
}


function del_notification(l){

    var conf_ = window.confirm("Are you sure to remove this Notification?");

    if(conf_ == true){
		createDialogue('wait', "");
        var form_data = new FormData();

        form_data.append("notif_id", l);


        var ajax_request = new XMLHttpRequest();

        ajax_request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(this.responseText == "success"){

             window.location = "";
			}
                  }else if(this.readyState == 4 && this.status == 0){
					 createDialogue('error', "Can't connect to server!");
				  };
             }


        ajax_request.open("POST", "remove_notificaton");
        ajax_request.send(form_data);


    }else{
        console.log("Remove item aborted!")
    }

}


function del_order(l){

    var conf_ = window.confirm("Are you sure to Remove this Order?");

    if(conf_ == true){
		createDialogue('wait', "");
        var form_data = new FormData();

        form_data.append("order_id", l);


        var ajax_request = new XMLHttpRequest();

        ajax_request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(this.responseText == "success"){

             window.location = "";
			}
                  }else if(this.readyState == 4 && this.status == 0){
					 createDialogue('error', "Can't connect to server!");
				  };
             }


        ajax_request.open("POST", "remove_order");
        ajax_request.send(form_data);


    }else{
        console.log("Remove item aborted!")
    }

}

function confirm_trans(l){

    var conf_ = window.confirm("Are you sure to Confirm this Transaction?");

    if(conf_ == true){
		createDialogue('wait', "");
        var form_data = new FormData();

        form_data.append("order_id", l);

        var ajax_request = new XMLHttpRequest();

        ajax_request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(this.responseText == "done"){

             window.location = "";
			}
                  }else if(this.readyState == 4 && this.status == 0){
					 createDialogue('error', "Can't connect to server!");
				  };
             }


        ajax_request.open("POST", "transact_confirm");
        ajax_request.send(form_data);


    }else{
        console.log("Confirm item aborted!")
    }

}


function close_alert(als){
    als.remove();
}


function ask_remove_folio(id){
	let conf = window.confirm("Are your sure to remove this Folio?");
	
	console.log(id);
	
	if(conf){
		go_to('/remove_folio?id='+id);
		
	}
	
}

function decople(arr){
	return JSON.parse(JSON.stringify(arr));
	
}


function modifyValue(mode, id){
	let target = _(id);
	let min = parseInt(target.getAttribute("min"));
	
	let newValue = target.value;
	
	
	if(mode == "add"){
		newValue++;
	}else{
		if(newValue > min){
			newValue--;
		}
	}
	
	target.value = newValue;
	
	
}
// Form JSON Generator section



//LowEndDevice compensator

if(lowSpecs){
	
	let performant = document.querySelectorAll("[performance]");
	
	for(elm of performant){
		
		elm.classList.add("less_effect");
		
	}
}



function activate(elm){
	let parent_elm = elm.parentNode.parentNode;
	let all_active = parent_elm.getElementsByClassName("active");

	
	for(each of all_active){
		each.classList.remove("active");
	}
	elm.classList.add("active");
	
	
};





//Modal Functions

function showModalContent(id){
	let modals = document.getElementById(id);
		modals.style = "";
	
	setTimeout(reRender, 100);
	function reRender(){
		modals.classList.add("show");
		modals.removeAttribute("inert");
	}
	

}

function closeModalContent(id){
	let modals = document.getElementById(id);
	modals.classList.remove("show");
	modals.setAttribute("inert","");
	
	setTimeout(noRender, 300);
	function noRender(){
		modals.style.display = "none";
	}
	
}


function generateUUID() {
    let uuid = '', i, random;
    for (i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            uuid += '-';
        } else if (i === 14) {
            uuid += '4';
        } else if (i === 19) {
            random = (Math.random() * 16) | 0;
            uuid += (random & 0x3 | 0x8).toString(16);
        } else {
            random = (Math.random() * 16) | 0;
            uuid += random.toString(16);
        }
    }
    return uuid;
}


function copyToClip(text) {
    if (!text) return console.error("No text provided to copy.");

    // Use modern Clipboard API if available
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => console.log("Copied to clipboard:", text))
            .catch(err => console.error("Failed to copy:", err));
    } else {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            document.execCommand("copy");
            console.log("Copied to clipboard:", text);
        } catch (err) {
            console.error("Failed to copy:", err);
        }

        document.body.removeChild(textarea);
    }
}


// For Debugging Only

function test1(confirmed = undefined){
	
	if(confirmed == undefined){
		askUser("Hello",test1,arguments);
		return;
	}
	
	destroy_dia();
}



function monitorAlerts(fadeTime = 5000, removeDelay = 500) {
  const alerts = document.querySelectorAll('.alert_dail');
  
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.classList.remove('slideInRight');
      alert.classList.add('fadeOut');
      setTimeout(() => {
        alert.remove();
      }, removeDelay);
    }, fadeTime);
  });
}





// Extra Functions used for passing params to printing doc/receipt
function extract_datas_for_docs(elm=undefined){
	if(elm == undefined){
		 console.error("There is no elm specified to extract data from");return false;
	}
	
	
	let currentAll = decople(ALL_INFO);
	let currentHistory = decople(HISTORY_INFO);
	
	//Apply Parsed Data ====
	let prog = _("progress_option").selectedOptions[0] ? _("progress_option").selectedOptions[0].innerText : "N/A";	
	let stat = _("status_input").selectedOptions[0] ? _("status_input").selectedOptions[0].innerText : "N/A";	
	let stu_name = (tag("student_name",elm)[0].innerText);
	
	
	currentAll.progress = prog;
	currentAll.status = stat;
	currentAll.student_name = stu_name;
	
	currentAll.subject_name = tag("subject",elm)[0].innerText;	
	
	currentAll.subject_name = tag("subject",elm)[0].innerText;
	
	
	let printableData = {currentAll, currentHistory};
	
	localStorage.setItem("printFile", JSON.stringify(printableData))
	return true;
}


async function printDocReceipt(){
	if(!extract_datas_for_docs(_("view_stat_1"))){
		return;
	};
	
	showToast("Preparing Document ... ");
	await sleep(1200);
	
	window.open('/print_receipt', 'printRe');
	
	
}