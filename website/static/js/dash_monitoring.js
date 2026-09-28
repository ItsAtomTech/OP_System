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
    
	
	
  };

// ========================================
// FETCH DASHBOARD STATISTICS FROM DATABASE
// ========================================


let TOTAL_APPROVED = 0;
let PENDING_TOTAL = 0;
let TOTAL_RECORDS = 0;
let TOTAL_PROCESSED = 0;

let firstRun = true;
let collectedDatas = {};

let fetchDashboardStats = async function () {
	
	if(!_("stat_grid").checkVisibility()){
		return;
	}
	
	//applyFilterRange();
	
	let custom_param = [
		{"name":"year_ranges", value: year_ranges},
	];
	
	let stats = await qBuilder.sendPromise(getFuelRequisitionStats, "get_fuel_requisition_stats",custom_param, errorHandler);	
	
	
	let stats_2 = await qBuilder.sendPromise(getPurchaseRequestStats, "get_purchase_request_stats",custom_param, errorHandler);
	
	
	if(firstRun){
		applyFilterRange();
		firstRun = false;
		return;
	}
	
	processTotals();
	
	//Fuel Requesition Files
	function getFuelRequisitionStats(data){
			TOTAL_APPROVED = 0;
			PENDING_TOTAL = 0;
			TOTAL_PROCESSED = 0;
		
		let resData = (JSON.parse(data.responseText));
		let forms = resData;
			collectedDatas["fuel_requisition"] = forms;
			
		let kpi_data = forms.data.kpi;
		
		let unknown = kpi_data.count_by_status["Unknown"];
		let approved = kpi_data.count_by_status["approved"];
		
				
		if(unknown != undefined || approved != undefined){
			PENDING_TOTAL  += Number.isNaN(Number(unknown))  ? 0 : (unknown  || 0);
			TOTAL_APPROVED += Number.isNaN(Number(approved)) ? 0 : (approved || 0);
		}
				
		
	}
	
	
	//Purchase Request Files
	function getPurchaseRequestStats(data){

		
		let resData = (JSON.parse(data.responseText));
		let forms = resData;
			collectedDatas["purchase_request"] = forms;
		
		
		
		let kpi_data = forms.data.kpi;
		
		let unknown = kpi_data.count_by_status["Unknown"];
		let approved = kpi_data.count_by_status["approved"];
		let pending = kpi_data.count_by_status["pending"];
		let processed = kpi_data.count_by_status["processed"];
		

			
		
		if(unknown != undefined || approved != undefined || pending != undefined || processed != undefined){
			PENDING_TOTAL  += Number.isNaN(Number(unknown))  ? 0 : (unknown  || 0);
			PENDING_TOTAL  += Number.isNaN(Number(pending))  ? 0 : (pending  || 0);
			TOTAL_PROCESSED  += Number.isNaN(Number(processed))  ? 0 : (processed  || 0);
			
			TOTAL_APPROVED += Number.isNaN(Number(approved)) ? 0 : (approved || 0);
		}
				
		
	}
	
	
	
	function processTotals(){
			
		TOTAL_RECORDS = TOTAL_APPROVED + PENDING_TOTAL + TOTAL_PROCESSED;
		
		updateStatNumber("stat_total",TOTAL_RECORDS);
		updateStatNumber("stat_approved",TOTAL_APPROVED);
		updateStatNumber("stat_pending",PENDING_TOTAL);
		updateStatNumber("stat_processed",TOTAL_PROCESSED);
		
	}
	
	
	proccessChartEvents();
	
	//To-Do: Fetch Dashboard Data here

};
  
  

function errorHandler(data){
	console.log(data);
}


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
  applyFilterRange();
  fetchDashboardStats();
	
  // Per chart fetching
  


  // Refresh greeting every 5 seconds
  window.setInterval(updateGreeting, 5000);
  
  // Refresh stats every 5 seconds
  window.setInterval(fetchDashboardStats, 3000);
  
  
  
  
  
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
	
	break;
	
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




