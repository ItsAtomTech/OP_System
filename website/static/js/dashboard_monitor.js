
qBuilder.server_address = "get_admin_stats";


//fetch Data from the server
function getMonitorData(){


    if(current_role != "admin"){
        return;
    }

    qBuilder.sendQuery(parseData);

    applyChartTheme();


    function parseData(data){   
        let resp = data.responseText;
            resp = JSON.parse(resp);
           genFunctions(resp);


    }

}

getMonitorData();

function getMonitorDataTeacher(){


    if(current_role != "teacher"){
        return;
    }
    qBuilder.server_address = "get_teacher_stats";
    qBuilder.sendQuery(parseData);

    applyChartTheme();


    function parseData(data){
        let resp = data.responseText;
            resp = JSON.parse(resp);
           genFunctionsTeacher(resp);


    }

}

getMonitorDataTeacher();



function getMonitorDataStudent(){


    if(current_role != "student"){
        return;
    }
    qBuilder.server_address = "get_student_stats_dash";
    qBuilder.sendQuery(parseData);

    applyChartTheme();


    function parseData(data){
        let resp = data.responseText;
            resp = JSON.parse(resp);
           genFunctionsStudent(resp);


    }

}

getMonitorDataStudent();



//start the monitor timed event
// window.setInterval(getMonitorData, 800);


function genFunctions(datas){
    let data = datas.data;

    console.log(data);
    renderDailyUsersChart(data.daily_users);
    renderLessonDailyChart(data.daily_lessons_taken);
    renderLessonCompletedChart(data.daily_lessons_completed);


}

function genFunctionsTeacher(datas){
    let data = datas.data;

    console.log(data);
    renderLessonDailyChart(data.lessons_taken_daily);
    renderActiveStudentsChart(data.active_daily_students);
    renderTopStudentsChart(data.top_students);


}


function genFunctionsStudent(datas){
    let data = datas.data;

    console.log(data);
    renderActivitiesDailyChart(data.daily_activity);
    renderRLSummaryChart(data.rl_summary);
    renderOverallProgressChart(data.overall_progress);
    renderTopStrengthsChart(data.top_strengths);
    renderWeakCategoriesChart(data.weak_categories);


}


function renderDailyUsersChart(data, elementId = 'daily_user_chart') {
    // Format date labels nicely
    const formattedData = data.map(([date, count]) => {
        const d = new Date(date);
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return [label, count];
    });

    // Use your reusable chart generator
    generateLineChart(
        formattedData,
        elementId,
        "Daily Active Users (7 Days)",
        false, // not percentage-based
        [getCSSVar('--secondary_background')],
    );
}


function renderLessonDailyChart(data, elementId = 'daily_lessons_taken') {
    // Format date labels nicely
    const formattedData = data.map(([date, count]) => {
        const d = new Date(date);
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return [label, count];
    });

    generateLineChart(
        formattedData,
        elementId,
        "Lessons Taken Daily (7 Days)",
        false, // not percentage-based
        [getCSSVar('--secondary_color')],
    );
}



function renderLessonCompletedChart(data, elementId = 'daily_lessons_completed') {
    // Format date labels nicely
    const formattedData = data.map(([date, count]) => {
        const d = new Date(date);
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return [label, count];
    });

    generateLineChart(
        formattedData,
        elementId,
        "Lessons Completed Daily (7 Days)",
        false, // not percentage-based
        [getCSSVar('--secondary_color')],
    );
}

function renderActiveStudentsChart(data, elementId = 'active_daily_students') {
    // Format date labels nicely
    const formattedData = data.map(([date, count]) => {
        const d = new Date(date);
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return [label, count];
    });

    generateLineChart(
        formattedData,
        elementId,
        "Active Students (7 Days)",
        false, // not percentage-based
        [getCSSVar('--secondary_color')],
    );
}



function renderTopStudentsChart(data, elementId = 'top_students') {
    // Data is expected like: [{ username: "Alice", avg_progress: 0.95 }, ...]
    const formattedData = data.map(item => [item.username, item.avg_progress]);

    generateHorizontalBarChart(
        formattedData,                        // [['Alice', 0.95], ['Bob', 0.89], ...]
        elementId,
        "Top Performing Students (Avg Progress)",
        [getCSSVar('--secondary_color')]                   // e.g., green tone from your palette
    );
}






