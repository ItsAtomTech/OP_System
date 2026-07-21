import os, json, re
from operator import or_, and_
from typing import Union

from flask import Blueprint, render_template, request, flash, jsonify, Flask, url_for, session, current_app, send_from_directory, Response
from flask_login import login_required, current_user
from sqlalchemy import asc, desc, distinct, table, func, case, cast, Integer
from sqlalchemy.orm import aliased
from werkzeug.security import generate_password_hash, check_password_hash

import random, string, requests
import pytz
from werkzeug.utils import secure_filename

manila_tz = pytz.timezone("Asia/Manila")
from dotenv import load_dotenv

from . import db
from datetime import datetime, timedelta
from .models import Users, Department, PurchaseRequests, Notification, Vehicles


plt = ""  # empty this var when on live website
post_per_page = 2000

api_handles = Blueprint('api_handles', __name__)

app = Flask(__name__)

CONFIG_DATA = {}  # Stores Global Config Data
load_dotenv()


@api_handles.route('/dummy', methods=['GET', 'POST'])
def dum():
    return {"type": "success", "message": "Message test" } 
    page = 'home'

    
def manila_time():
    return datetime.now(pytz.timezone("Asia/Manila"))


# ================================
# Users Section
# ================================
@api_handles.route('/user_list', methods=['POST', 'GET'])
def list_users():
    try:
        current_page = int(request.form.get("page") or 1)
    except ValueError:
        current_page = 1

    token = request.form.get("token") or 0
    per_page = 40
    query = Users.query

    # Require login or valid token

    # Filters
    filters_raw = request.form.get("filters")
    if filters_raw:
        try:
            filters = json.loads(filters_raw)

            if 'status' in filters and filters['status']:
                query = query.filter(Users.status == filters['status'])

            if 'level' in filters and str(filters['level']).isdigit():
                query = query.filter(Users.level == int(filters['level']))

            if 'type' in filters and filters['type']:
                query = query.filter(Users.type == filters['type'])

        except json.JSONDecodeError:
            pass

    # Search (name/email)
    search = request.form.get("search")
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            db.or_(
                Users.username.ilike(search_term),
                Users.email.ilike(search_term),
                Users.type.ilike(search_term),
                Users.user_id.ilike(search_term),
                Users.status.ilike(search_term)
            )
        )

    # Sorting
    sortby = request.form.get("sort") or None
    order = request.form.get("order_by", "asc").lower() or None

    if sortby and hasattr(Users, sortby):
        sort_column = getattr(Users, sortby)
        if order == "desc":
            query = query.order_by(desc(sort_column))
        else:
            query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(Users.user_id.asc())

    # Pagination
    pagination = query.paginate(page=current_page, per_page=per_page, error_out=False)
    users = pagination.items
    total_pages = pagination.pages
    total_results = pagination.total

    user_list = []
    for u in users:
        user_list.append({
            'user_id': u.user_id,
            'username': getattr(u, 'username', None),
            'email': u.email,
            'type': u.type,
            'status': getattr(u, 'status', None),
            'level': getattr(u, 'level', None),
            'date': u.date.isoformat() if u.date else None
        })

    return {
        "type": "success",
        "users": user_list,
        "pagination_data": {
            "current_page": current_page,
            "total_pages": total_pages,
            "total_results": total_results
        }
    }


@api_handles.route('/save_user', methods=['POST'])
@login_required
def save_user():
    if not is_admin(True):
        return jsonify({"type": "error", "message": "No permission to perform this action"})

    try:
        user_data = request.form.get("user_data")

        if not user_data:
            return {"type": "error", "message": "Missing user data"}

        data = json.loads(user_data)

        # Check required fields
        if not data.get("username") or not data.get("email") or not data.get("password"):
            return {"type": "error", "message": "Missing required fields"}

        if data.get("password") != data.get("repassword"):
            return {"type": "error", "message": "Passwords do not match"}
            
        if data.get("department") == " ":
            data["department"] = None
            

        # Optional: check if email already exists
        existing_user = Users.query.filter_by(email=data.get("email")).first()
        if existing_user:
            return {"type": "error", "message": "Email already exists"}
        
        password = data.get("password")
        
        #Password validation: at least 8 chars, must contain both letters and numbers
        if len(password) < 8:
            return {"type": "error", "message": "Password must be at least 8 characters long"}

        if not (any(c.isalpha() for c in password) and any(c.isdigit() for c in password)):
            return {"type": "error", "message": "Password must contain both letters and numbers"}
        
        new_user = Users(
            username=data.get("username"),
            email=data.get("email"),
            department_id=data.get("department", None),
            college_id=data.get("college", None),
            type=data.get("type", "1"),
            password=generate_password_hash(data.get("password"), method="pbkdf2:sha256"),
            status="pending",
            avatar="user",
            date=func.now()
        )

        db.session.add(new_user)
        db.session.commit()

        return {"type": "success", "message": "User saved successfully!"}

    except Exception as e:
        return {"type": "error", "message": str(e)}



