import sys
import json
import datetime
import traceback
from odoo.http import request


authentic_sessions = []
allow_from = 'http://localhost:1024'

def ws_result( er, data=False):
    try:
        if er:
            result = {"error": er}
        else:
            result = {"data": data, "error": ""}
        result = json.dumps(result)
        return result
    except:
        short_error = sys.exc_info()
        eg = traceback.format_exception(*short_error)
        errorMessage = ''
        for er in eg:
            errorMessage += "\n" + er
        return ws_result(er)

def ws_login( kw):
    try:
        login = kw['login']
        password = kw['password']
        session = request.session
        session.authenticate(session.db, login, password)
        uid = session.uid
        if uid:
            time = datetime.datetime.now()
            token = {'uid': uid, 'sid': session.sid, 'db': session.db, 'time': time}
            remove_me(uid)
            ws_remove_lazy_sessions()
            authentic_sessions.append(token)
            return "authorized", session.sid
    except:
        short_error = sys.exc_info()
        eg = traceback.format_exception(*short_error)
        errorMessage = ''
        for er in eg:
            errorMessage += "\n" + er
        return "Invalid credentials exception", False
    return "Invalid credentials", False

def ws_authenticate(kw):
    try:
        sid = kw['ws_sid']
        i = 0
        for ses in authentic_sessions:
            if ses['sid'] == sid:
                request.session = ses
                authentic_sessions.pop(i)
                ses['time'] = datetime.datetime.now()
                authentic_sessions.append(ses)
                return "authorized"
            i += 1
    except:
        short_error = sys.exc_info()
        eg = traceback.format_exception(*short_error)
        errorMessage = ''
        for er in eg:
            errorMessage += "\n" + er
        return "unauthorized exception"
    return "unauthorized"

def ws_remove_lazy_sessions():
    i = 0
    time = datetime.datetime.now()
    for ses in authentic_sessions:
        time_span = time - ses['time']
        time_span_seconds = time_span.total_seconds()
        minutes_diff = time_span_seconds / 60.0
        if minutes_diff > 10:
            authentic_sessions.pop(i)
        else:
            break
        i += 1

def remove_me( uid):
    i = 0
    for ses in authentic_sessions:
        if ses['uid'] == uid:
            authentic_sessions.pop(i)
            break
        i += 1