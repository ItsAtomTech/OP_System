from functools import wraps

from flask import url_for, request
from flask_login import login_user, login_required, logout_user, current_user
from flask_login.config import EXEMPT_METHODS
from werkzeug.utils import redirect



class Loopback:
    loop_back = "sample_text"


class Post_Visibility:
    visibility = [['published', 'Published'], ['private', 'Private']]


class Post_Status:
    status = [['available', 'Available'], ['unavailable', 'Unavailable']]


class Sorting:
    sorting = []


class Avatars:
    avatars = [
        ['user', 'user.png'],
        ['user_icons/user_1', 'user_icons/user_1.png'],
        ['user_icons/user_2', 'user_icons/user_2.png'],
        ['user_icons/user_3', 'user_icons/user_3.png'],
        ['user_icons/user_4', 'user_icons/user_4.png'],
        ['user_icons/user_5', 'user_icons/user_5.png'],
        ['user_icons/user_6', 'user_icons/user_6.png'],
        ['user_icons/user_7', 'user_icons/user_7.png'],
        ['user_icons/user_8', 'user_icons/user_8.png'],
        ['user_icons/user_9', 'user_icons/user_9.png'],    
        ['user_icons/user_10', 'user_icons/user_10.png'],
        ['user_icons/user_11', 'user_icons/user_11.png'],
        ['user_icons/user_12', 'user_icons/user_12.png'],
        ['user_icons/user_13', 'user_icons/user_13.png'],
        ['user_icons/user_14', 'user_icons/user_14.png'],
        ['user_icons/user_15', 'user_icons/user_15.png'],
        ['user_icons/user_16', 'user_icons/user_16.png'],
        ['user_icons/user_17', 'user_icons/user_17.png'],
        ['user_icons/user_18', 'user_icons/user_18.png'],
        ['user_icons/user_19', 'user_icons/user_19.png'],
        ['user_icons/user_20', 'user_icons/user_20.png'],
        ['user_icons/user_21', 'user_icons/user_21.png'],
        ['user_icons/user_22', 'user_icons/user_22.png'],
        ['user_icons/user_23', 'user_icons/user_23.png'],
        ['user_icons/user_24', 'user_icons/user_24.png'],
        ['user_icons/user_25', 'user_icons/user_25.png'],
        ['user_icons/user_26', 'user_icons/user_26.png'],
        ['user_icons/user_27', 'user_icons/user_27.png'],
        ['user_icons/user_28', 'user_icons/user_28.png'],
        ['user_icons/user_29', 'user_icons/user_29.png'],
        ['user_icons/user_30', 'user_icons/user_30.png'],
        ['user_icons/user_31', 'user_icons/user_31.png'],
        ['user_icons/user_32', 'user_icons/user_32.png'],
        ['user_icons/user_33', 'user_icons/user_33.png'],
        ['user_icons/user_34', 'user_icons/user_34.png'],
        ['user_icons/user_35', 'user_icons/user_35.png'],
        ['user_icons/user_36', 'user_icons/user_36.png'],
        ['user_icons/user_37', 'user_icons/user_37.png'],
        ['user_icons/user_38', 'user_icons/user_38.png'],
        ['user_icons/user_39', 'user_icons/user_39.png'],
        ['user_icons/user_40', 'user_icons/user_40.png'],
        ['user_icons/user_41', 'user_icons/user_41.png'],
        ['user_icons/user_42', 'user_icons/user_42.png'],
        ['user_icons/user_43', 'user_icons/user_43.png'],
        ['user_icons/user_44', 'user_icons/user_44.png'],
        ['user_icons/user_45', 'user_icons/user_45.png'],
        ['user_icons/user_46', 'user_icons/user_46.png'],
        ['user_icons/user_47', 'user_icons/user_47.png'],
        ['user_icons/user_48', 'user_icons/user_48.png'],
        ['user_icons/user_49', 'user_icons/user_49.png'],
        ['user_icons/user_50', 'user_icons/user_50.png'],
        ['user_icons/user_51', 'user_icons/user_51.png'],
        ['user_icons/user_52', 'user_icons/user_52.png'],
        ['user_icons/user_53', 'user_icons/user_53.png'],
        ['user_icons/user_54', 'user_icons/user_54.png'],
        ['user_icons/user_55', 'user_icons/user_55.png'],
        ['user_icons/user_56', 'user_icons/user_56.png'],
        ['user_icons/user_57', 'user_icons/user_57.png'],
        ['user_icons/user_58', 'user_icons/user_58.png'],
        ['user_icons/user_59', 'user_icons/user_59.png'],
        ['user_icons/user_60', 'user_icons/user_60.png'],
        ['user_icons/user_61', 'user_icons/user_61.png'],
        ['user_icons/user_62', 'user_icons/user_62.png'],
        ['user_icons/user_63', 'user_icons/user_63.png'],
        ['user_icons/user_64', 'user_icons/user_64.png'],
        ['user_icons/user_65', 'user_icons/user_65.png'],
        ['user_icons/user_66', 'user_icons/user_66.png'],
        ['user_icons/user_67', 'user_icons/user_67.png'],
        ['user_icons/user_68', 'user_icons/user_68.png'],
        ['user_icons/user_69', 'user_icons/user_69.png'],
        ['user_icons/user_70', 'user_icons/user_70.png'],
        ['user_icons/user_71', 'user_icons/user_71.png'],
        ['user_icons/user_72', 'user_icons/user_72.png'],
        ['user_icons/user_73', 'user_icons/user_73.png'],
        ['user_icons/user_74', 'user_icons/user_74.png'],
        ['user_icons/user_75', 'user_icons/user_75.png'],
        ['user_icons/user_76', 'user_icons/user_76.png'],
        ['user_icons/user_77', 'user_icons/user_77.png'],
        ['user_icons/user_78', 'user_icons/user_78.png'],
        ['user_icons/user_79', 'user_icons/user_79.png'],
        ['user_icons/user_80', 'user_icons/user_80.png'],
        ['user_icons/user_81', 'user_icons/user_81.png'],
        ['user_icons/user_82', 'user_icons/user_82.png'],
        ['user_icons/user_83', 'user_icons/user_83.png'],
        ['user_icons/user_84', 'user_icons/user_84.png'],
        ['user_icons/user_85', 'user_icons/user_85.png'],
        ['user_icons/user_86', 'user_icons/user_86.png'],
        ['user_icons/user_87', 'user_icons/user_87.png'],
        ['user_icons/user_88', 'user_icons/user_88.png'],
        ['user_icons/user_89', 'user_icons/user_89.png'],
        ['user_icons/user_90', 'user_icons/user_90.png'],
        ['user_icons/user_91', 'user_icons/user_91.png'],
        ['user_icons/user_92', 'user_icons/user_92.png'],
        ['user_icons/user_93', 'user_icons/user_93.png'],
        ['user_icons/user_94', 'user_icons/user_94.png'],
        ['user_icons/user_95', 'user_icons/user_95.png'],
        ['user_icons/user_96', 'user_icons/user_96.png'],
        ['user_icons/user_97', 'user_icons/user_97.png'],
        ['user_icons/user_98', 'user_icons/user_98.png'],
        ['user_icons/user_99', 'user_icons/user_99.png'],
        ['user_icons/user_100', 'user_icons/user_100.png'],
        ['user_icons/user_101', 'user_icons/user_101.png'],
        ['user_icons/user_102', 'user_icons/user_102.png'],
        ['user_icons/user_103', 'user_icons/user_103.png'],
        ['user_icons/user_104', 'user_icons/user_104.png'],
        ['user_icons/user_105', 'user_icons/user_105.png'],
        ['user_icons/user_106', 'user_icons/user_106.png'],
        ['user_icons/user_107', 'user_icons/user_107.png'],
        ['user_icons/user_108', 'user_icons/user_108.png'],


    ]


