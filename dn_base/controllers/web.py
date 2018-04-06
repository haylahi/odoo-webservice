from odoo import http
from odoo.http import request
from odoo.addons.web.controllers.main import Home

class MyHome(Home):
    @http.route('/', type='http', auth="none")
    def index(self):
        if not request.session.uid:
            return http.local_redirect('/web/login', query=request.params, keep_hash=True)
        else:
            return http.local_redirect('/web', query=request.params, keep_hash=True)

# def ensure_db(redirect='/web/database/selector'):
#     db = request.params.get('db') and request.params.get('db').strip()
#     if db and db not in http.db_filter([db]):
#         db = None
#     if db and not request.session.db:
#         r = request.httprequest
#         url_redirect = r.base_url
#         if r.query_string:
#             url_redirect += '?' + r.query_string
#         response = werkzeug.utils.redirect(url_redirect, 302)
#         request.session.db = db
#         abort_and_redirect(url_redirect)
#     if not db and request.session.db and http.db_filter([request.session.db]):
#         db = request.session.db
#     if not db:
#         db = db_monodb(request.httprequest)
#     if not db:
#         werkzeug.exceptions.abort(werkzeug.utils.redirect(redirect, 303))
#
#     # always switch the session to the computed db
#     if db != request.session.db:
#         request.session.logout()
#         abort_and_redirect(request.httprequest.url)
#     request.session.db = db
#
# class web(http.Controller):
#     @http.route('/web', type='http', auth="none")
#     def web_client(self, s_action=None, **kw):
#         ensure_db()
#         if not request.session.uid:
#             return werkzeug.utils.redirect('/web/login', 303)
#         if kw.get('redirect'):
#             return werkzeug.utils.redirect(kw.get('redirect'), 303)
#
#         request.uid = request.session.uid
#         context = request.env['ir.http'].webclient_rendering_context()
#
#         return http.local_redirect('/web', query=request.params, keep_hash=True)