// expanded Chart Button  

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
	
	if(errorRate == 5){
		showToast("You are offline!");
		toggleOfflineBanner(1);
	}
	
    errorRate++;
}


function toggleOfflineBanner(show=false){
	let bannertop = tag("message_tag",_("top_banner"))[0];
	let parentElm = bannertop.parentNode;
	
	if(show){
		parentElm.classList.add("show", "error");
	}else{
		parentElm.classList.remove("show", "error");		
	}
	
	let message = "<span class='fa fa-plug'> </span> <span class='tiny'> You are curently Offline!</span>";
	bannertop.innerHTML = message;
	// console.log(bannertop, parentElm);
}



async function showOnlineBanner(show=false){
	let bannertop = tag("message_tag",_("top_banner"))[0];
	let parentElm = bannertop.parentNode;
	
	if(show){
		parentElm.classList.add("show", "success");
	}else{
		parentElm.classList.remove("show", "success");		
	}
	
	let message = "<span class='fa fa-globe'> </span> <span class='tiny'> You are Online.</span>";
	bannertop.innerHTML = message;
	
	await sleep(4000);
	
	if(show){
		parentElm.classList.remove("show", "success");
	}
	
}



let prevNotifications = undefined;
async function observeNewNotification(data){
    let res = JSON.parse(data.responseText);
    if(res.type == "success" && failedFetch > 0){
        failedFetch--;
		errorRate--;
    }
	
	if(errorRate >= 3){
		toggleOfflineBanner();
		await sleep(300);
		showOnlineBanner(1);
		errorRate = 0;
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




//Other Essential functions for chart generations


function changeLayout(target = "more_charts"){
	_(target).classList.toggle("grid_layout_expanded");
}




// ====================================================
// Chart functions ====================================
// ====================================================
function proccessChartEvents(){
	
	if (tag("fuel_requisition_charts")[0].checkVisibility())generateFuelRequisitionCharts(collectedDatas["fuel_requisition"].data);
	
	
	if (tag("purchase_request_charts")[0].checkVisibility())generatePurchaseRequestCharts(collectedDatas["purchase_request"].data);
		
}


	
async function generateFuelRequisitionCharts(data) {
	if(data == undefined){
		return console.warn("generateFuelRequisitionCharts: didn't got a valid data");
	};
	
	let allLoadingSkeletons = tag("loading_skeleton",_("more_charts"));

	for (each of allLoadingSkeletons){
		each.remove();
	}
		
	
    let objTo2D = (obj) => Object.entries(obj).map(([k, v]) => [k, v]);
	
	let chartSkeletons = tag("more_charts")
	
	// Lambda Funcitons for defered render
	
    let tasks = [

        // -- destination_activity --------------------------------------

        () => generatePieChart(
            objTo2D(data.destination_activity.count_by_activity),
            "fuel_chart_activity_distribution",
            "Activity Distribution",
            true
        ),

        () => generateHorizontalBarChart(
            data.destination_activity.top_destinations,
            "fuel_chart_top_destinations",
            "Top Destinations",
            materialColors,
            true,
            (value) => value
        ),

        () => generateHorizontalBarChart(
            data.destination_activity.top_routes,
            "fuel_chart_top_routes",
            "Top Origin-Destination Paring",
            materialColors,
            true,
            (value) => value
        ),

        // -- vehicle ---------------------------------------------------

        () => generateHorizontalBarChart(
            data.vehicle.top_by_count,
            "fuel_chart_vehicle_trip_count",
            "Vehicle Trip Count",
            materialColors,
            true,
            (value) => value
        ),

        () => generateHorizontalBarChart(
            data.vehicle.top_by_liters,
            "fuel_chart_vehicle_liters",
            "Vehicle Liters Consumed",
            materialColors,
            true,
            (value) => abbreviateNumber(value).abbreviated
        ),

        () => generateVerticalBarChart(
            objTo2D(data.vehicle.avg_liters),
            "fuel_chart_vehicle_avg_liters",
            "Avg Liters per Trip",
            false
        ),

        // -- driver ----------------------------------------------------

        () => generateHorizontalBarChart(
            data.driver.top_by_count,
            "fuel_chart_driver_trip_count",
            "Driver Trip Count",
            materialColors,
            true,
            (value) => value
        ),

        () => generateHorizontalBarChart(
            data.driver.top_by_liters,
            "fuel_chart_driver_liters",
            "Driver Liters Consumed",
            materialColors,
            true,
            (value) => abbreviateNumber(value).abbreviated
        ),

        // -- time ------------------------------------------------------

        () => generateShadedLineChart(
            objTo2D(data.time.count_by_day),
            "fuel_chart_daily_count",
            "Daily Trip Count",
            false
        ),

        () => generateVerticalBarChart(
            objTo2D(data.time.count_by_month),
            "fuel_chart_monthly_count",
            "Monthly Trip Count",
            false
        ),

        () => generateVerticalBarChart(
            objTo2D(data.time.liters_by_month),
            "fuel_chart_monthly_liters",
            "Monthly Liters",
            false
        ),

        // -- shortage_over ---------------------------------------------

        () => generatePieChart(
            [
                ["Shortage", data.shortage_over.shortage_count],
                ["Over",     data.shortage_over.over_count]
            ],
            "fuel_chart_shortage_vs_over",
            "Shortage vs Over",
            true
        ),

        () => generateHorizontalBarChart(
            data.shortage_over.shortage_by_driver,
            "fuel_chart_shortage_by_driver",
            "Shortage by Driver",
            materialColors,
            true,
            (value) => value
        ),

        () => generateHorizontalBarChart(
            data.shortage_over.shortage_by_vehicle,
            "fuel_chart_shortage_by_vehicle",
            "Shortage by Vehicle",
            materialColors,
            true,
            (value) => value
        ),

        // -- kpi -------------------------------------------------------

        () => generatePieChart(
            objTo2D(data.kpi.count_by_status),
            "fuel_chart_status_count",
            "Records by Status",
            true
        ),



    ];

    tasks.forEach((task, i) => {
        setTimeout(task, i * 30);
    });
}

	
async function generatePurchaseRequestCharts(data) {
	if(data == undefined){
		return console.warn("generatePurchaseRequestCharts: didn't got a valid data");
	};
	
	let allLoadingSkeletons = tag("loading_skeleton",_("more_charts_1"));

	for (each of allLoadingSkeletons){
		each.remove();
	}
		
	
    let objTo2D = (obj) => Object.entries(obj).map(([k, v]) => [k, v]);
	
	let chartSkeletons = tag("more_charts")

		
	let fmtNum = (v) => abbreviateNumber(v).abbreviated;

	let months = Object.keys(data.spend.amount_by_month).sort();
	let byMonth = (obj) => months.map(m => [m, obj[m] || 0]);

	let deptTrend = Object.entries(data.spend.amount_by_month_department).map(([dept, obj]) => ({
		label: dept,
		data: byMonth(obj)
	}));

	let overdueDepts = [...new Set([
		...Object.keys(data.turnaround.on_time_by_department),
		...Object.keys(data.turnaround.overdue_by_department)
	])];

	let overdueSets = [
		{ label: 'On Time', data: overdueDepts.map(d => [d, data.turnaround.on_time_by_department[d] || 0]) },
		{ label: 'Overdue', data: overdueDepts.map(d => [d, data.turnaround.overdue_by_department[d] || 0]) }
	];

	let statusDepts = Object.keys(data.approval_funnel.status_by_department);
	let statusNames = [...new Set(
		Object.values(data.approval_funnel.status_by_department).flatMap(o => Object.keys(o))
	)];

	let statusSets = statusNames.map(s => ({
		label: s,
		data: statusDepts.map(d => [d, data.approval_funnel.status_by_department[d][s] || 0])
	}));

	let weekdayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	let weekdayData = weekdayOrder.map(d => [d, data.seasonality.count_by_weekday[d] || 0]);

	let momData = objTo2D(data.seasonality.mom_change_pct).map(([k, v]) => [k, v === null ? 0 : v]);
	
	// Lambda Funcitons for defered render
	
	
	let tasks = [

		// -- kpi -------------------------------------------------------

		() => generatePieChart(
			objTo2D(data.kpi.count_by_status),
			"purchase_chart_status_count",
			"Records by Status",
			true
		),

		() => generatePieChart(
			objTo2D(data.kpi.amount_by_status),
			"purchase_chart_status_amount",
			"Amount by Status",
			true
		),


		// -- spend -----------------------------------------------------

		() => generateLineChart(
			byMonth(data.spend.count_by_month),
			"purchase_chart_requests_by_month",
			"Requests Over Time",
			false
		),

		() => generateShadedLineChart(
			byMonth(data.spend.amount_by_month),
			"purchase_chart_spend_by_month",
			"Total Spend Over Time",
			false
		),

		() => generateHorizontalBarChart(
			objTo2D(data.spend.amount_by_department),
			"purchase_chart_spend_by_department",
			"Spend by Department",
			materialColors,
			false,
			fmtNum
		),

		() => generateVerticalBarChart(
			objTo2D(data.spend.amount_by_company),
			"purchase_chart_spend_by_company",
			"Spend by Company",
			false
		),

		() => generateVerticalBarChart(
			objTo2D(data.spend.avg_amount_by_department),
			"purchase_chart_avg_amount_department",
			"Average Request Amount by Department",
			false
		),

		// -- turnaround ------------------------------------------------

		() => generateVerticalBarChart(
			objTo2D(data.turnaround.avg_approval_lag_by_department),
			"purchase_chart_approval_lag",
			"Avg. Days: Created to Approved",
			false
		),

		() => generateVerticalBarChart(
			objTo2D(data.turnaround.avg_completion_lag_by_department),
			"purchase_chart_completion_lag",
			"Avg. Days: Approved to Processed",
			false
		),

		() => generateMultiBarChart(
			overdueSets,
			"purchase_chart_overdue_by_department",
			false
		),

		() => generateVerticalBarChart(
			objTo2D(data.turnaround.aging_pending_buckets),
			"purchase_chart_aging_pending",
			"Aging Pending Requests (Days)",
			false
		),

		// -- comparative -----------------------------------------------

		() => generateMultiLineChart(
			deptTrend,
			"purchase_chart_department_spend_trend",
			false
		),

		// -- items -----------------------------------------------------

		() => generateHorizontalBarChart(
			data.items.top_by_count,
			"purchase_chart_items_by_count",
			"Most Requested Items",
			materialColors,
			true
		),

		() => generateHorizontalBarChart(
			data.items.top_by_spend,
			"purchase_chart_items_by_spend",
			"Top Items by Spend",
			materialColors,
			false,
			fmtNum
		),

		// -- people ----------------------------------------------------

		() => generateHorizontalBarChart(
			data.people.top_requesters_by_count,
			"purchase_chart_requesters_count",
			"Top Requesters by Count",
			materialColors,
			true
		),

		() => generateHorizontalBarChart(
			data.people.top_requesters_by_amount,
			"purchase_chart_requesters_amount",
			"Top Requesters by Amount",
			materialColors,
			false,
			fmtNum
		),

		() => generateHorizontalBarChart(
			data.people.approver_workload_count,
			"purchase_chart_approver_count",
			"Approver Workload (Count)",
			materialColors,
			true
		),

		() => generateHorizontalBarChart(
			data.people.approver_workload_amount,
			"purchase_chart_approver_amount",
			"Approver Workload (Amount)",
			materialColors,
			false,
			fmtNum
		),



		// -- approval funnel -------------------------------------------

		() => generateMultiBarChart(
			statusSets,
			"purchase_chart_status_by_department",
			false
		),

		// -- seasonality -----------------------------------------------

		() => generateVerticalBarChart(
			momData,
			"purchase_chart_mom_change",
			"Month-over-Month Spend Change (%)",
			false
		),

		() => generateLineChart(
			weekdayData,
			"purchase_chart_weekday_pattern",
			"Requests by Day of Week",
			false
		),

	];

    tasks.forEach((task, i) => {
        setTimeout(task, i * 30);
    });
}

