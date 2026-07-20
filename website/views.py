import os, json

from flask import Blueprint, render_template, request, flash, jsonify, Flask, url_for, session, send_from_directory
from flask_login import login_required, current_user
from sqlalchemy import asc, desc, distinct, table, func
from werkzeug.utils import redirect


from . import db
from datetime import datetime,timedelta
from .global_vars import Post_Visibility, Sorting, Post_Status
from .models import Users

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
    



    
@views.route('/request_forms', methods=['GET', 'POST'])
def request_forms_page():
    page = 'request_forms'

    return render_template("under.html", user=current_user, page=page)
        



    
@views.route('/purchase_request', methods=['GET', 'POST'])
def purchase_request():
    page = 'purchase_editor'

    return render_template("forms/purchase_request.html", user=current_user, page=page)
    
    
    
    
@views.route('/fuel_requisition', methods=['GET', 'POST'])
def fuel_requisition_():
    page = 'fuel_requisition_form'

    return render_template("forms/fuel_requisition_form.html", user=current_user, page=page)
    
    
    


# =======================
# Forms Section End
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
