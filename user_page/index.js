(async () => {

    if(typeof _getCookie('token') == 'undefined')
    {
        location.href = "../login page";
    };

    var _token              = _getCookie('token');
    var _ServerData         = await post_data({'token': _token, 'type': 'index'});
    var ServerData          = _ServerData['data']['data'];
    var PremissionPosrts    = [];

    console.log(ServerData);

    (async () => {

        $('.index_page_header_row_user_text span').html(`${ServerData['User']['login']}`);
        $('.user_page_body_row_body').empty();

        if(
            typeof ServerData['User']['permissions_live'] != 'undefined' &&
            typeof ServerData['User']['permissions_live_time'] != 'undefined' &&
            new Date(ServerData['User']['permissions_live_time']).getTime() > new Date().getTime()
        )
        {
            for(var prmSports of ServerData['User']['permissions_live'])
            {
                $('.user_page_body_row_body').append(`
                    <div class="user_page_body_row_body_line">
                        <span>${prmSports['value']}</span>
                    </div>
                `);
            };
        }
        else
        {
            $('.index_page_header_row_buttons span').html(`You don't have a subscription`);
        };

        $('.user_page_body_row_body_button[data="exit"]').click( function () {
            delCookie('token');
        });
    })();

})()