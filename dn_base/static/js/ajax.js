odoo.define('dn_base.ajax', function (require) {
    "use strict";

    var core = require('web.core');
    var utils = require('web.utils');
    var time = require('web.time');

    var myajax = require('web.ajax');

    myajax.jsonRpc = function(url, fct_name, params, settings) {    
        return genericJsonRpc(fct_name, params, function(data) {            
            var strdata =  JSON.stringify(data, time.date_to_utc);            
            return $.ajax(url, _.extend({}, settings, {
                url: url,
                dataType: 'json',
                type: 'POST',
                data: strdata,
                beforeSend:function(a,b){
                    //console.log(b.url, data.params);
                },
                success:function(data){
//                    if (url == '/web/dataset/call_kw/meeting_point.document/read')
//                        console.log(data);
                },
                contentType: 'application/json'
            }));
        });
    }

    function genericJsonRpc (fct_name, params, fct) {
        var data = {
            jsonrpc: "2.0",
            method: fct_name,
            params: params,
            id: Math.floor(Math.random() * 1000 * 1000 * 1000)
        };
        var xhr = fct(data);
        var result = xhr.pipe(function(result) {
            core.bus.trigger('rpc:result', data, result);
            if (result.error !== undefined) {
//                if (result.error.data.arguments[0] !== "bus.Bus not available in test mode") {
//                    console.error("Server application error", JSON.stringify(result.error));
//                }
                var errorToGet = '';
                if(result.error.data)
                   errorToGet = result.error.data;
                else
                    errorToGet = result.error;
                //console.log(errorToGet);
                return $.Deferred().reject("server", result.error);
            } else {
                return result.result;
            }
        }, function() {
            //console.error("JsonRPC communication error", _.toArray(arguments));
            var def = $.Deferred();
            return def.reject.apply(def, ["communication"].concat(_.toArray(arguments)));
        });

        result.abort = function () { if (xhr.abort) xhr.abort(); };
        return result;
    }
});

var dn_json_rpc_object = {
        baseUrl: dn_base_web_url,
        showLoader: true,
        initialized:false,
        init: function (config) {
            if ($('#loaderContainerajax').length == 0) {
                var loaderHtml = '<div id="loaderContainerajax">';
                loaderHtml += '<img style="position:relative;left:42%" src="/dn_base/static/img/ajax-loader.gif" alt="loading data..." />';
                loaderHtml += '</div>';
                $('body').append(loaderHtml);
                this.loaderImage = $('#loaderContainerajax img');
                this.loaderContainer = $('#loaderContainerajax').css({
                    display: 'none',
                    position: 'fixed',
                    'z-index': 999999,
                    top : 0,
                    width:'100%',
                    background: 'rgba(0, 0, 0, 0.2)'
                });
            }
            if (config && config.baseUrl)
                dn_json_rpc_object.baseUrl = config.baseUrl;
            initialized = true;

            dn_json_rpc_object.loaderContainer.css({ top: 20 + 'px' });
            dn_json_rpc_object.loaderImage.css('top', '40%');
        },

        loaderContainer: null,
        loaderImage: null,

        request: function (reqfun, object, callback, failureCallBack) {
            if (!this.initialized)
                this.init();
            var serviceRequestInProgress = false;
            if (serviceRequestInProgress) {
                //sam_popup.show("Some Request Already In Progress", "ok");
                return;
            }
            var loaderhite = $(window).height() - 40;
            dn_json_rpc_object.loaderContainer.css({ height:loaderhite });
            serviceRequestInProgress = true;

            //sam_popup.hide();

            var requestUrl = dn_json_rpc_object.baseUrl + reqfun;
            object.function_url = reqfun;

            if (dn_json_rpc_object.showLoader) {
                dn_json_rpc_object.loaderContainer.css({ display: 'block' });
            }

            $.ajax({
                url: requestUrl,
                data: object,
                dataType: 'JSON',
                type:'POST',
                beforeSend: function (jqXHR, settings) {
                    url = settings.url;
                    //console.log(url);
                },
                success: function (results) {
                    //console.log(results);
                    dn_json_rpc_object.loaderContainer.hide();
                    serviceRequestInProgress = false;
                    dn_json_rpc_object.handleResponse(results, reqfun, callback, failureCallBack);
                },
                error: function (results) {
                    dn_json_rpc_object.loaderContainer.hide();
                    serviceRequestInProgress = false;
                    if(results.statusText == "OK")
                    {
                        if(callback)
                            callback(results.responseText);
                        return;
                    }
                    if(results && results.responseText)
                        results = results.responseText;
                    dn_json_rpc_object.handleError(results, reqfun);
                }
            });
        },

        handleError: function (res, reqfun) {
            if (!res)
                dntoast.error("Invalid Request Response in function reqfun ");
            else
                dntoast.error(res + "");
        },

        handleResponse: function (res, reqfun, callback, failureCallBack) {
            //console.log(res);
            if (res == undefined) {
                dntoast.error("Url hit successful but Invalid Request Response in "+ reqfun );
                return;
            }
            if (res.error == undefined) {
                dntoast.error("Url hit successful but error not defined  in "+ reqfun );
                return;
            }
            else
                res.error += "";
            if (res.error.length > 0) {
                if (failureCallBack)
                    failureCallBack(res.error);
                else {
                    dntoast.error(res.error);
                }
                return;
            }
            if (res.data == undefined) {
                if (res.message == undefined) {
                    dntoasterror("Undefined data and message " + reqfun);
                    return;
                }
                if (res.message.length == 0) {
                    dntoast.error("Undefined data and no message in function "+ reqfun);
                    return;
                }
            }

            if (res.message != undefined && res.message.length > 0) {
                if (res.message.length != 7 && res.message.toLowerCase() != "success")
                    dntoast.showSuccessMessage(res.message);
            }
            if (callback != undefined)
                callback(res.data);
        }
    };

function dn_json_rpc(url,input_data,callback)
{
    var ajaxUrl = dn_base_web_url+url;
    dn_json_rpc_object.request(url, input_data, callback)
}