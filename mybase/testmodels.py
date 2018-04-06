# -*- coding: utf-8 -*-

import sys
import traceback
from odoo import models, fields, api
from odoo.exceptions import UserError


    #_sql_constraints = [('app_user_uniq', 'unique(user_id)','User already exists')]

class test1(models.Model):
    _name = 'test.m1'
    name = fields.Char()
    va = fields.Integer()