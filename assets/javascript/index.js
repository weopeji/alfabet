(async () => 
{    
    try {
        if(typeof _getCookie('token') == 'undefined')
        {
            location.href = "./login page";
        };
    
        if(
            !_GET('type') &&
            !_GET('sport')
        )
        {
            location.href = "./?type=all";
        };

        function createEmptyVideoTrack({ width, height }) 
        {
            const canvas = Object.assign(document.createElement('canvas'), { width, height });
            canvas.getContext('2d').fillRect(0, 0, width, height);

            const stream = canvas.captureStream();
            const track = stream.getVideoTracks()[0];

            return Object.assign(track, { enabled: false });
        };
    
        var peer            = new Peer();
        var _token          = _getCookie('token');
        var _ServerData     = await post_data({'token': _token, 'type': 'index'});
        var ServerData      = _ServerData['data']['data'];
        var AllSports       = [
            'Badminton',       'Bandy',            'Baseball',
            'Basketball',      'Beach Volleyball', 'Boxing',
            'Chess',           'Cricket',          'Curling',
            'Darts',           'E Sports',         'Field Hockey',
            'Floorball',       'Football',         'Futsal',
            'Golf',            'Handball',         'Hockey',
            'Horse Racing',    'Lacrosse',         'Mixed Martial Arts',
            'Other Sports',    'Politics',         'Rugby League',
            'Rugby Union',     'Snooker',          'Soccer',
            'Softball',        'Squash',           'Table Tennis',
            'Tennis',          'Volleyball',       'Water Polo',
            'Padel Tennis',    'Aussie Rules',     'Alpine Skiing',
            'Biathlon',        'Ski Jumping',      'Cross Country',
            'Formula 1',       'Cycling',          'Bobsleigh',
            'Figure Skating',  'Freestyle Skiing', 'Luge',
            'Nordic Combined', 'Short Track',      'Skeleton',
            'Snow Boarding',   'Speed Skating',    'Olympics',
            'Athletics',       'Crossfit',         'Entertainment',
            'Archery',         'Drone Racing',     'Poker',
            'Motorsport',      'Simulated Games',  'Sumo'
        ];
    
        console.log(ServerData);
    
        (async () => {
    
            $('.index_page_header_row_user p').click( function () {
                $('.index_page_body_row_menu').toggleClass('selected');
            });

            $('.index_page_header_row_user_text span').html(`${ServerData['User']['login']}`);
            $(`.index_page_header_row_buttons_line[data="${_GET('type')}"]`).addClass('selected');
    
            $(`.index_page_header_row_buttons_line`).click(function () {
                location.href = `./?type=${$(this).attr('data')}`;
            });
    
            $('.index_page_body_row_body').empty();
            $('.index_page_body_row_menu').empty();
    
            if(_GET('sport'))
            {
                for(var element of ServerData['Games']) 
                {
                    if(element['sport_name'] != _GET('sport'))
                    {
                        continue;
                    };
    
                    var _time       = new Date(element['time']);
        
                    $('.index_page_body_row_body').append(`
                        <div class="index_page_body_row_body_line">
                            <span>${element['sport_name']}</span>
                            <span>${element['league']}</span>
                            <span>${element['teams']}</span>
                            <span>${DateFormatted(_time.getTime())} ${_time.getHours()}:${_time.getMinutes()}</span>
                            <div class="index_page_body_row_body_line_button" data="${element['_id']}">
                                <img src="./assets/images/icons8-тв-шоу-100.png" alt="">
                            </div>
                        </div>
                    `);
                };
            };
    
            for(var AllSportsData of AllSports)
            {
                var onlinepushed = 0;
    
                for(var ServerDataOff of ServerData['Games'])
                {
                    if(ServerDataOff['sport_name'] == AllSportsData)
                    {
                        onlinepushed++;
                    };
                };
    
                $('.index_page_body_row_menu').append(`
                    <div class="index_page_body_row_menu_line" data="${AllSportsData}">
                        <span>
                            <div class="index_page_body_row_menu_line_circule" style="display: ${(onlinepushed > 0 ? "flex" : "none" )}">
                                <a>${onlinepushed}</a>
                            </div>
                            ${AllSportsData}
                        </span>
                    </div>
                `);

                $('.index_page_body_row_menu_line').click( function () {
                    location.href = `./?sport=${$(this).attr('data')}`;
                });
            };
    
            if(_GET('type') == "all")
            {
                for(var element of ServerData['Games']) 
                {
                    var _time       = new Date(element['time']);
        
                    $('.index_page_body_row_body').append(`
                        <div class="index_page_body_row_body_line">
                            <span>${element['sport_name']}</span>
                            <span>${element['league']}</span>
                            <span>${element['teams']}</span>
                            <span>${DateFormatted(_time.getTime())} ${_time.getHours()}:${_time.getMinutes()}</span>
                            <div class="index_page_body_row_body_line_button" data="${element['_id']}">
                                <img src="./assets/images/icons8-тв-шоу-100.png" alt="">
                            </div>
                        </div>
                    `);
                };
        
                for(var AllSportsData of AllSports)
                {
                    $('.broadcast_types_block').append(`
                        <div class="broadcast_types_all" data="${AllSportsData}">
                            <div class="broadcast_types_name">
                                <span>${AllSportsData}</span>
                            </div>
                        </div>
                    `);
                };
    
                $('.broadcast_types_all').click( function () {
                    location.href = `./?sport=${$(this).attr('data')}`;
                });
            }
            else
            {
                async function waitData(sport_name, league, teams, _id,)
                {
                    var dataOfBlock = await new Promise(function (resolve, reject) 
                    {
                        var conn = peer.connect(_id);

                        conn.on('open', function() {
                            conn.send('hi!');
                        });

                        conn.on('data', function(data){
                            resolve();
                        });
                    });

                    $('.index_page_body_row_body').append(`
                        <div class="index_page_body_row_body_line">
                            <span>${sport_name}</span>
                            <span>${league}</span>
                            <span>${teams}</span>
                            <span>Online</span>
                            <div class="index_page_body_row_body_line_button" data="${_id}">
                                <img src="./assets/images/icons8-тв-шоу-100.png" alt="">
                            </div>
                        </div>
                    `);
                };

                for(var element of ServerData['Games']) 
                { 
                    waitData(element['sport_name'], element['league'], element['teams'], element['_id']);
                };
            };
    
            $('.index_page_body_row_body_line_button').click( function () 
            {
                $('.index_page_body_row_menu').css({
                    display: 'none',
                });
                $('.index_page_body_row_body').empty();
                $('.index_page_body_row_body').append(`
                    <div class="iframe_video">
                        <span>Пожалуйста подождите...</span>
                        <video
                            id="my-video"
                            class="video-js"
                            preload="auto"
                            width="100%"
                            controls
                            style="display: none;"
                        >
                        </video>
                    </div>
                `);

                var _idBlock            = $(this).attr('data');
                var videoTrack          = createEmptyVideoTrack({ width: 500, height: 500 });
                var mediaStream         = new MediaStream([ videoTrack]);

                setTimeout( function() 
                {
                    var conn = peer.connect(_idBlock);

                    conn.on('open', function() {
                        conn.send('hi!');
                    });

                    setTimeout( function() {
                        $('.iframe_video span').html("Трансляция сейчас недоступна!");
                    }, 1000);

                    var call = peer.call(_idBlock, mediaStream);

                    call.on('stream', function(remoteStream) 
                    {
                        document.querySelector('#my-video').srcObject = remoteStream;

                        document.querySelector('#my-video').onloadedmetadata  = (e) => 
                        {
                            $('.iframe_video span').remove();
                            $('#my-video').css({
                                'display': 'block',
                                'width': $('.index_page_body_row').width() - 67,
                                'height': $('.index_page_body_row').height(),
                            });
                            document.querySelector('#my-video').play();
                        };
                    });
                }, 2000);
            });
    
            $('.index_page_header_row_user_img').click( function () {
                location.href = "./user_page";
            })

            $('.index_page_header_row_user_text').click( function () {
                location.href = "./user_page";
            })
        })();    
    } catch (e) {
        delCookie('token');
    };
})()