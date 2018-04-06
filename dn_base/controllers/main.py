import sys
import json
import traceback
from odoo import http

class main():
    @http.route('/dn_base/menu_icons/', auth='public')
    def get_menu_icons(self):
        result = {"error": "Error"}
        data = http.request.env['dn_base.menu_icon'].search([])
        menus = []
        for menu in data:
            menus.append({"menu_id": menu.menu_id.id, "icon": menu.name})
        result = {"error": "", "data": menus}
        try:
            data = http.request.env['dn_base.menu_icon'].search([])
            menus = []
            for menu in data:
                menus.append({"menu_id": menu.menu_id.id, "icon": menu.name})
            result = {"error": "", "data": menus}
        except Exception:
            eg = traceback.format_exception(*sys.exc_info())
            errorMessage = ''
            for er in eg:
                errorMessage += "\n" + er
            result = {"error": errorMessage}
        result = json.dumps(result)
        return result

# import odoo.addons.web.controllers.main as main_contrroler
#
# class MyDataSet(main_contrroler.DataSet):
#     @http.route(['/web/dataset/call_kw', '/web/dataset/call_kw/<path:path>'], type='json', auth="user")
#     def call_kw(self, model, method, args, kwargs, path=None):
#         res = False
#         try:
#             res = self._call_kw(model, method, args, kwargs)
#         except Exception:
#             q = 1
#         return res


