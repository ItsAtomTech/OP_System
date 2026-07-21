from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func
from datetime import datetime
import pytz

def manila_time():
    return datetime.now(pytz.timezone("Asia/Manila"))


class Users(db.Model, UserMixin):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    status = db.Column(db.String(50))
    avatar = db.Column(db.String(50))
    type = db.Column(db.Integer, db.ForeignKey('user_type.type_id'))   
    misc = db.Column(db.String(1024))
    date = db.Column(db.DateTime(timezone=True), default=manila_time)
    
    def get_id(self):
        return str(self.user_id)  # Flask-Login will use user_id instead of default


class UserType(db.Model):
    type_id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50))




# =========================
# Forms Section Start
# =========================
class PurchaseRequests(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    purchase_id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50)) 
    items = db.Column(db.String(10000))
    purpose_of_request = db.Column(db.String(2000))
    misc = db.Column(db.String(1024))
    date_required = db.Column(db.String(1024))
    department_id = db.Column(db.Integer, db.ForeignKey('department.id'))
    date = db.Column(db.DateTime(timezone=True), default=manila_time)




# =========================
# Forms Section End
# =========================

# =========================
# Others Section Start
# =========================

class Department(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    date = db.Column(db.DateTime(timezone=True), default=manila_time)



class Vehicles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    plate_no = db.Column(db.String(255))
    average_km = db.Column(db.String(255))
    description = db.Column(db.String(1000))
    misc = db.Column(db.String(1024))
    date = db.Column(db.DateTime(timezone=True), default=manila_time)






# =========================
# Others Section End
# =========================


# =========================
# Notifications
# =========================
    
class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50))
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    json_data = db.Column(db.String(10000))
    status = db.Column(db.String(50), default="normal")
    date = db.Column(db.DateTime(timezone=True), default=manila_time)
    seen = db.Column(db.Integer(), default=0)