@api_handles.route('/remove_user', methods=['POST'])
@login_required
def remove_user():
    # --- Ensure only admins can perform this action ---
    if not is_admin():
        return jsonify({"type": "error", "message": "No permission to perform this action"})

    try:
        user_id = request.form.get("user_id")

        if not user_id:
            return {"type": "error", "message": "Missing user_id"}

        user = Users.query.get(int(user_id))
        if not user:
            return {"type": "error", "message": "User not found"}

        # --- Prevent deleting self ---
        if user.user_id == current_user.user_id:
            return {"type": "error", "message": "You cannot remove your own account"}

        # --- Prevent deleting admin accounts ---
        if user.type and user.type == 4:
            return {"type": "error", "message": "You cannot delete another admin account"}

        db.session.delete(user)
        db.session.commit()

        return {"type": "success", "message": f"User '{user.username}' removed successfully!"}

    except Exception as e:
        db.session.rollback()
        return {"type": "error", "message": str(e)}



@api_handles.route('/get_user_by_id', methods=['POST'])
@login_required
def get_user_by_id():

    try:
        user_id = request.form.get("user_id")

        if not user_id:
            return {"type": "error", "message": "Missing user_id"}

        user = Users.query.get(int(user_id))
        if not user:
            return {"type": "error", "message": "User not found"}

        user_data = {
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "type": user.type,
            "status": user.status,
            "avatar": user.avatar,
            # "department": user.department_id,
            # "college": user.college_id,
            "misc": user.misc,
            "date": user.date.strftime("%Y-%m-%d %H:%M:%S") if user.date else None
        }

        return {"type": "success", "user": user_data}

    except Exception as e:
        return {"type": "error", "message": str(e)}



@api_handles.route('/save_user_update', methods=['POST'])
@login_required
def save_user_update():
    if not is_admin():
        return jsonify({"type": "error", "message": "No permission to perform this action"})

    try:
        user_data = request.form.get("user_data")

        if not user_data:
            return {"type": "error", "message": "Missing user data"}

        data = json.loads(user_data)

        user_id = request.form.get("user_id")
        if not user_id:
            return {"type": "error", "message": "Missing user_id"}

        user = Users.query.get(int(user_id))
        if not user:
            return {"type": "error", "message": "User not found"}

        if user.user_id == current_user.user_id:
            return {"type": "error", "message": "You cannot modify your own account in here"}
            


        # Update fields
        if data.get("username"):
            user.username = data["username"]

        if data.get("type"):
            user.type = data["type"]
            
        if data.get("department"):
            user.department_id = data["department"]
            
        if data.get("college"):
            user.college_id = data["college"]

        if data.get("email") and data["email"] != user.email:
            # If email changes, also set status to "pending"
            user.email = data["email"]
            user.status = "pending"

        db.session.commit()

        return {"type": "success", "message": "User updated successfully!"}

    except Exception as e:
        return {"type": "error", "message": str(e)}



@api_handles.route("/update_my_email", methods=["POST"])
@login_required
def update_my_email():
    new_email = request.form.get("email")

    if not new_email:
        return jsonify({"type": "error", "message": "Email is required."})

    # Only allow updates if user status is pending
    if current_user.status.lower() != "pending":
        return jsonify({
            "type": "error",
            "message": "Email updates are only allowed while your account status is 'pending'."
        })
    
    if current_user.email == new_email:
        return jsonify({
            "type": "error",
            "message": "The Email is the same as your current"
        })
    
    # Check if the new email is already used by another user
    existing_user = Users.query.filter_by(email=new_email).first()
    if existing_user:
        return jsonify({"type": "error", "message": "This email is already in use."})

    # Proceed with email update
    current_user.email = new_email
    db.session.commit()


    return jsonify({
        "type": "success",
        "message": f"Your email has been successfully updated to '{new_email}'."
    })


