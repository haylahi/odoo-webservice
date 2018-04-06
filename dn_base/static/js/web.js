odoo.define('dn_base.webClient', function (require) {
"use strict";
    var WebClient = require('web.WebClient');
    WebClient.include({
        show_application: function() {
            return this._super.apply(this, arguments);
        }
    });
});

document.writeln('<script src="/dn_base/static/js/ready.js"></script>');
