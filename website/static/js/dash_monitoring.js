  // ========================================
  // UPDATE GREETING AND SEMESTER
  // ========================================
  let isBannerArtOn = false;
 
 
 function getArtParam() {
    const hash = window.location.hash;

    if (hash == '#art') return 'art';
    if (hash == '#noart') return 'noart';
    return null;
}


  
  let updateGreeting = function () {
    const today = new Date();
    const formatted =
      (today.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      today.getDate().toString().padStart(2, "0") +
      "/" +
      today.getFullYear();
    const el = _("dash_today_date");
    if (el) el.textContent = formatted;

    // Dynamic greeting based on time of day
    const hours = new Date().getHours();
    let greeting = "Hello";
    let timeClass = "";

	if (getArtParam() == 'art') {
		isBannerArtOn = true;
	}else{
	   isBannerArtOn = false;
	}


    if (hours >= 5 && hours < 12) {
      greeting = "Morning";
      timeClass = "morning";
    } else if (hours >= 12 && hours < 17) {
      greeting = "Afternoon";
      timeClass = "afternoon";
    } else if (hours >= 17 && hours < 21) {
      greeting = "Evening";
      timeClass = "evening";
    } else {
      greeting = "Evening";
      timeClass = "evening";
    }

    const greetingEl = _("dash_greeting_time");
    if (greetingEl) {
      greetingEl.textContent = greeting;
    }
	

	
	
	
    const bannerEl = _("dash_greeting_banner");
	
	if(!isBannerArtOn){
		 bannerEl.classList.add("nobanner_art");
	}else{
		 bannerEl.classList.remove("nobanner_art");
	}
	
    if (bannerEl && timeClass) {
      bannerEl.classList.remove("morning", "afternoon", "evening", "night");
      bannerEl.classList.add(timeClass);
    }

    // Dynamic semester calculation
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    let semesterYear;
    if (currentMonth >= 9) {
      semesterYear = currentYear + "-" + (currentYear + 1);
    } else {
      semesterYear = currentYear - 1 + "-" + currentYear;
    }
    const semesterEl = _("dash_semester");
    if (semesterEl) semesterEl.textContent = semesterYear;
  };

  // ========================================
  // FETCH DASHBOARD STATISTICS FROM DATABASE
  // ========================================
  let fetchDashboardStats = async function () {
    try {
		
		if(!_("stat_grid").checkVisibility()){
			return;
		}
		
        
       const params = new URLSearchParams({
        filters: typeof(qBuilder) != 'undefined' ? JSON.stringify(qBuilder.filters) : undefined,
      }); 
        
      const response = await fetch('/dashboard_stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });
        
        
      const result = await response.json();
		
		
      if (result.type === 'success') {
        // Update stat numbers with animation
        updateStatNumber('stat_probation', result.stats.probation);
        updateStatNumber('stat_tracking', result.stats.tracking);
        updateStatNumber('stat_failed', result.stats.failed);
        updateStatNumber('stat_passed', result.stats.passed);
        updateStatNumber('stat_shift', result.stats.advised_shift);
        updateStatNumber('stat_transfer', result.stats.advised_transfer);
      } else {
        console.error('Failed to fetch stats:', result.message);
        // Show error state
        _('stat_probation').textContent = '--';
        _('stat_tracking').textContent = '--';
        _('stat_failed').textContent = '--';
        _('stat_passed').textContent = '--';
        _('stat_shift').textContent = '--';
        _('stat_transfer').textContent = '--';
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Show error state
      _('stat_probation').textContent = '--';
      _('stat_tracking').textContent = '--';
      _('stat_failed').textContent = '--';
      _('stat_passed').textContent = '--';
    }
  };

  // ========================================
  // ANIMATE NUMBER UPDATES
  // ========================================
  function updateStatNumber(elementId, newValue) {
    const element = _(elementId);
    if (!element) return;

    const currentValue = parseInt(element.textContent) || 0;
    
    if (currentValue === newValue) {
      element.textContent = newValue;
      return;
    }

    // Animate the number change
    const duration = 500; // milliseconds
    const steps = 20;
    const stepValue = (newValue - currentValue) / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        element.textContent = newValue;
        clearInterval(interval);
      } else {
        const tempValue = Math.round(currentValue + (stepValue * currentStep));
        element.textContent = tempValue;
      }
    }, duration / steps);
  }


  // ========================================
  // INITIALIZE DASHBOARD
  // ========================================
  updateGreeting();
  fetchDashboardStats();

  // Refresh greeting every 5 seconds
  window.setInterval(updateGreeting, 5000);
  
  // Refresh stats every 5 seconds
  window.setInterval(fetchDashboardStats, 5000);
  
  
  
  // Other interactive functions:
  
function setupLongPress(element, duration = 400) {
    let pressTimer = null;

    element.addEventListener("mousedown", () => {
      element.classList.add("add_hover_effect");
            addSelectionStat(element);
      pressTimer = setTimeout(() => {
        activateCardSelect();
      }, duration);
    });

    element.addEventListener("mouseup", () => {
       element.classList.remove("add_hover_effect");
      clearTimeout(pressTimer);
    });

    element.addEventListener("mouseleave", () => {
       element.classList.remove("add_hover_effect");
      clearTimeout(pressTimer);
    });

    // For mobile touch support too, Noshi-sama~
    element.addEventListener("touchstart", (e) => {
      e.preventDefault();
            addSelectionStat(element);
      pressTimer = setTimeout(() => {
        activateCardSelect();
      }, duration);
    });

    element.addEventListener("click", () => {
      clearTimeout(pressTimer);
    });
    
    element.addEventListener("touchend", () => {
     
      clearTimeout(pressTimer);
    });
}

