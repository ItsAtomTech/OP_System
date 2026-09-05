import os, json

from flask import Blueprint, render_template, request, flash, jsonify, Flask, url_for, session, send_from_directory, make_response
from flask_login import login_required, current_user
from sqlalchemy import asc, desc, distinct, table, func
from werkzeug.utils import redirect


from . import db
from datetime import datetime,timedelta
from .global_vars import Post_Visibility, Sorting, Post_Status
from .models import Users

from .api_handles import api_handles, get_common_approver_names

plt = ""  # empty this var when on live website
post_per_page = 100
sorting = Sorting.sorting

views = Blueprint('views', __name__)

app = Flask(__name__)


@views.route('/', methods=['GET', 'POST'])
def home():
    page = 'home'
    
    if not current_user.is_authenticated:
        return render_template("login.html", user=current_user, page=page)
    
    if current_user.status != 'confirmed':
        flash(category="warning",message="Please Activate your Account Email")
    
    
    return render_template("dashboard.html", user=current_user, page=page)

@views.route('/about', methods=['GET', 'POST'])
def about():
    page = 'about'

    return render_template("about.html", user=current_user, page=page)



@views.route('/preview', methods=['GET', 'POST'])
def prev_dash():
    page = 'preview'

    return render_template("dashboard.html", user=current_user, page=page)
    



@views.route('/soon', methods=['GET', 'POST'])
def soon():
    page = 'under'

    return render_template("under.html", user=current_user, page=page)
    





# =======================
# User Section
# =======================



@views.route('/user_table', methods=['GET', 'POST'])
@login_required
def user_tables():
    page = 'users'
    if current_user.status != 'confirmed':
        return redirect(url_for('user_control.show_profile'))

    return render_template("users_table.html", user=current_user, page=page)


@views.route('/new_user_editor', methods=['GET', 'POST'])
def user_new_editor():
    page = 'new_user'

    return render_template("user_editor.html", user=current_user, page=page)



@views.route('/update_user_editor', methods=['GET', 'POST'])
def user_update_editor():
    page = 'edit_user'

    return render_template("user_editor.html", user=current_user, page=page)




# =======================
# Forms Section
# =======================


# @views.route('/status_editor', methods=['GET', 'POST'])
# def status_new_editor():
    # page = 'new_status_editor'

    # return render_template("forms/purchase_request.html", user=current_user, page=page)
    



#Main page that list all types of Forms available    
@views.route('/request_forms', methods=['GET', 'POST'])
def request_forms_page():
    page = 'request_forms'

    return render_template("forms_gallery_page.html", user=current_user, page=page)
        



    
@views.route('/purchase_request', methods=['GET', 'POST'])
def purchase_request():
    page = 'purchase_editor'
    common_names = get_common_approver_names()
    

    return render_template("forms/purchase_request.html", user=current_user, page=page, common_names=common_names)
    
    
    
    
@views.route('/fuel_requisition', methods=['GET', 'POST'])
def fuel_requisition_():
    page = 'fuel_requisition_form'

    return render_template("forms/fuel_requisition_form.html", user=current_user, page=page)
    
    
        
    
    
@views.route('/update_fuelfile_editor', methods=['GET', 'POST'])
def update_fuelfile_editor_():
    page = 'fuel_requisition_edit'

    return render_template("forms/fuel_requisition_form.html", user=current_user, page=page)
    
    
    


#Main page that list all records of Forms files available    
@views.route('/request_files', methods=['GET', 'POST'])
def file_records_page():
    page = 'request_files'
    
    
    return render_template("file_records_page.html", user=current_user, page=page)
        



# =======================
# Forms Section End
# =======================



# =======================
# Admin Section Start
# =======================


#Main page that list all types of Forms available    
@views.route('/admin_tools_page', methods=['GET', 'POST'])
def admin_tools_page_():
    page = 'admin_tools'

    return render_template("admin_tools.html", user=current_user, page=page)
        


    
