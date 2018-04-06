var doc_preview = {
            init:function(){
                if($('.youtubeVideoModal').length != 0)
                    return;

                var popupHtml = '<div class="modal fade youtubeVideoModal" role="dialog">';
                popupHtml += '<div class="modal-dialog modal-lg">';
                popupHtml += '<div class="modal-content">';
                popupHtml += '<div class="modal-header"><a class="btnclosemodel" data-dismiss="modal"></a></div>';
                popupHtml += '<div class="modal-body">';

                popupHtml += '</div>';//body
                popupHtml += '</div>';//modal-content
                popupHtml += '</div>';//modal-dialog
                popupHtml += '</div>';//modal
                $('body').append(popupHtml);
                $(document).on('hidden.bs.modal', '.youtubeVideoModal', function(){
                    $('.youtubeVideoModal .modal-body').html('');
                    $('.youtubeVideoModal .model-footer').html('');
                    $('.youtubeVideoModal .modal-content').removeClass('pdf');
                });
                $('.youtubeVideoModal').click(function(e){
                    var target = $(e.target);
                    if(target.closest('.modal-content').length==0)
                        $('.youtubeVideoModal').modal('hide');
                });
            },
            doc:function(url){
                if(!url)
                    return;
                if(url.indexOf(dn_base_web_url) < 0)
                {
                    url = dn_base_web_url + url;
                }
                var embedHtml = '<div class="embed-responsive embed-responsive-16by9">';
                embedHtml += '<embed src="'+url+'" />' ;
                embedHtml += '</div>';
                $('.youtubeVideoModal .modal-body').html(embedHtml);
                $('.youtubeVideoModal').modal('show');
            },
            video:function(url){
                if(!url)
                    return;
                url += '?autoplay=1&rel=0';
                var embedHtml = '<div class="embed-responsive embed-responsive-16by9">';
                embedHtml += '<iframe class="embed-responsive-item" frameborder="0" src="'+url+'" allowfullscreen=""></iframe>';
                embedHtml += '</div>';
                $('.youtubeVideoModal .modal-body').html(embedHtml);
                $('.youtubeVideoModal').modal('show');
            },
            image:function(url){
                if(!url)
                    return;
                $('.youtubeVideoModal .modal-body').html('<img src="'+ url+'/>');
                $('.youtubeVideoModal').modal('show');
            }
        };