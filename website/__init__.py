from flask import Flask, session
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager
from flask_login import current_user
import os, json, bleach

from bleach.css_sanitizer import CSSSanitizer

css_sanitizer = CSSSanitizer(
    allowed_css_properties=['color', 'font-family', 'font-size', 'font-style', 'font-weight', 'text-align',
                            'text-decoration', 'text-indent',
                            'background-color', 'background-image', 'background-repeat', 'background-size', 'border',
                            'border-bottom',
                            'border-left', 'border-radius', 'border-right', 'border-top', 'margin', 'margin-bottom',
                            'margin-left',
                            'margin-right', 'margin-top', 'padding', 'padding-bottom', 'padding-left', 'padding-right',
                            'padding-top',
                            'line-height', 'letter-spacing', 'word-spacing', 'max-width', 'min-width']
)

loopback_url_query: str = ""


db = SQLAlchemy()
DB_NAME = "OPS_DB.db"


def create_app():

    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'techatom_gold'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}' #for sqlite
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://flask_user:admin@localhost/kodetrek'
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    from .views import views
    from .user_control import user_control
    from .api_handles import api_handles

    UPLOAD_FOLDER = "uploads"
    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(api_handles, url_prefix='/')
    app.register_blueprint(user_control, url_prefix='/')




    from .models import Users, UserType

    create_database(app)
    
    # with app.app_context():
        # db.create_all()

    login_manager = LoginManager()
    login_manager.login_view = 'user_control.login_form'  # To where shall a user be taken if login is required
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):  # how should a user be loaded
        return Users.query.get(int(user_id))  # get user from user table

    @app.context_processor
    def get_userinfo():
        def get_user(us):
            return Users.query.filter_by(id=us).first()
        return dict(get_user=get_user)
       
       
        
    # @app.context_processor
    # def get_program_():
        # def get_programs():
            # deps = Department.query.order_by(Department.name.asc()).all()
            # return deps
        # return dict(get_programs=get_programs)     

        
    # @app.context_processor
    # def get_college_():
        # def get_college():
            # deps = College.query.order_by(College.name.asc()).all()
            # return deps
        # return dict(get_college=get_college)     

        
    @app.context_processor
    def get_user_ty():
        def get_user_types():
            typ = UserType.query.all()
            return typ
        return dict(get_user_types=get_user_types)
    
    @app.context_processor
    def get_type():
        def get_user_type(ids):
            typ = UserType.query.filter_by(type_id=ids).first()
            return typ
        return dict(get_user_type=get_user_type)
    

    @app.context_processor
    def parse_json_():
        def parse_json(strs):
            the_post = json.loads(strs)
            if the_post:
                return the_post
            else:
                return 0
        return dict(parse_json=parse_json)

    @app.context_processor
    def clean_():
        def clean(strs):
            return bleach.clean(
                strs,
                tags={'a',
                      'abbr',
                      'acronym',
                      'b',
                      'blockquote',
                      'code',
                      'em',
                      'p',
                      'i', 'li', 'ol',
                      'strong', 'ul',
                      'img', 'span','div','iframe',
                      'br',
                      'hr','font'},
                attributes={
                    '*': ['class', 'src', 'style', 'title', 'href', 'width', 'height', 'color', 'target', 'allowfullscreen', 'frameborder','scrolling']
                },
                css_sanitizer=css_sanitizer
            )


        return dict(clean=clean)

    @app.context_processor
    def get_current_user_():
        def get_current_user():
            return current_user
        return dict(get_current_user=get_current_user)
        
    @app.context_processor
    def get_theme():
        def get_theme():
            if 'theme' in session:
                return session.get('theme')
            return ""
        return dict(get_theme=get_theme)

    @app.context_processor
    def get_limit_string():
        def limit_string(st):
            if len(str(st)) > 53:
                return str('%.50s' % st)+'...'
            else:
                return st

        return dict(limit_string=limit_string)

    return app



# def create_database(app):
    # if not path.exists('website/' + DB_NAME):
        # with app.app_context():
            # db.create_all()
        # print('Missing database has been created!')
    # else:
        # print('Database check: Okay')


def create_database(app):
    db_path = path.join('website', DB_NAME)
    
    with app.app_context():
        inspector = db.inspect(db.engine)
        tables = inspector.get_table_names()

        if not tables:
            print("No tables found in database, creating all tables...")
            db.create_all()
        # else:
            # print(f"Database check: {len(tables)} tables found: OK.")

    if not path.exists(db_path):
        print("Warning: Database file not found initially (but may have been created now).")

