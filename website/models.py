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
    
    
class FuelRequisitionRecords(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'))
    requested_by = db.Column(db.Integer, db.ForeignKey('driver_crew.id'))
    type = db.Column(db.String(50)) 
    branch_id = db.Column(db.String(50)) 
    actual_fuel_beg_l = db.Column(db.String(100)) 
    actual_fuel_endl = db.Column(db.String(100)) 
    supplier_vendor_name = db.Column(db.String(1000))
    no_of_ltrs = db.Column(db.String(1000))
    prev_costltr = db.Column(db.String(512))
    activity_type = db.Column(db.String(512))
    crewoccupants1 = db.Column(db.String(256))
    crewoccupants2 = db.Column(db.String(256))
    status = db.Column(db.String(50))
    last_fuel_recordltrs = db.Column(db.String(256))
    
    misc = db.Column(db.String(1024))
    date = db.Column(db.DateTime(timezone=True), default=manila_time)
    
    user = db.relationship('Users', backref='fuel_records', lazy=True)
    vehicle = db.relationship('Vehicles', backref='fuel_records', lazy=True)
    driver = db.relationship('DriverCrew', backref='fuel_records', lazy=True)




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



class DriverCrew(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    position = db.Column(db.String(255))
    department_id = db.Column(db.Integer, db.ForeignKey('department.id'))
    description = db.Column(db.String(1000))
    status = db.Column(db.String(50))
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


