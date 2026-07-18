//v1.2 
// Chnages: Adding Flipping of direction if on the right


let targetElm = null;
let tipDelay = 500; // 1000 = 1 sec

function showTooltip(e) {
  e.stopPropagation();

  let tooltip = _('tooltip_container');

  const padding = 10;
  const tooltipWidth = tooltip.clientWidth;
  const bodyWidth = document.body.clientWidth;


  if (e.pageX + tooltipWidth + padding < bodyWidth) {
    tooltip.style.left = (e.pageX + padding) + "px";
  } else {
    tooltip.style.left = (e.pageX - tooltipWidth - padding) + "px";
  }


  tooltip.style.top =
    (e.y + tooltip.clientHeight + 10 < document.body.clientHeight)
      ? (e.y + "px")
      : (document.body.clientHeight + 5 - tooltip.clientHeight + "px");

  if (showTooltips == false) {
    setTimeout(delayedShowTooltip, tipDelay);
  }

  try {
    if (e.target.getAttribute('tooltip').length <= 0) {
      tooltip.classList.remove('visible_t');
    }
  } catch (e) {
    return;
  }

  tooltip.innerText = e.target.getAttribute('tooltip');
  showTooltips = true;
}




let showTooltips = false;
function hideTooltip(){
	 let tooltip = _('tooltip_container');
	 tooltip.classList.remove('visible_t');
	 showTooltips = false;
}


if(_('tooltip_container') == null){
	let tpId = document.createElement('div');
		tpId.setAttribute('id','tooltip_container');
		document.body.appendChild(tpId);
}

function delayedShowTooltip(){
	let tooltip = _('tooltip_container');
	if(showTooltips){
		tooltip.classList.add('visible_t');
	}
}




function showToast(text="Toast message") {	
	let uni = parseInt(Math.random()*10000)+"_tips";		
	let tsIds = document.createElement('div');
		tsIds.setAttribute('id',uni);
		tsIds.classList.add("toast_snackbar","small");
		document.body.appendChild(tsIds);	
  let tst = _(uni);
  tst.innerText = text;
  tst.classList.add("show");
  setTimeout(function(){ tst.className = tst.className.replace("show", ""); }, 3000);
  setTimeout(function(){ tst.remove() }, 5000);
}

var tooltips = document.querySelectorAll('[tooltip]');


function bindTooltips(elm=undefined){
	//Bind all tooltips
	
	if(elm != undefined){
		elm.addEventListener('mousemove', showTooltip);
		elm.addEventListener('mouseleave', hideTooltip);
		elm.addEventListener('click', hideTooltip);
		return elm;
	}
	
	tooltips = document.querySelectorAll('[tooltip]');
	for(var i = 0; i < tooltips.length; i++) {
	  tooltips[i].addEventListener('mousemove', showTooltip);
	}
	for(var i = 0; i < tooltips.length; i++) {
	  tooltips[i].addEventListener('mouseleave', hideTooltip);
	  tooltips[i].addEventListener('click', hideTooltip);
	}
}


bindTooltips();


