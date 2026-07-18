import hashlib
import random, uuid, re

from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash

from . import db
from .global_vars import Avatars
from .mailing import mailing
from .models import Users
# from .api_handles import add_notification

user_control = Blueprint('user_control', __name__)

recovery_email_id: str = ''


@user_control.route('/login', methods=['GET', 'POST'])
def login_form():
    nextpage = request.args.get('next')
    if nextpage is None:
        nextpage = ''

    return render_template("login.html", user=current_user, nextpage=nextpage)


@user_control.route('/signup', methods=['GET', 'POST'])
def signup_form():
    return render_template("signup.html", user=current_user)


@user_control.route('/my_profile', methods=['GET', 'POST'])
@login_required
def show_profile():
    sent = request.args.get('sent')
    if sent is None:
        sent = 'false'

    return render_template("profile.html", user=current_user, page='my_profile', sent=sent)


@user_control.route('/edit_profile', methods=['GET', 'POST'])
@login_required
def edit_profile():
    avatars = Avatars.avatars

    return render_template("profile.html", user=current_user, page='edit_profile', avatars=avatars)


@user_control.route('/user_profile', methods=['GET', 'POST'])
@login_required
def show_user_profile():
    user_id = request.args.get('u_id')
    if user_id is None:
        user_id = ''

    user = Users.query.filter_by(user_id=user_id).first()

    if user:
        return render_template("profile.html", user=user, page='user_profile')
    else:
        flash("User not Found!", category='warning')
        return redirect(url_for('views.home'))


@user_control.route('/confirm_email', methods=['POST', 'GET'])
@login_required
def confirm_email():
    user_id = current_user.user_id
    base_url = request.url_root
    code = random.randint(1000, 99999)
    code5 = hashlib.md5(str(code).encode()).hexdigest()

    codes = Users.query.filter_by(user_id=user_id).first()
    codes.misc = code5
    rcp = codes.email

    db.session.commit()

    link = base_url + 'confirm_account?ic=' + code5 + '&id=' + str(user_id)

    print(link)
    mailing(link, 'confirm', rcp)

    flash("The Confirm Email have been sent! ", category="success")
    return redirect(url_for('user_control.show_profile') + '?sent=true')


@user_control.route('/confirm_account', methods=['POST', 'GET'])
def act_account():
    code = request.args.get('ic')
    u_id = request.args.get('id')
    if code is None:
        code = ""
    if u_id is None:
        return redirect(url_for('views.home'))

    account = Users.query.filter_by(user_id=u_id).first()

    if not account:
        flash("Account id not found! ", category="error")
        return redirect(url_for('views.home'))

    misc_code = account.misc

    if code == misc_code:
        account.misc = ""
        account.status = "confirmed"
        db.session.commit()
        flash("The Account have been Verified and Activated!", category="success")
    else:

        flash("Invalid, try again! ", category="error")

    return redirect(url_for('views.home'))


# creating new user
@user_control.route('/add_account', methods=['POST'])
def create_account():
    if request.method == 'POST':

        email = request.form.get('email')
        password = request.form.get('password')
        password_c = request.form.get('password_c')
        user_name = request.form.get('username')

        if email is None:
            email = ''

        existing_user = Users.query.filter_by(email=email).first()
        c_user = current_user

        if existing_user:
            flash('Email used already', category="error")
        elif len(email) < 5:
            flash('Email too short!', category="error")
        elif password_c != password:
            flash('Password not match!', category="error")
            
        #Password validation: at least 8 chars, must contain both letters and numbers
        if len(password) < 8:
            return {"type": "error", "message": "Password must be at least 8 characters long"}

        if not (any(c.isalpha() for c in password) and any(c.isdigit() for c in password)):
            return {"type": "error", "message": "Password must contain both letters and numbers"}

        else:
            add_account = Users(email=email,
                                username=user_name,
                        password=generate_password_hash(password, method='pbkdf2:sha256'),
                                type=1,
                                avatar='user',
                                status='pending')
            db.session.add(add_account)
            db.session.commit()
            flash('User Added', category="success")

            if c_user.is_authenticated:
                logout_user()

            new_user = Users.query.filter_by(email=email).first()

            login_user(new_user, remember=True)

            not_title = "New User Signup"
            details = f"A new account with name: {new_user.username} has created an account."
            extra_data = f"user_id:{new_user.user_id}"

            # Query all admins
            admin_users = Users.query.filter_by(type="admin").all()


            return redirect(url_for('views.home'))

    return render_template("signup.html")