@views.route('/vehicles_table_list', methods=['GET', 'POST'])
def vehicles_table_():
    page = 'vehicles_table'

    return render_template("vehicles_table.html", user=current_user, page=page)
        


    
@views.route('/drivers_table_list', methods=['GET', 'POST'])
def drivers_table_list_():
    page = 'drivers_table'

    return render_template("drivers_table.html", user=current_user, page=page)
        


 
    
@views.route('/fuel_files_table', methods=['GET', 'POST'])
def fuel_files_table_():
    page = 'fuel_files_table'

    return render_template("fuel_files_table.html", user=current_user, page=page)
        


# Purchase Request ==========

@views.route('/purchase_files_table', methods=['GET', 'POST'])
def purchase_files_table_():
    page = 'purchase_files_table'

    return render_template("purchase_files_table.html", user=current_user, page=page)   



    
    
@views.route('/update_purchase_req_editor', methods=['GET', 'POST'])
def update_purchase_req_editor_():
    page = 'update_purchase_req_editor'
    
    common_names = get_common_approver_names()
    
    return render_template("forms/purchase_request.html", user=current_user, page=page,common_names=common_names)
    
    

# =======================
# Admin Section End
# =======================




# ========================
# Super Admin Section Start
# ========================

    
@views.route('/companies_mgr_page', methods=['GET', 'POST'])
def companies_mgr_page_():
    page = 'companies_mgr_page'

    return render_template("companies_table.html", user=current_user, page=page)
        


# =======================
# Super Admin Section End
# =======================






# =======================
# Print Templates Section
# =======================

@views.route('/fuel_requisition_slip_print', methods=['GET', 'POST'])
def fuel_requisition_slip_():
    page = 'fuel_requisition_slip'

    return render_template("print_templates/fuel_requisition_slip.html", user=current_user, page=page)
        




@views.route('/purchase_request_print', methods=['GET', 'POST'])
def purchase_request_slip_():
    page = 'purchase_request_slip'

    return render_template("print_templates/purchase_request_slip.html", user=current_user, page=page)
        




# =======================
# Print Templates Section End
# =======================



# =======================
# Notifications Section
# =======================
@views.route('/notifications', methods=['GET', 'POST'])
@login_required
def notifications_page():
    page = 'edit'
    if current_user.status != 'confirmed':
        return redirect(url_for('user_control.show_profile'))
    return render_template("notifications.html", user=current_user, page=page)


# =======================
# Other Section Start
# =======================


@views.route('/config_editor', methods=['GET', 'POST'])
@login_required
def config_manager():
    page = 'conf'

    return render_template("config_editor.html", user=current_user, page=page)



@views.route('/set_theme', methods=['POST'])
def themes():
    theme = request.form.get("theme")

    if 'theme' not in session:
        session['theme'] = theme

    session['theme'] = theme

    return theme


# PWA Expiremental Setup =====

# PWA Experimental Setup =====
@views.route('/sw.js')
def service_worker():
    response = make_response(app.send_static_file('sw.js'))
    response.headers['Content-Type'] = 'application/javascript'
    response.headers['Cache-Control'] = 'no-cache'
    return response

@views.route('/manifest.json')
def manifest():
    response = make_response(app.send_static_file('manifest.json'))
    response.headers['Content-Type'] = 'application/manifest+json'
    response.headers['Cache-Control'] = 'no-cache'
    return response


@views.after_request
def add_cache_headers(response):
    if request.path.startswith('/static/'):
        response.headers['Cache-Control'] = 'public, max-age=31536000'
    else:
        response.headers['Cache-Control'] = 'public, max-age=0, must-revalidate'
    return response


@views.route('/emoticons/<path:path>')
def get_upl(path):
    workingdir = os.path.abspath(os.getcwd())
    print(workingdir)

    filepath = 'static' + '/emoticons'

    print(filepath)
    return send_from_directory(filepath, path)





def is_admin():
    if current_user.type == 'admin':
        return 1
    else:
        return 0