# ================================
# Users Section End
# ================================



# ================================
#  User Forms API
# ================================

#Saving data into the sace
@api_handles.route('/save_purchase_request', methods=['POST'])
@login_required
def save_purchase_request():
    try:
        purchase_data = request.form.get("purchase_data")
        if not purchase_data:
            return {"type": "error", "message": "Missing purchase_data"}
        
        data = json.loads(purchase_data)
        
        request_type  = "purchase_request"
        items         = data.get("items")
        purpose       = data.get("purpose_of_request")
        date_required = data.get("date_required")
        department_id = data.get("department_id")
        
        print(request_type, items, purpose)
        
        if not all([request_type, items, purpose]):
            return {"type": "error", "message": "Incomplete purchase request data"}

        new_purchase = PurchaseRequests(
            user_id            = current_user.user_id,
            type               = request_type,
            items              = items,
            purpose_of_request = purpose,
 
            date_required      = date_required,
            department_id      = department_id,
        )

        db.session.add(new_purchase)
        db.session.commit()

        return {"type": "success", "message": "Purchase request saved successfully"}
    
    except Exception as e:
        db.session.rollback()
        return {"type": "error", "message": str(e)}





#Retriving Data of a purcahse request
@api_handles.route('/get_purchase_request_by_id', methods=['POST', 'GET'])
@login_required
def get_purchase_request_by_id():
    try:
        purchase_id = request.form.get("purchase_id") or request.args.get("purchase_id")
        if not purchase_id:
            return {"type": "error", "message": "Missing purchase_id"}

        purchase = PurchaseRequests.query.get(int(purchase_id))
        if not purchase:
            return {"type": "error", "message": "Purchase request not found"}

        purchase_data = {
            "purchase_id":          purchase.purchase_id,
            "user_id":              purchase.user_id,
            "type":                 purchase.type,
            "items":                purchase.items,
            "purpose_of_request":   purchase.purpose_of_request,
            "misc":                 purchase.misc,
            "department_id":        purchase.department_id,
            "date_required":        purchase.date_required,
            "date":                 purchase.date.strftime("%Y-%m-%d %H:%M:%S") if purchase.date else None,
        }

        return {"type": "success", "purchase": purchase_data}

    except Exception as e:
        return {"type": "error", "message": str(e)}




# ================================
# User Forms API End
# ================================



# ================================
# Vehicles Section
# ================================
@api_handles.route('/save_vehicle', methods=['POST'])
@login_required
def save_vehicle():

    if not is_admin():
        return {"type": "error", "message": "No permission to perform this action"}

    try:
        plate_no = request.form.get("plate_no")
        average_km = request.form.get("average_km")
        description = request.form.get("description")
        misc = request.form.get("misc") or "{}"

        if not plate_no:
            return {"type": "error", "message": "Missing required fields"}

        new_vehicle = Vehicles(
            plate_no=plate_no,
            average_km=average_km,
            description=description,
            misc=misc
        )

        db.session.add(new_vehicle)
        db.session.commit()

        return {"type": "success", "message": "Vehicle saved successfully!"}

    except Exception as e:
        return {"type": "error", "message": str(e)}




@api_handles.route('/list_vehicles', methods=['POST', 'GET'])
@login_required
def list_vehicles():
    try:
        current_page = int(request.form.get("page") or 1)
    except ValueError:
        current_page = 1

    per_page = 20

    query = db.session.query(Vehicles)

    # Search
    search = request.form.get("search")
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            db.or_(
                Vehicles.plate_no.ilike(search_term),
                Vehicles.description.ilike(search_term),
                Vehicles.misc.ilike(search_term)
            )
        )

    # Sorting
    sortby = request.form.get("sort")
    order = request.form.get("order_by", "asc").lower()

    sortable_columns = {
        "id": Vehicles.id,
        "plate_no": Vehicles.plate_no,
        "average_km": Vehicles.average_km,
        "description": Vehicles.description,
        "misc": Vehicles.misc,
        "date": Vehicles.date
    }

    if sortby in sortable_columns:
        sort_column = sortable_columns[sortby]
        if order == "desc":
            query = query.order_by(desc(sort_column))
        else:
            query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(Vehicles.id.asc())

    # Pagination
    pagination = query.paginate(page=current_page, per_page=per_page, error_out=False)

    results = pagination.items
    total_pages = pagination.pages
    total_results = pagination.total

    vehicle_list = []

    for vehicle in results:
        vehicle_list.append({
            "id": vehicle.id,
            "plate_no": vehicle.plate_no,
            "average_km": vehicle.average_km,
            "description": vehicle.description,
            "misc": vehicle.misc,
            "date": vehicle.date.strftime("%Y-%m-%d %H:%M:%S") if vehicle.date else None
        })

    return {
        "type": "success",
        "vehicles": vehicle_list,
        "pagination_data": {
            "current_page": current_page,
            "total_pages": total_pages,
            "total_results": total_results
        }
    }



