# -*- coding: utf-8 -*-
import sys
import traceback
from odoo import models, api, fields
from odoo.exceptions import UserError

class Empty(models.Model):
    _name = "dn_base.empty"
    name = fields.Char()

class MenuIcon(models.Model):
    _name = "dn_base.menu_icon"
    name = fields.Char()
    menu_id = fields.Many2one('ir.ui.menu')

class IrAttachment(models.Model):
    _inherit = "ir.attachment"

    @api.model
    def create(self, vals):
        if self._uid != 1:
            self.validate_file_type(vals)
        filedata = super(IrAttachment, self).create(vals)
        return filedata

    @api.multi
    def write(self, vals):
        if self._uid != 1:
            self.validate_file_type(vals)
        filedata = super(IrAttachment, self).write(vals)
        return filedata

    def validate_file_type(self, vals):
        fileType = 'exe'
        try:
            if 'datas_fname' in vals and vals['datas_fname'] == 'invitation.ics':
                return
            if not 'datas' in vals:
                raise UserError('No file, systme error')
            if vals['datas'] == '':
                raise UserError('No data in file')
            fileType = self._compute_mimetype(vals)
        except:
            eg = traceback.format_exception(*sys.exc_info())
            errorMessage = ''
            for er in eg:
                errorMessage += "--" + er
            raise UserError( errorMessage)
        if fileType not in ['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                            ,'application/vnd.ms-powerpoint','application/msword'
                            #,'application/vnd.ms-excel'
                            #,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                            ,'image/png','image/jpeg','image/jpg','image/bmp', 'image/gif'
                            ,'text/plain'
                            ]:
            raise  UserError("Only images and documents are valid for upload, "+fileType + " not allowed")


class Users(models.Model):
    _inherit = 'res.users'

    @api.model
    def create(self, vals):
        if "creating_child" in self._context:
            user = self.env['res.users'].search([('login', '=', vals['login'])])
            return user
        else:
    # /////////////////IF CREATING FROM BASE USER MENU///////////////////////
            user = super(Users, self).create(vals)
            values = self._remove_reified_groups(vals)
            if 'groups_id' in values:
                for v in values['groups_id']:
                    if type(v)==tuple:
                        if len(v) == 2 and v[0] == 4:
                            group_id = v[1]
                        else:
                            continue
                        user_model_ids = self.env['res.groups'].search(
                            [('id', '=', group_id)]).user_model_ids.ids
                        if not user_model_ids:
                            continue
                        for g in user_model_ids:
                            model = self.env['ir.model'].search([('id', '=', g)])
                            employee = self.env[model.model].search([('login', '=', vals['login'])])
                            if not employee:
                                self.env[model.model].with_context({"creating_child": True}).create(
                                    {'image': vals['image'],
                                     'login': vals['login'], 'name': vals['name'],
                                     'groups_id': [group_id]})

# /////////////////////IF CREATING FROM DN MENUES/////////////////////////////////
            if "dn_system_users_menu" in self._context:
                if 'groups_id' in vals:
                    selected_group_id = vals['groups_id'][0][2]
                    selected_group = self.env['res.groups'].search([('id', '=', selected_group_id[0])])
                    user_model_ids = selected_group.user_model_ids.ids

                    for g in user_model_ids:
                        model = self.env['ir.model'].search([('id', '=', g)])
                        usr = self.env[model.model].search([('user_id', '=', self.id)])
                        if not usr:
                            self.env[model.model].with_context({"creating_child": True}).create({'image': vals['image'],
                                                                                                 'login': vals['login'],
                                                                                                 'name': vals['name']})

            return user

    @api.multi
    def write(self, vals):
        values = self._remove_reified_groups(vals)

        context = self._context
        params = context.get('params')
        action=False
        if params:
            action = params.get('action')
        if action:
 # /////////////////IF WRITING FROM BASE USER MENU///////////////////////
            action_id = self.env.ref('base.action_res_users').id
            if action_id == action:
                if 'groups_id' in values:
                    remove_category_group_list = [] #Type Cast [category_id,group_id]
                    remove_category_list=[]
                    for v in values['groups_id']:
                        if v[0] == 4:
                            group_id = v[1]
                            user_model_ids = self.env['res.groups'].search([('id', '=', group_id)]).user_model_ids.ids
                            # model = self.env['ir.model'].search([('name', '=', group_category.name)])
                            if not user_model_ids:
                                continue
                            for g in user_model_ids:
                                model = self.env['ir.model'].search([('id', '=', g)])
                                employee = self.env[model.model].search([('user_id', '=', self.id)])
                                if not employee:
                                    self.env[model.model].with_context({"creating_child":True}).create({'image': self.image,
                                                                                                            'login': self.login, 'name': self.name,
                                                                                                            'groups_id': [group_id]})
                        if v[0]==3:
                            group_id=v[1]
                            group = self.env['res.groups'].search([('id', '=', group_id)])
                            for implied_id in group.implied_ids.ids:
                                values['groups_id'].append((3, implied_id))
                            if not group.category_id.id in remove_category_list:
                                remove_category_list.append(group.category_id.id)
                            remove_category_group_list.append([group.category_id.id,group_id])

 # /////////////////IF WRITING FROM DN USER MENUES///////////////////////
            if "dn_users_menu" in self._context:
                if 'groups_id' in vals:

                    selected_group_id = vals['groups_id'][0][2]
                    selected_group = self.env['res.groups'].search([('id', '=', selected_group_id[0])])
                    user_model_ids = selected_group.user_model_ids.ids

                    for g in user_model_ids:
                        model = self.env['ir.model'].search([('id', '=', g)])
                        usr = self.env[model.model].search([('user_id', '=', self.id)])
                        if not usr:
                            self.env[model.model].with_context({"creating_child": True}).create({'image': self.image,
                                                                                                 'login': self.login,
                                                                                                 'name': self.name})

                    remove_groups = self.env['res.groups'].search(
                        [('category_id', '=', selected_group.category_id.id)])
                    remove_group_ids = remove_groups.ids
                    for g in remove_groups:
                        for implied_id in g.implied_ids.ids:
                            remove_group_ids.append(implied_id)
                    current_group_ids = self.groups_id.ids
                    current_group_ids = set(current_group_ids) - set(remove_group_ids)
                    selected_group_id.extend(current_group_ids)


        user = super(Users, self).write(values)
        return user

