

var dntoast =
    {
        initialized: false,
        inittoast: function () {
            var toast_html = '<div class="dntoast" id="dntoast" style="color:white;padding:10px">';
            toast_html += '<div class="message"></div><button>OK</button></div>';

            $('body').append(toast_html);
            $('#dntoast').css({
                'z-index': 99999,
                position: 'absolute',
                display: 'none',
                width: '20%',
                left: '77%',
                'color': 'white',
                overflow: 'auto',
                'max-height': '70%',
                top: '9%',
                'text-align': 'center',
                'font-weight': '400'
            });
            $('#dntoast .message').css('width', '100%');
            $('#dntoast>button').css('color','black').click(function () {
                dntoast.hide();
            });
            var dt = new Date();
            var clicks = 0;
            $('#dntoast').click(function () {
                var dt1 = new Date();
                if (clicks == 1) {
                    var diffInSeconds = (dt1.getSeconds() * 1000 + dt1.getMilliseconds()) - (dt.getSeconds() * 1000 + dt.getMilliseconds());
                    if (diffInSeconds < 0)
                        diffInSeconds *= -1;
                    if (diffInSeconds > 1500)
                        clicks = 0;
                    else
                        dntoast.hide();
                }
                else
                    clicks++;
                dt = dt1;
            });
            dntoast.initialized = true;
        },
        defaultInterval: 15000,
        message: function (mesg, interval) {
            dntoast.showToast(mesg, interval, 'green');
        },

        showToast: function (mesg, interval, color) {
            if (!dntoast.initialized)
                dntoast.inittoast();

            $('#dntoast .message').html(mesg);
            $('#dntoast').css({ 'background-color': color, 'display': 'block' });
            if (!interval)
                interval = dntoast.defaultInterval;
            else if (interval < 100)
                    interval = interval * 1000;            
            if (this.messageTimeOut != null)
                clearTimeout(this.messageTimeOut);
            this.messageTimeOut = setTimeout(function () {
                dntoast.hide();
            }, interval);
        },
        messageTimeOut: null,
        error: function (mesg, interval) {
            dntoast.showToast(mesg, interval, 'red');
        },
        hide: function () {
            $('#dntoast').hide();
        }
    }