function renderActivitiesDailyChart(data, elementId = 'daily_acts_taken') {
    // Format date labels nicely
    const formattedData = data.map(([date, count]) => {
        const d = new Date(date);
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return [label, count];
    });

    generateLineChart(
        formattedData,
        elementId,
        "Activities Taken (7 Days)",
        false, // not percentage-based
        [getCSSVar('--secondary_background'), getCSSVar('--secondary_background_darker')],
    );
}

/* 
function renderOverallProgressChart(data, elementId = 'overall_progress') {
    // Convert the response data to your chart format
    const formattedData = data.map(item => [item.room_name, item.avg_progress]);

    // Generate the vertical bar chart
    generateVerticalBarChart(
        formattedData,
        elementId,
        "Overall Progress per Room",
        false,              // not percentage-based
        [materialColors[3]] // e.g., yellow tone from your palette
    );
}
 */


function renderRLSummaryChart(rlSummary, elementId = 'rlSummaryChart') {
    if (!rlSummary || !rlSummary.episodes || rlSummary.episodes.length === 0) {
        console.warn("No RL data available.");
        return;
    }

    // Prepare labels and datasets
    const labels = rlSummary.episodes.map(e => `Ep ${abbreviateNumber(e.episode).abbreviated}`);
    const qValues = rlSummary.episodes.map(e => e.avg_q_value);
    const rewards = rlSummary.episodes.map(e => e.total_reward);

    // Prepare chart data for both lines
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Average Q-Value',
                data: qValues,
                borderColor: materialColors[1],
                backgroundColor: materialColors[1],
                tension: 0.4,
                borderWidth: 2,
                fill: false,
                pointRadius: 6
            },
            {
                label: 'Total Reward',
                data: rewards,
                borderColor: materialColors[2],
                backgroundColor: materialColors[2],
                tension: 0.4,
                borderWidth: 2,
                fill: false,
                pointRadius: 6
            }
        ]
    };

    // Check for existing chart instance
    if (chartInstances[elementId]) {
        let currentData = chartInstances[elementId].data.datasets[0].data;
        let newData = chartData.datasets[0].data;
        let shouldAnimate = isDataDifferent(currentData, newData);

        chartInstances[elementId].options.animation = shouldAnimate ? undefined : false;
        
        
        chartInstances[elementId].data = chartData;
        chartInstances[elementId].update();
        chartInstances[elementId].options.animation = true;
        return;
    }

    const ctx = document.getElementById(elementId).getContext('2d');
    chartInstances[elementId] = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            animation: {},
            interaction: { mode: 'index', intersect: true },
            stacked: false,
            scales: {
                y: { beginAtZero: true },
                x: { title: { display: true, text: 'Episodes' } }
            },
            plugins: {
                legend: { display: true },
                datalabels: {
                    color: getCSSVar("--primary_color_faded"),
                    formatter: (value) => value.toFixed(2),
                    anchor: 'top',
                    align: 'center',
                    display:false,
                }
            }
        }
    });
}


function renderOverallProgressChart(data, elementId = 'overall_progress_per') {
    if (!data || data.length === 0) {
        console.warn("No overall progress data available.");
        return;
    }

    // Expected: [{ room_name: "Section A", avg_progress: 0.82 }]
    // Keep raw decimals (0.0–1.0), and let formatter handle the %
    const formattedData = data.map(item => [item.room_name, item.completion_rate]);

    // Adjust chart height dynamically
    const canvas = document.getElementById(elementId);
    const rowHeight = 25;
    canvas.height = Math.max(200, formattedData.length * rowHeight);

    // Wrap in scrollable container if needed
    if (!canvas.parentElement.classList.contains('scrollable-chart')) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('scrollable-chart');
        wrapper.style.maxHeight = '350px';
        wrapper.style.overflowY = 'auto';
        wrapper.style.padding = '5px';
        canvas.parentElement.insertBefore(wrapper, canvas);
        wrapper.appendChild(canvas);
    }

    // Override the chart’s datalabels formatter temporarily
    const originalFormatter = Chart.defaults.plugins.datalabels?.formatter;
    Chart.defaults.plugins.datalabels.formatter = (value) => `${(value * 100).toFixed(1)}%`;
    
    function customFormat(data){
        return data + "%";
        
        
    }
    
    
    // Generate the chart
    generateHorizontalBarChart(
        formattedData,
        elementId,
        "Overall Progress per Room (%)",
        [ getCSSVar('--secondary_background')], // purple tone 💜
        true,
        customFormat,
    );

    // Restore original formatter (optional)
    if (originalFormatter) {
        Chart.defaults.plugins.datalabels.formatter = originalFormatter;
    }
}


