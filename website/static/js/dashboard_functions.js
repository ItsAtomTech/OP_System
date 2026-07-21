window.addEventListener('resize', () => {
	forceResize = true;
	
});



// ==========================
// Admin Functions Etc.
// ==========================

function showUserManageTable(elm){
	activate(elm);

	let page = open_modal("user_table", 'modal_on_container,no_close_button,page_containment', _('general_container'));
	closeAllPages(page);
	hideDashboardContents(true);
	
}



function showSubjectManagementPage(elm){
	activate(elm);

	let page = open_modal("subject_table", 'modal_on_container,no_close_button,page_containment', _('general_container'));
	closeAllPages(page);
	hideDashboardContents(true);
	
}

function showRequestForms(elm){
	activate(elm);

	let page = open_modal("subject_table", 'modal_on_container,no_close_button,page_containment', _('general_container'));
	closeAllPages(page);
	hideDashboardContents(true);
	
}


function showNotificationPage(elm){
	activate(elm);

	let page = open_modal("notifications", 'modal_on_container,no_close_button,page_containment', _('general_container'));
	closeAllPages(page);
	hideDashboardContents(true);
	
}


function showSettingsPage(elm){
	activate(elm);

	let page = open_modal("config_editor", 'no_close_button,blurred,padded');
	// closeAllPages(page);
	// hideDashboardContents(true);
	
}


// ==========================
// Admin Functions Etc.
// ==========================



function showAdminTools(elm){
	activate(elm);

	let page = open_modal("admin_tools_page", 'modal_on_container,no_close_button,page_containment', _('general_container'));
	closeAllPages(page);
	hideDashboardContents(true);
	
}






// ==========================
// Admin Functions Ends Here.
// ==========================






// ==========================
// Forms Functions Etc.
// ==========================

function showRequestForms(elm){
	activate(elm);

	let page = open_modal("request_forms", 'modal_on_container,no_close_button,page_containment', _('general_container'));
	closeAllPages(page);
	hideDashboardContents(true);
	
}






function closeAllPages(exclude=undefined){
	forceResize = true;
	
	let containment = _('general_container').getElementsByClassName('page_containment');
	
	try{
		hideDashboardContents(false);
	}catch(e){
		//--
	}
	for(each of containment){
		if(exclude){
			if(each.id == exclude.id){
				continue;
			}
		}
	
		let close_link = (each.getElementsByClassName("close_modal_rev")[0]);
		close_modalizer(close_link);
	}
	
}




async function hideDashboardContents(hide=false){
	
	if(hide){
		_('dash_contents').classList.add("slideOut");
		await sleep(200);
		
		_('dash_contents').classList.add("hide_main_con");
		_('dash_title_top').classList.add("hide_from_view");
		
	}else{
		_('dash_contents').classList.remove("slideOut");
		_('dash_contents').classList.remove("hide_main_con");
		_('dash_title_top').classList.remove("hide_from_view");
		
	}

	
}


localStorage.setItem("codeMode","");


