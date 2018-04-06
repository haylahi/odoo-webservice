import sys
import json
import traceback
from odoo import http
from . import ws_auth
from odoo.http import request

class MyWebService(http.Controller):

    @http.route('/ws/test', cors=ws_auth.allow_from, auth='none')
    def ws_test(self, **kw):

        security = ws_auth.ws_authenticate(kw)
        if security != "authorized":
            return ws_auth.ws_result(security)
        return ws_auth.ws_result(False, "Test Succeeded")

    @http.route('/ws/login', cors=ws_auth.allow_from, auth='none')
    def login(self, **kw):
        security, sid = ws_auth.ws_login(kw)
        if security != "authorized":
           return ws_auth.ws_result(security)
        return ws_auth.ws_result(False, {'sid': sid})