@user_control.route('/add_account_json', methods=['POST'])
def create_account_json():
    try:
        email = request.form.get('email')
        password = request.form.get('password')
        password_c = request.form.get('password_c')
        user_name = request.form.get('username')
        department = request.form.get('department') or None;

        if not email:
            return {"type": "error", "message": "Email is required"}

        existing_user = Users.query.filter_by(email=email).first()

        if existing_user:
            return {"type": "error", "message": "Email already in use"}

        #Password validation: at least 8 chars, must contain both letters and numbers
        if len(password) < 8:
            return {"type": "error", "message": "Password must be at least 8 characters long"}

        if not (any(c.isalpha() for c in password) and any(c.isdigit() for c in password)):
            return {"type": "error", "message": "Password must contain both letters and numbers"}


        if password != password_c:
            return {"type": "error", "message": "Passwords do not match"}

        # Create user
        add_account = Users(
            email=email,
            username=user_name,
            password=generate_password_hash(password, method='pbkdf2:sha256'),
            type=1,
            avatar='user',
            status='pending'
        )
        db.session.add(add_account)
        db.session.commit()

        # Logout current user if logged in
        if current_user.is_authenticated:
            logout_user()

        # Login new user
        new_user = Users.query.filter_by(email=email).first()
        login_user(new_user, remember=True)

        # Notify admins
        not_title = "New User Signup"
        details = f"A new account with name: {new_user.username} has created an account."
        extra_data = f"user_id:{new_user.user_id}"

        admin_users = Users.query.filter_by(type="admin").all()


        return {
            "type": "success",
            "message": "User account created successfully",
            "user": {
                "user_id": new_user.user_id,
                "username": new_user.username,
                "email": new_user.email,
                "type": new_user.type,
                "status": new_user.status
            }
        }

    except Exception as e:
        return {"type": "error", "message": str(e)}



@user_control.route('/log_account', methods=['POST', 'GET'])
def log_account():
    if request.method == 'POST':
        identifier = request.form.get('email')  # Could be email or username
        password = request.form.get('password')
        remember = request.form.get('remember')
        nextpage = request.form.get('nextpage')

        # Try to find user by email first, then username
        user = Users.query.filter(
            (Users.email == identifier) | (Users.username == identifier)
        ).first()

        if user:
            if check_password_hash(user.password, password):
                rem = True if remember else False
                login_user(user, remember=rem)
                flash("Account login success!", category="success")
                return redirect(nextpage) if nextpage else redirect(url_for('views.home'))
            else:
                flash("Password is not correct!", category="error")
        else:
            flash("No account found with that email or username!", category="warning")

    return redirect(url_for('user_control.login_form'))


#will get user access token for valid login
@user_control.route('/log_account_api', methods=['POST'])
def api_log_account():
    identifier = request.form.get('email')  # Can be username or email
    password = request.form.get('password')

    if not identifier or not password:
        return jsonify({
            "type": "error",
            "message": "Missing email/username or password."
        })

    user = Users.query.filter(
        (Users.email == identifier) | (Users.username == identifier)
    ).first()

    if user and check_password_hash(user.password, password):
        return jsonify({
            "type": "success",
            "user_id": user.user_id
        })
    else:
        return jsonify({
            "type": "error",
            "message": "Invalid username/email or password."
        })


# Logout Account
@user_control.route('/logout')
def logout():
    logout_user()
    flash('Account logged out!', category='success')

    return redirect(url_for('views.home'))


@user_control.route('/change_pass', methods=['POST', 'GET'])
@login_required
def ch_pass():
    sent = request.args.get('sent')
    if sent is None:
        sent = 'false'

    return render_template("profile.html", current_user=current_user, page='change_pass', sent=sent)


@user_control.route('/send_code_pass', methods=['POST', 'GET'])
@login_required
def send_pass():
    if current_user.status == 'confirmed':

        user_id = current_user.user_id
        code = random.randint(10000, 99999)
        user_i = Users.query.filter_by(user_id=user_id).first()
        user_i.misc = code
        rcp = user_i.email

        # print(code)
        db.session.commit()
        mailing(code, 'pass_code', rcp)
        flash("The Email with code is sent! ", category="success")

        return redirect(url_for('user_control.ch_pass') + '?sent=true')
    else:
        flash("Not allowed! ", category="error")
        return redirect(url_for('user_control.show_profile') + '')


