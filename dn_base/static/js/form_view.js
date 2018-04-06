$(function(){
    $('body').append('<link rel="stylesheet" href="/dn_base/static/css/time_picker.css" />');
    $('body').on('blur','.o_form_view  .dn_time_picker' ,function(e){
        $(this).removeClass('error');
        if(!this.value)
            return;
        var time_pattern = "^\\d+:[0-5][0-9]$";

        var pattern = new RegExp(time_pattern);
        var res = pattern.test(this.value);
        if(!res)
        {
            $(this).addClass('error');
            $(this).focus();
        }
    });
});


var dn_masking_values = {'conference':'999-999-9999','zip':'99999','pin':'9999999999'
,'phone':'999-999-9999'
,'dn_time_picker':'99:99'}

odoo.define('dn_base.form_view', function (require) {
    "use strict";
    var core = require('web.core');
    var FormViewRenderer = require('web.FormRenderer');
    FormViewRenderer.include({
        autofocus : function(viewInfo, params){

            this._super.apply(this, arguments);
            if (this.mode === 'readonly') {
                return;
            }

            this.$el.find(".masked_input").each(function(i, el){
                var masking_pattern = false;
                for(var class_name in dn_masking_values)
                {
                    if($(el).hasClass(class_name))
                    {
                        masking_pattern = dn_masking_values[class_name];
                        $(el).mask(masking_pattern);
                        break;
                    }
                }
                if(!masking_pattern)
                    $(el).attr('placeholder', 'No masking pattern chosen');
            });
            this.$el.find('.dn_time_picker').timepicker({});
            updateUploadAcceptTypes();
        }
    });
    return FormViewRenderer;
});

function updateUploadAcceptTypes(fileTypesToUpload)
{
    setTimeout(function(){
        var file_inputs = $('input[type="file"]');
        if(file_inputs.length>0)
        {
            if(!fileTypesToUpload)
            {
                fileTypesToUpload = '.pdf,.ppt,.pptx,.doc,.docx';
                //fileTypesToUpload = '.pdf';
                //fileTypesToUpload +=',.csv,.txt';
                //fileTypesToUpload +=',.jpeg,.jpg,.png';
            }

            file_inputs.each(function(i, obj){
                if($(obj).closest('.o_form_image_controls').length != 0)
                    $(obj).attr('accept',"image/*");

                if(!$(obj).attr('accept'))
                    $(obj).attr('accept',fileTypesToUpload);
            });
        }
    }, 1000);
}