@api_handles.route('/get_vehicle_by_id', methods=['POST'])
@login_required
def get_vehicle_by_id():

    try:
        vehicle_id = request.form.get("vehicle_id")
        if not vehicle_id:
            return {"type": "error", "message": "Missing vehicle_id"}

        vehicle = Vehicles.query.get(int(vehicle_id))
        if not vehicle:
            return {"type": "error", "message": "Vehicle not found"}

        vehicle_data = {
            "id": vehicle.id,
            "plate_no": vehicle.plate_no,
            "average_km": vehicle.average_km,
            "description": vehicle.description,
            "misc": vehicle.misc,
            "date": vehicle.date.strftime("%Y-%m-%d %H:%M:%S") if vehicle.date else None
        }

        return {"type": "success", "vehicle": vehicle_data}

    except Exception as e:
        return {"type": "error", "message": str(e)}



@api_handles.route('/update_vehicle', methods=['POST'])
@login_required
def update_vehicle():

    if not is_admin():
        return {"type": "error", "message": "No permission to perform this action"}

    try:
        vehicle_id = request.form.get("vehicle_id")
        if not vehicle_id:
            return {"type": "error", "message": "Missing vehicle_id"}

        vehicle = Vehicles.query.get(int(vehicle_id))
        if not vehicle:
            return {"type": "error", "message": "Vehicle not found"}

        plate_no = request.form.get("plate_no")
        average_km = request.form.get("average_km")
        description = request.form.get("description")
        misc = request.form.get("misc")

        if plate_no:
            vehicle.plate_no = plate_no

        if average_km is not None:
            vehicle.average_km = average_km

        if description is not None:
            vehicle.description = description

        if misc is not None:
            vehicle.misc = misc

        db.session.commit()

        return {"type": "success", "message": "Vehicle updated successfully!"}

    except Exception as e:
        return {"type": "error", "message": str(e)}




@api_handles.route('/remove_vehicle', methods=['POST'])
@login_required
def remove_vehicle():

    if not is_admin():
        return {"type": "error", "message": "No permission to perform this action"}

    try:
        vehicle_id = request.form.get("vehicle_id")
        if not vehicle_id:
            return {"type": "error", "message": "Missing vehicle_id"}

        vehicle = Vehicles.query.get(int(vehicle_id))
        if not vehicle:
            return {"type": "error", "message": "Vehicle not found"}

        db.session.delete(vehicle)
        db.session.commit()

        return {"type": "success", "message": "Vehicle removed successfully!"}

    except Exception as e:
        return {"type": "error", "message": str(e)}

# ================================
# Vehicles Section End
# ================================