@user_control.route('/save_new_pass', methods=['POST'])
def save_new_pass():
    pass1 = request.form.get('pass')
    pass2 = request.form.get('cpass')
    code = request.form.get('code')

    if pass1 is None:
        pass1 = "?"
    if code is None:
        code = ""
    if pass1 == pass2:

        new_pass = generate_password_hash(pass1, method='pbkdf2:sha256')

    else:
        flash("Password not matched!", category="error")
        return redirect(url_for('user_control.ch_pass') + '?sent=true')

    user_id = current_user.user_id
    user_i = Users.query.filter_by(user_id=user_id).first()
    
            #Password validation: at least 8 chars, must contain both letters and numbers
    if len(pass1) < 8:
        
        flash("Password needs to be 8 chars long!", category="error")
        return redirect(url_for('user_control.ch_pass') + '?sent=true')

    if not (any(c.isalpha() for c in pass1) and any(c.isdigit() for c in pass1)):
        flash("Password must contain both letters and numbers", category="error")
        return redirect(url_for('user_control.ch_pass') + '?sent=true')
        
        
    if user_i.misc == code and len(str(code)) > 2:
        user_i.password = new_pass
        db.session.commit()
        flash("Password is now changed!", category="success")

    else:
        flash("The code seems not valid!", category="error")
        user_i.misc = ""
        db.session.commit()
    return redirect(url_for('user_control.show_profile') + '')


# Change User Status
@user_control.route('/user_status', methods=['POST', 'GET'])
@login_required
def change_status():
    user_id = current_user.user_id

    user_status = request.args.get('status')
    if user_status is None:
        user_status = ""

    user_s = Users.query.filter_by(user_id=user_id).first()
    if user_s.status == 'no':
        user_status = 'yes'
        flash("You Marked yourself Available for Messages", category='success')
    else:
        user_status = 'no'

        flash("You Marked yourself Not available for Messages", category='success')
    user_s.status = user_status

    db.session.commit()

    return redirect(url_for('user_control.show_profile'))


# Account Recovery page
@user_control.route('/recover_my_account', methods=['POST', 'GET'])
def recover_page():
    sent = request.args.get('sent')
    if sent is None:
        sent = 'false'
    # flash(current_user.id, category='info')
    if current_user.is_authenticated:
        return redirect(url_for('user_control.show_profile') + '')
    else:
        return render_template("profile.html", page='recover_page', sent=sent)


# Send Code for Recovery
@user_control.route('/send_recover', methods=['POST'])
def send_pass_code():
    email = request.form.get('email')
    global recovery_email_id
    if email is None:
        email = ''

    account = Users.query.filter_by(email=email).first()

    if account:
        flash("Email sent to: " + str(email) + ', check your inbox.', category="success")
        recovery_email_id = account.user_id
        code = random.randint(10000, 99999)

        user_i = Users.query.filter_by(user_id=account.user_id).first()
        user_i.misc = code
        rcp = user_i.email
        db.session.commit()

        mailing(code, 'pass_recover', rcp)

        return redirect(url_for('user_control.recover_page') + '?sent=true')
    else:
        flash('Email :' + email + ' not found on the site!', category="error")
        recovery_email_id = ""
        return redirect(url_for('user_control.recover_page') + '?sent=')


@user_control.route('/recover_new_pass', methods=['POST'])
def save_recover_pass():
    pass1 = request.form.get('pass')
    pass2 = request.form.get('cpass')
    code = request.form.get('code')

    if pass1 is None:
        pass1 = "?"

    if pass1 == pass2:

        new_pass = generate_password_hash(pass1, method='pbkdf2:sha256')

    else:
        flash("Password seemed not matched!", category="error")
        return redirect(url_for('user_control.recover_page') + '?sent=true')
    
            #Password validation: at least 8 chars, must contain both letters and numbers
    if len(pass1) < 8:
        return {"type": "error", "message": "Password must be at least 8 characters long"}

    if not (any(c.isalpha() for c in pass1) and any(c.isdigit() for c in pass1)):
        return {"type": "error", "message": "Password must contain both letters and numbers"}
    
    user_id = recovery_email_id

    if recovery_email_id == "":
        flash("Enter email first!", category="error")
        return redirect(url_for('user_control.recover_page') + '?sent=')

    user_i = Users.query.filter_by(user_id=user_id).first()
    if user_i.misc == code:
        user_i.password = new_pass
        user_i.misc = ""
        db.session.commit()
        login_user(user_i, remember=True)
        flash("Password recovered!, account now unlocked!", category="success")
        return redirect(url_for('user_control.show_profile') + '')

    else:
        flash("The you entered code is not valid!", category="error")

        return redirect(url_for('user_control.recover_page') + '?sent=true')


@user_control.route('/save_profile', methods=['POST'])
@login_required
def change_name():
    user_id = current_user.user_id

    in_name = request.form.get('username')
    in_avatar = request.form.get('avatar')
    coords = request.form.get('coords')
    time_open = request.form.get('time_open')
    time_close = request.form.get('time_close')

    if in_name is None:
        in_name = "Username(not set)"
    if in_avatar is None:
        in_avatar = 'user'
    if coords is None:
        coords = '0,0'

    usern = Users.query.filter_by(user_id=user_id).first()
    usern.username = in_name
    usern.avatar = in_avatar
    usern.coords = coords
    usern.time_open = time_open
    usern.time_close = time_close

    db.session.commit()

    return redirect(url_for('user_control.show_profile'))