function renderTopStrengthsChart(data, elementId = 'top_strenghts_chart') {
    let isPlaceholder = false;

    if (!data || data.length === 0) {
        console.warn("No top strengths data available.");

        data = [{
            avg_progress: 0.75,
            category: "no_data_yet"
        }];
        isPlaceholder = true;
    }

    // Convert underscored names → Sentence Case
    const formattedData = data.map(item => {
        let name = item.category.replace(/_/g, ' ');
        name = name.charAt(0).toUpperCase() + name.slice(1);
        return [name, item.avg_progress];
    });

    // Dynamically adjust height based on number of categories
    const canvas = document.getElementById(elementId);
    const rowHeight = 45;
    canvas.height = Math.max(200, formattedData.length * rowHeight);

    // Wrap in a scrollable container if not already
    if (!canvas.parentElement.classList.contains('scrollable-chart')) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('scrollable-chart');
        wrapper.style.maxHeight = '350px';
        wrapper.style.overflowY = 'auto';
        wrapper.style.padding = '5px';
        canvas.parentElement.insertBefore(wrapper, canvas);
        wrapper.appendChild(canvas);
    }

    // Override datalabels formatter
    const originalFormatter = Chart.defaults.plugins.datalabels?.formatter;
    Chart.defaults.plugins.datalabels.formatter = (value) =>
        isPlaceholder ? "" : `${(value * 100).toFixed(1)}%`;

    // Choose color (gray if placeholder)
    const barColor = isPlaceholder ? ['#9E9E9Eaa'] : [getCSSVar('--secondary_background')];

    // Generate chart
    generateHorizontalBarChart(
        formattedData,
        elementId,
        "Top Strength Categories (%)",
        barColor
    );

    // Restore original formatter
    if (originalFormatter) {
        Chart.defaults.plugins.datalabels.formatter = originalFormatter;
    }
}



function renderWeakCategoriesChart(data, elementId = 'weak_categories_chart') {
    let isPlaceholder = false;

    if (!data || data.length === 0) {
        console.warn("No weak categories data available.");
        data = [{
            avg_progress: 0,
            category: "no_data_yet"
        }];
        isPlaceholder = true;
    }

    // Convert underscored names → Sentence Case
    const formattedData = data.map(item => {
        let name = item.category.replace(/_/g, ' ');
        name = name.charAt(0).toUpperCase() + name.slice(1);
        return [name, item.avg_progress];
    });

    // Adjust height dynamically based on number of bars
    const canvas = document.getElementById(elementId);
    const rowHeight = 45;
    canvas.height = Math.max(200, formattedData.length * rowHeight);

    // Wrap in scrollable container if not already
    if (!canvas.parentElement.classList.contains('scrollable-chart')) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('scrollable-chart');
        wrapper.style.maxHeight = '350px';
        wrapper.style.overflowY = 'auto';
        wrapper.style.padding = '5px';
        canvas.parentElement.insertBefore(wrapper, canvas);
        wrapper.appendChild(canvas);
    }

    // Override datalabels formatter for percentage display
    const originalFormatter = Chart.defaults.plugins.datalabels?.formatter;
    Chart.defaults.plugins.datalabels.formatter = (value) =>
        isPlaceholder ? "" : `${(value * 100).toFixed(1)}%`;

    // Choose red tone for weak categories, gray if placeholder
    const barColor = isPlaceholder ? ['#9E9E9Eaa'] :     [getCSSVar('--secondary_background')];

    // Generate horizontal bar chart
    generateHorizontalBarChart(
        formattedData,
        elementId,
        "Weak Categories (%)",
        barColor
    );

    // Restore original formatter
    if (originalFormatter) {
        Chart.defaults.plugins.datalabels.formatter = originalFormatter;
    }
}




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
        prevNotifications = res.total_notifications;
		
		
		//Plays the sound bell sound
 		playSfx("sound_bell.mp3");		
		 
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


window.setInterval(monitorNotifCounts, 2000);