// Attach it to the card element
let card = document.querySelectorAll(".dash_stat_card.primary_background");
for(each of card){
    setupLongPress(each);
}
card = undefined;


function activateCardSelect(){
    let stats = _("stat_grid");
    stats.classList.add("selection_started");
    
}


function addSelectionStat(elm){
    let parentElm = elm.parentElement;
    if(!parentElm.classList.contains("selection_started") || elm.classList.contains("action_done")){
        return;
    };
    let tog = elm.classList.toggle("de_selected_card");
    
    if(tog){
        elm.setAttribute("title","This Category would be excluded during printing of report...");
    }else{
        elm.setAttribute("title","");
    }
    
}


function endSelectionCards(elm){
        let stats = _("stat_grid");
    stats.classList.remove("selection_started");
}

//setupLongPress(card);

// returns the tag of active selected dash cards
function getActiveTagsCard() {
  let grid = document.getElementById('stat_grid');
  let cards = grid.querySelectorAll('.dash_stat_card:not(.de_selected_card)');
  
  const tags = [];
  cards.forEach(card => {
    const tag = card.getAttribute('tag');
    if (tag) tags.push(tag);
  });
  
  return tags;
}


  
async function initPrintReport(elm){
	let currentFilters = decople(qBuilder.filters);
	let stat_filters = getActiveTagsCard();
	
	
	let combined_filters = {
		currentFilters,
		stat_filters,
	}
	
	localStorage.setItem("reportFile",JSON.stringify(combined_filters));
	showToast("Preparing Data for printing...");
	await sleep(1000);
	
	window.open('/print_report', 'printReport');
	
	
}







//=== Extented Dashboard Charts Breakdown Logic ===
async function getExpandedReport(elm){
	let currentFilters = decople(qBuilder.filters);
	let stat_filters = getActiveTagsCard();
	
	
	let combined_filters = {
		currentFilters,
		stat_filters,
	}
	
	
	
	let params =  [
		{ 
			"name":"currentFilters",
			"value": JSON.stringify(currentFilters),
		},
		{ 
			"name":"stat_filters",
			"value": JSON.stringify(stat_filters),
		}
	];
	
	
	qBuilder.sendQuery(processData,'get_data_per_stat',params);	
	
	
	function processData(dataraw){
		let data = (JSON.parse(dataraw.responseText));
		let stats = data.data_per_stat;
	
	let charts = tag("breakdown_charts",_("more_charts"));
		

	for(each of charts){
		each.parentNode.parentNode.classList.add("hide_chart");
	}
		
		
	for(each of stats){
			
			_("breakdown_"+each.stat_name).parentNode.parentNode.classList.remove("hide_chart");
			
			generateMultiBarChart(
			  removeZeroSemData(each.departments),
			  "breakdown_"+each.stat_name,
			  false  
			);
		
		}
	}
	
	
	function removeZeroSemData(datasets) {
		return datasets.filter((dataset) =>
		dataset.data.some(([sem, val]) => val !== 0)
		);
	}
	
	
}


function proccessExpandedCharts(){
	showToast("Generating Results...");
	getExpandedReport();
	
};


function changeLayout(){
	_("more_charts").classList.toggle("grid_layout_expanded");
	
	
}


// expanded Chart Button  

(function () {
    var more = _("more_charts");
    var arrow = _("revealArrow");

    // Show arrow when user scrolls down far enough
    function onScroll() {
      if (window.scrollY > 120) {
        arrow.classList.add("show");
      } else {
        arrow.classList.remove("show");
      }
    }

    function reveal() {
      more.classList.add("show");
      arrow.classList.remove("show");
	
		proccessExpandedCharts();
			
      setTimeout(function () {
        utility.smoothScroll(_("more_charts"), "start")}, 50);

      arrow.classList.add("hidden");
    }

    document.addEventListener("DOMContentLoaded", function () {
      window.addEventListener("scroll", onScroll, { passive: true });
      arrow.addEventListener("click", reveal);

      onScroll();
    });
  })();






//Notification Observer Service
let failedFetch = 0;
function monitorNotifCounts(){
    failedFetch = errorRate;
    qBuilder.sendQuery(observeNewNotification,"notification_count",undefined,getError);
}


let errorRate = 0;
function getError(data){
    if(errorRate >= 10){
        return;
    }
    errorRate++;
}



let prevNotifications = undefined;
function observeNewNotification(data){
    let res = JSON.parse(data.responseText);
    if(errorRate){
        failedFetch--;
    }
    if(failedFetch >= 1){
        return;
    }

    if(!res){
        return;
    }
    
    

    
    if(res.unseen_notifications >= 1){
        _("notification_button").classList.add("new_notification"); 
        _("notification_button").setAttribute("count",Math.min(res.unseen_notifications, 99));
        _("notification_button").setAttribute("title","Unseen: "+res.unseen_notifications);
    }
    
    
    if(prevNotifications != undefined && prevNotifications < res.total_notifications){

        console.log("A Notification detected");
        showToast("You have a new Notification!");
		
		//Plays the sound bell sound
 		playSfx("sound_bell.mp3");		
		 
         prevNotifications = res.total_notifications;
    }else{
       prevNotifications = res.total_notifications;
       if(res.unseen_notifications >= 1){
        return;
       }
        _("notification_button").classList.remove("new_notification");
       return;
    }
    

    
    
    _("notification_button").classList.add("new_notification");
    localStorage.setItem("shouldReloadNotification", "true");
    errorRate = 0;
}


window.setInterval(monitorNotifCounts, 3000);



