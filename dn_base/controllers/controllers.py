# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request
from odoo.addons.web.controllers.main import Home

class Web(Home):
    @http.route('/', type='http', auth="none")
    def index(self):
        if not request.session.uid:
            return http.local_redirect('/web/login', query=request.params, keep_hash=True)
        else:
            return http.local_redirect('/web', query=request.params, keep_hash=True)

    @http.route('/wa/mytest', type='http', auth="none", cors="*")
    def get_signature(self, **kw):
        response_content = "my test"
        session = request.session
        return response_content



    # @http.route('/doc_to_pdf', auth='public', csrf=False)
    # def doc_to_pdf(self, **kw):
    #     try:
    #         if not 'file' in kw:
    #             return self.raiseError("Please Provide File")
    #         if not 'filename' in kw:
    #             return self.raiseError("Please Provide File Name")
    #
    #         str = uuid.uuid4().hex[:8]
    #         pth = tempfile.gettempdir()
    #         doc = kw['file']
    #         f = doc.decode('base64')
    #         save_path = pth + '\\' + str + kw['filename']
    #         doc_file = open(save_path, 'wb')
    #         doc_file.write(f)
    #         doc_file.close()
    #
    #         pythoncom.CoInitialize()
    #         word = win32com.client.Dispatch('Word.Application')
    #         doc1 = word.Documents.Open(save_path)
    #
    #         pdf_path = pth + '\\' + str +"_apipdf.pdf"
    #         doc1.SaveAs(pdf_path, FileFormat=17)
    #         doc1.Close()
    #         word.Quit()
    #         res = open(pdf_path, 'rb')
    #         return res
    #     except Exception:
    #         eg = traceback.format_exception(*sys.exc_info())
    #         errorMessage = ''
    #         for er in eg:
    #             errorMessage += "\n" + er
    #         return self.raiseError(errorMessage)
    #
    # def raiseError(self, er, data=False):
    #     if er:
    #         result = {"error": er}
    #     else:
    #         result = {"data": data, "error":""}
    #     return json.dumps(result)