(async () => 
{    
    var LiveSports = [
        {
            name: "Football",
            id: '12453',
            league: "Euro",
            teams: "Slovenia - San Marino",
            start_play: "19:00",
        },
        {
            name: "HueBall",
            id: '12453',
            league: "Africa",
            teams: "Huebolia - Catalunya",
            start_play: "23:00",
        },
        {
            name: "Pizdabol",
            id: '12453',
            league: "Pizdalia",
            teams: "Pizdaliniya - Pipizdada",
            start_play: "13:00",
        },
        {
            name: "Football",
            id: '12453',
            league: "Euro",
            teams: "Slovenia - San Marino",
            start_play: "19:00",
        },
        {
            name: "Football",
            id: '12453',
            league: "Euro",
            teams: "Slovenia - San Marino",
            start_play: "19:00",
        },
        {
            name: "Football",
            id: '12453',
            league: "Euro",
            teams: "Slovenia - San Marino",
            start_play: "19:00",
        },
    ];

    $('.broadcast_box .broadcast_line').remove();

    for(var element of LiveSports) 
    {
        $('.broadcast_box').append(`
            <div class="broadcast_line" data="">
                <div class="broadcast_name">
                    <div class="online_ofline">
                        <img src="./assets/images/online_ofline.png" alt="">
                    </div>
                    <span>${element['name']}</span>
                </div>
                <div class="league">
                    <span>${element['league']}</span>
                </div>
                <div class="teams">
                    <span>${element['teams']}</span>
                </div>
                <div class="start_play">
                    <span>${element['start_play']}</span>
                </div>
                <div class="watch_broadcast">
                    <img src="./assets/images/morethen.png" alt="">
                </div>
            </div>
        `);
    };
})()