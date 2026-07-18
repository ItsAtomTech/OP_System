function genNotificationLeaf(data,index){
	let leaf = _('notification_leaf').content.cloneNode(5);
	
	let fields = leaf.querySelectorAll('[tag]');
	let contents = JSON.parse(data.json_data);

        if(data.type == "join"){
            let icon = (tag("notification_icon", leaf)[0]);
                icon.src = image_static + "/"+ 'enter.png';
        }else if(data.type == "approved"){
            let icon = (tag("notification_icon", leaf)[0]);
                icon.src = image_static + "/"+ 'approved.png';
        }else if(data.type == "kicked"){
            let icon = (tag("notification_icon", leaf)[0]);
                icon.src = image_static + "/"+ 'alert.png';
         }


	for(each of fields){
		let this_tag = each.getAttribute('tag');
		// console.log(this_tag);
		// console.log(contents[this_tag]);
		
		if(this_tag == 'title'){
			each.innerText = contents[this_tag];
		}else if(this_tag == 'details'){
			each.innerText = charLimit(contents[this_tag], 100);
		}else if(this_tag == 'date'){
			each.innerText = data.date;
		}else if(this_tag == 'leaf'){
			if(parseInt(data.seen) <= 0){
				each.classList.add('unread');
			}
		}else if(this_tag == 'remove'){
			let notif_id = (data.id);
			each.setAttribute("onclick","remove_notification("+notif_id+");")
		}else if(this_tag == 'content'){
			each.setAttribute("onclick","show_notification(this, "+index+");")
		}

	}
	
	return leaf;
}


let page = 1;
function loadNotificationsList(){
	qBuilder.sendQuery(renderNotifications);
}

let all_notifications = [];
function renderNotifications(data){
	let responseData = JSON.parse(data.responseText);
	let notifications = responseData.notifications;
	
	all_notifications.length = 0;
	
	_("notification_center").innerHTML = " No more Notifications ... ";
	
	if(notifications.length >= 1){
		_("notification_center").innerHTML = "";
	}
	
	let ext_index = 0;
	for(each of notifications){
		all_notifications.push(each);
		let not_leaf = genNotificationLeaf(each,ext_index);
		_("notification_center").appendChild(not_leaf);

		ext_index++;
	}
	
	pagination_bar(responseData);
}


async function pagination_bar(data){
	let pages = data.pages;
	let total = data.total;
	let current_page = data.current_page;
	
	if(pages > 1){
		_("page_navigation_bar").style.display = "flex";
	}else{
		_("page_navigation_bar").style.display = "none";
	}
	

	if(current_page >= 2 && current_page <= pages){
		_("page_navigation_bar").classList.add("notif_sticky_bottom");
	}else{
		_("page_navigation_bar").classList.remove("notif_sticky_bottom");
	}
	
	
	console.log(data);
	
	let counter = _('page_navigation_bar').querySelector('[tag="page_counter"]');
	let next = _('page_navigation_bar').querySelector('[tag="next"]');
	let prev = _('page_navigation_bar').querySelector('[tag="prev"]');
	counter.innerText = current_page;
	
	current_page > 1 ? prev.style.visibility = 'visible' : prev.style.visibility = 'hidden';
	
	current_page <= pages ? next.style.visibility = 'visible' : next.style.visibility = 'hidden';
	
	
}


function paginate_notif(dir){
	page = qBuilder.paginate(dir);
	loadNotificationsList();
	utility.smoothScroll(_('top_'));
}


function remove_notification(id,multi = false){
	if(!multi){
		let xc = window.confirm("Are you sure to Remove this Notification?");
		if(!xc){
			return false;
		}
	}
	qBuilder.sendQuery(finishDelete,'delete_notification', [{'name':'notif_id','value':id}])
	
}


function finishDelete(data){
	let responseData = JSON.parse(data.responseText);
	
	let result = JSON.parse(data.response);
	
	if(result.type == 'success'){
		showToast(result.message);
		loadNotificationsList();
	}else{
		showToast(result.message);
	}
	
}



//Send Read All Request
function readAll(){
	let xc = window.confirm("This will mark all notifications as read. Do you want to continue?");
	
	if(!xc){
		return false;
	}
	showToast("Performing Actions...");
	qBuilder.sendQuery(finishMarkAll,'mark_all_notifications_read')
	
}


function finishMarkAll(data){
	let responseData = JSON.parse(data.responseText);
	let result = JSON.parse(data.response);
	if(result.type == 'success'){
		showToast(result.message);
		loadNotificationsList();
	}else{
		showToast(result.message);
	}
}






function show_notification(elm, index){
	let data_ = (all_notifications[index]);
	let contents = JSON.parse(data_.json_data);

	console.log(contents);

    if(data_.type == 'join'){
        let room_id = contents.extra.split(":");
            if(room_id[1]){
                showNotificationModal(data_.id,true);
                go_to('room_view?room_id='+room_id[1]);
            }


        return;
    }


	_('showNotification').querySelector('[tag="title"]').innerText = contents.title;
	_('showNotification').querySelector('[tag="date"]').innerText = data_.date;
	_('showNotification').querySelector('[tag="details"]').innerText = contents.details;
	showNotificationModal(data_.id);
	elm.parentNode.classList.remove('unread');
}


function showNotificationModal(id, silent=false){
	
	qBuilder.sendQuery(undefined,'see_notify', [{'name':'notif_id','value':id}]);

	if(silent){
        return;
	}

	_('showNotification').classList.add('fade_in_zoom');
	_('showNotification').style.display = 'flex';
	
	
};


function closeNotif(){
	
	_('showNotification').classList.add('fade_out_circle');
	_('showNotification').classList.remove('fade_in_zoom');
	window.setTimeout(close, 300);
	function close(){
		_('showNotification').style.display = 'none';
	}
	
	
}


// Other Functions

firstLoad = true;
function monitorNewChnages(){
	let timer_c = setInterval(check, 2000);
	function check(){
		if(firstLoad){
			firstLoad = false;
			return;
		}
		let rl = localStorage.getItem('shouldReloadNotification');
		if(rl == 'true'){
			localStorage.removeItem('shouldReloadNotification');
			qBuilder.sendQuery(loadNotificationsList);
		}
	}
}


monitorNewChnages();