# =============================
# Notifications Section Start ===
# =============================
@api_handles.route('/notification_list', methods=['GET', 'POST'])
@login_required
def get_my_notifications_():
    page = request.form.get('page', 1, type=int)
    per_page = request.form.get('per_page', 25, type=int)

    notifications = (
        Notification.query
        .filter(Notification.user_id == current_user.user_id, Notification.status != "deleted")
        .order_by(Notification.date.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )

    data = {
        'notifications': [
            {
                'id': notif.id,
                'type': notif.type,
                'json_data': notif.json_data,
                'date': notif.date,
                'seen': notif.seen
            }
            for notif in notifications.items
        ],
        'total': notifications.total,
        'pages': notifications.pages,
        'current_page': notifications.page
    }

    return jsonify(data)




@api_handles.route('/delete_notification', methods=['POST'])
@login_required
def delete_notification():
    c_id = request.form.get("notif_id")
    notification = Notification.query.get(c_id)

    if notification is None:
        return jsonify({'type': 'error', 'message': 'Notification not found.'})

    # Ensure the current user owns this notification
    if notification.user_id != current_user.user_id:
        return jsonify({'type': 'error', 'message': 'Unauthorized action.'})
    
    notification.status = "deleted"
    
    db.session.commit()

    return jsonify({'type': 'success', 'message': 'Notification removed successfully!'})


@api_handles.route('/see_notify', methods=['POST'])
def mark_notification_seen():
    notif_id = request.form.get('notif_id', type=int)

    if notif_id is None:
        return jsonify({'type': 'error', 'message': 'Notification ID is required.'}), 400

    # Query for the notification
    notification = Notification.query.get(notif_id)

    if notification is None:
        return jsonify({'type': 'error', 'message': 'Notification not found.'})

    notification.seen = 1
    db.session.commit()

    return jsonify({'type': 'success', 'message': 'Notification marked as seen.'})


@api_handles.route('/notification_count', methods=['GET', 'POST'])
def get_notification_count():
    if not current_user.is_authenticated:
        return jsonify({'type': 'error', 'message': 'User not authenticated'})

    total_count = (
        Notification.query
        .filter(Notification.user_id == current_user.user_id, Notification.status != "deleted")
        .count()
    )

    unseen_count = (
        Notification.query
        .filter(
            Notification.user_id == current_user.user_id,
            Notification.seen == 0,
            Notification.status != "deleted"
        )
        .count()
    )

    data = {
        'type': 'success',
        'total_notifications': total_count,
        'unseen_notifications': unseen_count
    }

    return jsonify(data)



@api_handles.route('/mark_all_notifications_read', methods=['POST'])
@login_required
def mark_all_notifications_read():
    notifications = Notification.query.filter_by(
        user_id=current_user.user_id,
        seen=0
    ).all()

    for notif in notifications:
        notif.seen = 1

    db.session.commit()

    return {
        "type": "success",
        "message": "All notifications marked as read."
    }


def add_notification(title, details, notif_type='notificaton', user_id=None, extras=""):
    # Create the json_data as a JSON string
    json_data = json.dumps({
        'title': title,
        'details': details,
        'extra': extras,
    })


    # Create a new notification instance
    new_notification = Notification(
        type=notif_type,
        json_data=json_data,
        user_id=user_id,
    )


    # Add to the database
    db.session.add(new_notification)
    db.session.commit()

    return new_notification



# =============================
# Notifications Section End ===
# =============================


# =============================
# Configuration Process Start ===
# =============================

@api_handles.route('/save_config', methods=['POST'])
@login_required
def save_config():

    if not is_admin():
         return jsonify({"type": "error", "message": "No permission to perform this action"})

    try:
        config_data = request.form.get("config_data")

        if not config_data:
            return jsonify({"type": "error", "message": "Missing config_data"})
        
        # Try to parse the string to ensure it's valid JSON
        parsed_data = json.loads(config_data)

        config_path = os.path.join(os.getcwd(), 'config.json')

        with open(config_path, 'w') as config_file:
            json.dump(parsed_data, config_file, indent=4)
        load_config()
        return jsonify({"type": "success", "message": "Config saved successfully"})

    except json.JSONDecodeError:
        return jsonify({"type": "error", "message": "Invalid JSON format"})
    except Exception as e:
        return jsonify({"type": "error", "message": str(e)})



@api_handles.route('/get_config', methods=['POST'])
def get_config():
    try:
        config_path = os.path.join(os.getcwd(), 'config.json')

        if not os.path.exists(config_path):
            return jsonify({"type": "error", "message": "Config file not found"})

        with open(config_path, 'r') as config_file:
            config_data = json.load(config_file)

        return jsonify({"type": "success", "data": config_data})

    except Exception as e:
        return jsonify({"type": "error", "message": str(e)})


def load_config():
    global CONFIG_DATA
    config_path = os.path.join(os.getcwd(), 'config.json')

    if os.path.exists(config_path):
        try:
            with open(config_path, 'r') as config_file:
                CONFIG_DATA = json.load(config_file)
        except Exception as e:
            print(f"Error loading config: {e}")
            CONFIG_DATA = {}
    else:
        CONFIG_DATA = {}
        
    print(" [INFO] Config Loaded to Global")
    print(CONFIG_DATA)
    
load_config()

# =============================
# Configuration Process End ===
# =============================




# ================================
# Other Section
# ================================
def is_admin(silent=False):
    if current_user.type == 1 or current_user.type == '1':
        return 1
    else:
        return 0

# ================================
# Other Section End
# ================================




# ================================
# Some Section
# ================================


# ================================
# Some Section End
# ================================

